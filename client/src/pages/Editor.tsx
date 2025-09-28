import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CodeEditor } from "@/components/CodeEditor";
import { useLanguage } from "@/components/LanguageProvider";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import type { Project } from "@shared/schema";
import {
  Play,
  Save,
  Download,
  Upload,
  Settings,
  Eye,
  Code2,
  FileText,
  Folder,
  ChevronRight,
  Loader2,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Wand2
} from "lucide-react";

interface GeneratedCode {
  files: Record<string, string>;
  framework: string;
  language: string;
  deploymentInstructions: string;
}

interface ImproveCodeResponse {
  improvedCode: string;
}

export default function Editor() {
  const { id } = useParams();
  const { t, isRTL } = useLanguage();
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeFile, setActiveFile] = useState<string>("");
  const [fileContents, setFileContents] = useState<Record<string, string>>({});
  const [improveDialogOpen, setImproveDialogOpen] = useState(false);
  const [improvementRequest, setImprovementRequest] = useState("");

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: project, isLoading: projectLoading } = useQuery<Project>({
    queryKey: ["/api/projects", id],
    retry: false,
    enabled: !!id && isAuthenticated,
  });

  const updateProjectMutation = useMutation({
    mutationFn: async (updates: Partial<Project>) => {
      const response = await apiRequest("PUT", `/api/projects/${id}`, updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", id] });
      toast({
        title: "تم حفظ المشروع بنجاح",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "خطأ في حفظ المشروع",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const improveCodeMutation = useMutation<ImproveCodeResponse, Error, { filename: string; code: string; improvements: string }>({ 
    mutationFn: async ({ code, improvements }) => {
      const response = await apiRequest("POST", `/api/projects/${id}/improve`, {
        code,
        improvements,
      });
      return response.json();
    },
    onSuccess: (data, variables) => {
      if (data.improvedCode) {
        // Update file contents using functional update to avoid stale closure
        setFileContents(prev => {
          const nextFiles = {
            ...prev,
            [variables.filename]: data.improvedCode,
          };
          
          // Auto-save the improved code using the latest state
          if (project) {
            const updatedSourceCode = {
              ...(project.sourceCode as GeneratedCode || {}),
              files: nextFiles,
            };
            updateProjectMutation.mutate({ sourceCode: updatedSourceCode });
          }
          
          return nextFiles;
        });
        
        toast({
          title: "تم تحسين الكود بنجاح",
          description: "تم تطبيق التحسينات وحفظها تلقائياً",
        });
        setImproveDialogOpen(false);
        setImprovementRequest("");
      } else {
        toast({
          title: "خطأ في تحسين الكود",
          description: "لم يتم إرجاع كود محسّن. يرجى المحاولة مرة أخرى",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "خطأ في تحسين الكود",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Initialize file contents when project loads
  useEffect(() => {
    if (project?.sourceCode) {
      const generatedCode = project.sourceCode as GeneratedCode;
      setFileContents(generatedCode.files || {});
      
      // Set first file as active
      const firstFile = Object.keys(generatedCode.files || {})[0];
      if (firstFile && !activeFile) {
        setActiveFile(firstFile);
      }
    }
  }, [project, activeFile]);

  const handleSave = () => {
    if (project && fileContents) {
      const updatedSourceCode = {
        ...(project.sourceCode as GeneratedCode || {}),
        files: fileContents,
      };
      updateProjectMutation.mutate({ sourceCode: updatedSourceCode });
    }
  };

  const handleFileChange = (filename: string, content: string | undefined) => {
    if (content !== undefined) {
      setFileContents(prev => ({
        ...prev,
        [filename]: content,
      }));
    }
  };

  const handleImproveCode = () => {
    if (!activeFile || !fileContents[activeFile]) {
      toast({
        title: "اختر ملف أولاً",
        description: "يجب اختيار ملف وفتحه في المحرر قبل تحسين الكود",
        variant: "destructive",
      });
      return;
    }

    if (!improvementRequest.trim()) {
      toast({
        title: "أدخل متطلبات التحسين",
        description: "يجب كتابة وصف للتحسينات المطلوبة",
        variant: "destructive",
      });
      return;
    }

    improveCodeMutation.mutate({
      filename: activeFile,
      code: fileContents[activeFile],
      improvements: improvementRequest,
    });
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js':
      case 'jsx':
      case 'ts':
      case 'tsx':
        return <Code2 className="w-4 h-4 text-yellow-500" />;
      case 'html':
        return <FileText className="w-4 h-4 text-orange-500" />;
      case 'css':
        return <FileText className="w-4 h-4 text-blue-500" />;
      case 'json':
        return <FileText className="w-4 h-4 text-green-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getLanguageFromFile = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js':
      case 'jsx':
        return 'javascript';
      case 'ts':
      case 'tsx':
        return 'typescript';
      case 'html':
        return 'html';
      case 'css':
        return 'css';
      case 'json':
        return 'json';
      case 'py':
        return 'python';
      case 'php':
        return 'php';
      default:
        return 'plaintext';
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: "مسودة", color: "bg-gray-100 text-gray-800", icon: FileText },
      building: { label: "جاري الإنشاء", color: "bg-blue-100 text-blue-800", icon: Loader2 },
      ready: { label: "جاهز", color: "bg-green-100 text-green-800", icon: CheckCircle },
      deployed: { label: "منشور", color: "bg-purple-100 text-purple-800", icon: ExternalLink },
      error: { label: "خطأ", color: "bg-red-100 text-red-800", icon: AlertTriangle },
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const StatusIcon = config.icon;

    return (
      <Badge className={`${config.color} border-0`}>
        <StatusIcon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  if (isLoading || projectLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">جاري تحميل المشروع...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">المشروع غير موجود</h2>
            <p className="text-muted-foreground">لم يتم العثور على هذا المشروع أو ليس لديك صلاحية للوصول إليه.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const sourceCode = project.sourceCode as GeneratedCode;
  const files = sourceCode?.files || {};
  const fileList = Object.keys(files);

  return (
    <div className="h-screen flex flex-col" data-testid="editor-page">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-xl font-semibold" data-testid="project-title">
                  {project.name}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  {getStatusBadge(project.status || 'draft')}
                  <Badge variant="outline">{project.framework}</Badge>
                  <Badge variant="outline">{project.language}</Badge>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                disabled={updateProjectMutation.isPending}
                data-testid="button-save"
              >
                <Save className="w-4 h-4 mr-2" />
                {updateProjectMutation.isPending ? "جاري الحفظ..." : "حفظ"}
              </Button>
              
              {project.deployUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => project.deployUrl && window.open(project.deployUrl, '_blank')}
                  data-testid="button-preview"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  معاينة
                </Button>
              )}
              
              <Button variant="outline" size="sm" data-testid="button-deploy">
                <Upload className="w-4 h-4 mr-2" />
                نشر
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-64 bg-muted/30 border-r flex flex-col" data-testid="file-explorer">
          <div className="p-4 border-b">
            <h3 className="font-medium text-sm text-muted-foreground">مستكشف الملفات</h3>
          </div>
          
          <div className="flex-1 overflow-auto">
            {fileList.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground text-sm">
                لا توجد ملفات
              </div>
            ) : (
              <div className="p-2">
                {fileList.map((filename) => (
                  <button
                    key={filename}
                    onClick={() => setActiveFile(filename)}
                    className={`w-full flex items-center gap-2 p-2 rounded-md text-sm hover:bg-accent hover:text-accent-foreground transition-colors ${
                      activeFile === filename ? 'bg-accent text-accent-foreground' : ''
                    }`}
                    data-testid={`file-${filename}`}
                  >
                    {getFileIcon(filename)}
                    <span className="truncate">{filename}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Editor */}
        <div className="flex-1 flex flex-col">
          {activeFile ? (
            <>
              {/* File Tabs */}
              <div className="border-b bg-muted/10">
                <div className="flex items-center px-4 py-2">
                  <div className="flex items-center gap-2">
                    {getFileIcon(activeFile)}
                    <span className="text-sm font-medium" data-testid="active-file-name">
                      {activeFile}
                    </span>
                  </div>
                </div>
              </div>

              {/* Editor */}
              <div className="flex-1">
                <CodeEditor
                  value={fileContents[activeFile] || ""}
                  onChange={(content) => handleFileChange(activeFile, content)}
                  language={getLanguageFromFile(activeFile)}
                  height="100%"
                />
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Code2 className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">اختر ملف للتحرير</h3>
                <p className="text-sm">اختر ملف من مستكشف الملفات لبدء التحرير</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <div className="w-80 bg-muted/30 border-l">
          <Tabs defaultValue="info" className="h-full flex flex-col">
            <div className="border-b">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info">معلومات</TabsTrigger>
                <TabsTrigger value="preview">معاينة</TabsTrigger>
                <TabsTrigger value="settings">إعدادات</TabsTrigger>
              </TabsList>
            </div>
            
            <div className="flex-1 overflow-auto">
              <TabsContent value="info" className="p-4 space-y-4">
                <div>
                  <h4 className="font-medium mb-2">وصف المشروع</h4>
                  <p className="text-sm text-muted-foreground" data-testid="project-description">
                    {project.description || "لا يوجد وصف"}
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium mb-2">التقنيات المستخدمة</h4>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{project.framework}</Badge>
                    <Badge variant="outline">{project.language}</Badge>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium mb-2">إحصائيات الملفات</h4>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div>عدد الملفات: {fileList.length}</div>
                    <div>إجمالي الأسطر: {Object.values(files).reduce((acc, content) => acc + content.split('\n').length, 0)}</div>
                  </div>
                </div>
                
                {sourceCode?.deploymentInstructions && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-2">تعليمات النشر</h4>
                      <pre className="text-xs bg-muted p-3 rounded-md overflow-auto whitespace-pre-wrap">
                        {sourceCode.deploymentInstructions}
                      </pre>
                    </div>
                  </>
                )}
              </TabsContent>
              
              <TabsContent value="preview" className="p-4">
                <div className="text-center text-muted-foreground">
                  <Eye className="w-12 h-12 mx-auto mb-4" />
                  <h4 className="font-medium mb-2">المعاينة المباشرة</h4>
                  <p className="text-sm mb-4">قريباً - ستتمكن من معاينة مشروعك مباشرة هنا</p>
                  {project.deployUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => project.deployUrl && window.open(project.deployUrl, '_blank')}
                      data-testid="button-open-preview"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      فتح في نافذة جديدة
                    </Button>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="settings" className="p-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">إعدادات المشروع</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">عام</span>
                        <input type="checkbox" checked={project.isPublic || false} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">النشر التلقائي</span>
                        <input type="checkbox" />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-medium mb-2">إجراءات</h4>
                    <div className="space-y-2">
                      <Dialog open={improveDialogOpen} onOpenChange={setImproveDialogOpen}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full justify-start"
                            disabled={!activeFile || improveCodeMutation.isPending}
                            data-testid="button-improve-code"
                          >
                            <Wand2 className="w-4 h-4 mr-2" />
                            {improveCodeMutation.isPending ? "جاري التحسين..." : "تحسين الكود"}
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[525px]">
                          <DialogHeader>
                            <DialogTitle>تحسين الكود باستخدام الذكاء الاصطناعي</DialogTitle>
                            <DialogDescription>
                              اكتب وصفاً للتحسينات التي تريد تطبيقها على الملف المحدد: {activeFile}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="improvements">متطلبات التحسين</Label>
                              <Textarea
                                id="improvements"
                                placeholder="مثال: أضف دعم للغة العربية، حسن الأداء، أضف معالجة الأخطاء..."
                                value={improvementRequest}
                                onChange={(e) => setImprovementRequest(e.target.value)}
                                className="min-h-[100px]"
                                data-testid="textarea-improvements"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setImproveDialogOpen(false);
                                setImprovementRequest("");
                              }}
                              disabled={improveCodeMutation.isPending}
                              data-testid="button-cancel-improvement"
                            >
                              إلغاء
                            </Button>
                            <Button
                              onClick={handleImproveCode}
                              disabled={improveCodeMutation.isPending || !improvementRequest.trim()}
                              data-testid="button-submit-improvement"
                            >
                              {improveCodeMutation.isPending ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  جاري التحسين...
                                </>
                              ) : (
                                "تحسين الكود"
                              )}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Download className="w-4 h-4 mr-2" />
                        تحميل المشروع
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <Settings className="w-4 h-4 mr-2" />
                        إعدادات متقدمة
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
