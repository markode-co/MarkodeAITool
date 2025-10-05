// ================================
// 📦 TemplateCard.tsx
// ================================
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/LanguageProvider";
import { useToast } from "@/hooks/use-toast";
import { Code2, ExternalLink, Play } from "lucide-react";
import type { Template } from "@shared/schema";

// ✅ تعريف الخصائص التي يتلقاها الكومبوننت
interface TemplateCardProps {
  template: Template;
  onUseTemplate: (template: Template) => void;
}

// ✅ كومبوننت العرض
export default function TemplateCard({ template, onUseTemplate }: TemplateCardProps) {
  const { t } = useLanguage();
  const { toast } = useToast();

  // 🎨 لون الإطار حسب نوع الفريم وورك
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

  // ✅ المعاينة التجريبية
  const handlePreview = () => {
    toast({
      title: "المعاينة قريباً",
      description: "سيتم إضافة خاصية معاينة القوالب قريباً",
    });
  };

  return (
    <Card className="feature-card group overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* صورة المعاينة */}
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

        {/* شارة الفريم وورك */}
        <div className="absolute top-3 right-3">
          <Badge className={getFrameworkColor(template.framework)}>
            {template.framework}
          </Badge>
        </div>
      </div>

      {/* التفاصيل */}
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
            {template.name}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2">
            {template.description}
          </p>
        </div>

        {/* معلومات إضافية */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="text-xs">
            {template.language}
          </Badge>
          <Badge variant="outline" className="text-xs capitalize">
            {template.category}
          </Badge>
        </div>

        {/* الأزرار */}
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => onUseTemplate(template)}
            className="flex-1"
          >
            <Play className="w-4 h-4 mr-2" />
            {t("template.use")}
          </Button>
          <Button variant="outline" size="sm" onClick={handlePreview}>
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
