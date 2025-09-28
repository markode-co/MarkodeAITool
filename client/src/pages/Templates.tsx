import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLanguage } from "@/components/LanguageProvider";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Template } from "@shared/schema";
import {
  Search,
  Filter,
  Code2,
  ExternalLink,
  Star,
  Download,
  Play,
  Sparkles,
  Globe,
  ShoppingCart,
  User,
  Camera,
  Heart,
  BookOpen,
  Briefcase,
  Gamepad2,
  Music,
  Utensils
} from "lucide-react";
import { useLocation } from "wouter";

const createFromTemplateSchema = z.object({
  name: z.string().min(1, "اسم المشروع مطلوب"),
  description: z.string().optional(),
});

type CreateFromTemplate = z.infer<typeof createFromTemplateSchema>;

export default function Templates() {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const form = useForm<CreateFromTemplate>({
    resolver: zodResolver(createFromTemplateSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { data: templates = [], isLoading } = useQuery<Template[]>({
    queryKey: ["/api/templates"],
    retry: false,
  });

  const createFromTemplateMutation = useMutation({
    mutationFn: async ({ templateId, data }: { templateId: string; data: CreateFromTemplate }) => {
      const response = await apiRequest("POST", `/api/projects/from-template/${templateId}`, data);
      return response.json();
    },
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      setIsCreateDialogOpen(false);
      form.reset();
      toast({
        title: "تم إنشاء المشروع بنجاح",
        description: "تم إنشاء مشروعك من القالب",
      });
      setLocation(`/editor/${project.id}`);
    },
    onError: (error) => {
      toast({
        title: "خطأ في إنشاء المشروع",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const categories = [
    { id: "all", label: "جميع الفئات", icon: Globe },
    { id: "ecommerce", label: "متاجر إلكترونية", icon: ShoppingCart },
    { id: "portfolio", label: "معرض أعمال", icon: User },
    { id: "blog", label: "مدونة", icon: BookOpen },
    { id: "business", label: "أعمال", icon: Briefcase },
    { id: "restaurant", label: "مطاعم", icon: Utensils },
    { id: "photography", label: "تصوير", icon: Camera },
    { id: "health", label: "صحة", icon: Heart },
    { id: "gaming", label: "ألعاب", icon: Gamepad2 },
    { id: "music", label: "موسيقى", icon: Music },
  ];

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || template.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleUseTemplate = (template: Template) => {
    if (!isAuthenticated) {
      toast({
        title: "تسجيل الدخول مطلوب",
        description: "يجب تسجيل الدخول لاستخدام القوالب",
      });
      window.location.href = "/api/login";
      return;
    }

    setSelectedTemplate(template);
    form.setValue("name", template.name);
    form.setValue("description", template.description || "");
    setIsCreateDialogOpen(true);
  };

  const onSubmit = (data: CreateFromTemplate) => {
    if (selectedTemplate) {
      createFromTemplateMutation.mutate({
        templateId: selectedTemplate.id,
        data,
      });
    }
  };

  const getFrameworkColor = (framework: string) => {
    const colors: Record<string, string> = {
      react: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100",
      vue: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
      angular: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100",
      svelte: "bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100",
      nodejs: "bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100",
      nextjs: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100",
      flutter: "bg-cyan-100 text-cyan-800 dark:bg-cyan-800 dark:text-cyan-100",
    };
    return colors[framework.toLowerCase()] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100";
  };

  return (
    <div className="container mx-auto px-4 py-8" data-testid="templates-page">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="mb-6">
          <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4" data-testid="templates-title">
            🎨 {t("templates.title")}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="templates-subtitle">
            {t("templates.subtitle")}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="البحث في القوالب..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            data-testid="input-search-templates"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const CategoryIcon = category.icon;
            return (
              <Button
                key={category.id}
                variant={categoryFilter === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setCategoryFilter(category.id)}
                className="flex items-center gap-2"
                data-testid={`filter-${category.id}`}
              >
                <CategoryIcon className="w-4 h-4" />
                {category.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Templates Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-muted rounded-t-lg"></div>
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredTemplates.length === 0 ? (
        <Card className="text-center py-12" data-testid="empty-templates">
          <CardContent>
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">لم يتم العثور على قوالب</h3>
            <p className="text-muted-foreground">جرب البحث بكلمات مختلفة أو غير الفلتر</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="feature-card group overflow-hidden" data-testid={`template-card-${template.id}`}>
              {/* Template Preview Image */}
              <div className="relative h-48 bg-gradient-to-br from-primary/10 to-accent/10 overflow-hidden">
                {template.imageUrl ? (
                  <img
                    src={template.imageUrl}
                    alt={template.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Code2 className="w-12 h-12 text-primary/60" />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <Badge className={getFrameworkColor(template.framework)}>
                    {template.framework}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors" data-testid="template-name">
                    {template.name}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2" data-testid="template-description">
                    {template.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className="text-xs">
                    {template.language}
                  </Badge>
                  <Badge variant="outline" className="text-xs capitalize">
                    {template.category}
                  </Badge>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleUseTemplate(template)}
                    className="flex-1"
                    data-testid={`button-use-${template.id}`}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {t("template.use")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Template preview functionality would go here
                      toast({
                        title: "المعاينة قريباً",
                        description: "سيتم إضافة خاصية معاينة القوالب قريباً",
                      });
                    }}
                    data-testid={`button-preview-${template.id}`}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Popular Templates Section */}
      {!searchTerm && categoryFilter === "all" && templates.length > 0 && (
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">🔥 القوالب الأكثر شعبية</h2>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" />
              مميز
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.slice(0, 3).map((template) => (
              <Card key={`popular-${template.id}`} className="feature-card border-primary/20" data-testid={`popular-template-${template.id}`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge className={getFrameworkColor(template.framework)}>
                      {template.framework}
                    </Badge>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium">4.8</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold mb-2">{template.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                    {template.description}
                  </p>
                  <Button
                    size="sm"
                    onClick={() => handleUseTemplate(template)}
                    className="w-full"
                    data-testid={`button-use-popular-${template.id}`}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    استخدم هذا القالب
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Create Project Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>إنشاء مشروع من القالب</DialogTitle>
          </DialogHeader>
          
          {selectedTemplate && (
            <div className="mb-4 p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Code2 className="w-4 h-4 text-primary" />
                <span className="font-medium text-sm">{selectedTemplate.name}</span>
              </div>
              <Badge className={getFrameworkColor(selectedTemplate.framework)}>
                {selectedTemplate.framework}
              </Badge>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.project.name")}</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-template-project-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.project.description")} (اختياري)</FormLabel>
                    <FormControl>
                      <Input {...field} data-testid="input-template-project-description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2 justify-end pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  data-testid="button-cancel-template"
                >
                  {t("button.cancel")}
                </Button>
                <Button
                  type="submit"
                  disabled={createFromTemplateMutation.isPending}
                  data-testid="button-create-from-template"
                >
                  {createFromTemplateMutation.isPending ? t("button.loading") : t("button.create")}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
