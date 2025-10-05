import { useState, useMemo, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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

  // ✅ البحث والفئة
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // ✅ قالب محدد وإنشاء مشروع منه
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // ✅ تأخير البحث (Debounce)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300); // تأخير 300ms مثل Wix وFramer

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // ✅ نموذج إنشاء مشروع
  const form = useForm<CreateFromTemplate>({
    resolver: zodResolver(createFromTemplateSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // ✅ جلب القوالب
  const { data: templates = [], isLoading } = useQuery<Template[]>({
    queryKey: ["/api/templates"],
    retry: false,
  });

  // ✅ إنشاء مشروع من قالب
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
        title: "تم إنشاء المشروع بنجاح 🎉",
        description: "تم إنشاء مشروعك من القالب.",
      });
      setLocation(`/editor/${project.id}`);
    },
    onError: (error) => {
      toast({
        title: "حدث خطأ أثناء إنشاء المشروع",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // ✅ الفئات
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

  // ✅ تصفية القوالب باستخدام useMemo + Debounce
  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const matchesSearch =
        template.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        template.description?.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || template.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [templates, debouncedSearch, categoryFilter]);

  // ✅ اختيار القالب واستخدامه
  const handleUseTemplate = (template: Template) => {
    if (!isAuthenticated) {
      toast({
        title: "تسجيل الدخول مطلوب",
        description: "يرجى تسجيل الدخول لاستخدام القوالب.",
      });
      window.location.href = "/api/login";
      return;
    }

    setSelectedTemplate(template);
    form.setValue("name", template.name);
    form.setValue("description", template.description || "");
    setIsCreateDialogOpen(true);
  };

  // ✅ إرسال النموذج
  const onSubmit = (data: CreateFromTemplate) => {
    if (selectedTemplate) {
      createFromTemplateMutation.mutate({
        templateId: selectedTemplate.id,
        data,
      });
    }
  };

  // ✅ ألوان الأُطر
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
        <div className="w-16 h-16 gradient-bg rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-2">🎨 {t("templates.title")}</h1>
        <p className="text-muted-foreground text-lg">{t("templates.subtitle")}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        {/* 🔍 Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="البحث في القوالب..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* 🧩 Categories */}
        <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
          {categories.map((category) => {
            const CategoryIcon = category.icon;
            return (
              <Button
                key={category.id}
                variant={categoryFilter === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setCategoryFilter(category.id)}
                className="flex items-center gap-2"
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
          {[...Array(8)].map((_, i) => (
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
        <Card className="text-center py-12">
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
            <Card key={template.id} className="feature-card group overflow-hidden hover:shadow-lg transition">
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
                <h3 className="font-semibold text-lg mb-1">{template.name}</h3>
                <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                  {template.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="outline" className="text-xs">
                    {template.language}
                  </Badge>
                  <Badge variant="outline" className="text-xs capitalize">
                    {template.category}
                  </Badge>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" onClick={() => handleUseTemplate(template)} className="flex-1">
                    <Play className="w-4 h-4 mr-2" />
                    {t("template.use")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      toast({
                        title: "قريباً 🚧",
                        description: "سيتم إضافة خاصية المعاينة قريباً",
                      })
                    }
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
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
                      <Input {...field} />
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
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2 justify-end pt-4">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  {t("button.cancel")}
                </Button>
                <Button
                  type="submit"
                  disabled={createFromTemplateMutation.isPending}
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
