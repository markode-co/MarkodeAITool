import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useLanguage } from "@/components/LanguageProvider";
import { 
  Code2, 
  Sparkles, 
  Zap, 
  Globe, 
  Shield, 
  Users,
  Brain,
  Rocket,
  Clock,
  Settings,
  Palette,
  Database
} from "lucide-react";

export default function Features() {
  const { t } = useLanguage();
  
  const features = [
    {
      icon: <Brain className="w-8 h-8 text-blue-600" />,
      title: t("feature.ai.title"),
      description: t("feature.ai.description"),
      badge: t("feature.ai.badge")
    },
    {
      icon: <Code2 className="w-8 h-8 text-green-600" />,
      title: t("feature.generation.title"),
      description: t("feature.generation.description"),
      badge: t("feature.generation.badge")
    },
    {
      icon: <Sparkles className="w-8 h-8 text-purple-600" />,
      title: t("feature.improvement.title"),
      description: t("feature.improvement.description"),
      badge: t("feature.improvement.badge")
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-600" />,
      title: t("feature.speed.title"),
      description: t("feature.speed.description"),
      badge: t("feature.speed.badge")
    },
    {
      icon: <Globe className="w-8 h-8 text-indigo-600" />,
      title: t("feature.arabic.title"),
      description: t("feature.arabic.description"),
      badge: t("feature.arabic.badge")
    },
    {
      icon: <Palette className="w-8 h-8 text-pink-600" />,
      title: t("feature.editor.title"),
      description: t("feature.editor.description"),
      badge: t("feature.editor.badge")
    },
    {
      icon: <Settings className="w-8 h-8 text-gray-600" />,
      title: t("feature.templates.title"),
      description: t("feature.templates.description"),
      badge: t("feature.templates.badge")
    },
    {
      icon: <Database className="w-8 h-8 text-blue-600" />,
      title: t("feature.management.title"),
      description: t("feature.management.description"),
      badge: t("feature.management.badge")
    },
    {
      icon: <Shield className="w-8 h-8 text-red-600" />,
      title: t("feature.security.title"),
      description: t("feature.security.description"),
      badge: t("feature.security.badge")
    },
    {
      icon: <Users className="w-8 h-8 text-teal-600" />,
      title: t("feature.collaboration.title"),
      description: t("feature.collaboration.description"),
      badge: t("feature.collaboration.badge")
    },
    {
      icon: <Clock className="w-8 h-8 text-orange-600" />,
      title: t("feature.deploy.title"),
      description: t("feature.deploy.description"),
      badge: t("feature.deploy.badge")
    },
    {
      icon: <Rocket className="w-8 h-8 text-emerald-600" />,
      title: t("feature.updates.title"),
      description: t("feature.updates.description"),
      badge: t("feature.updates.badge")
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16" data-testid="features-header">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            {t("features.title")}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {t("features.subtitle")}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:scale-105"
              data-testid={`feature-card-${index}`}
            >
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 w-fit group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <Badge 
                  variant="secondary" 
                  className="mb-2 text-xs"
                  data-testid={`feature-badge-${index}`}
                >
                  {feature.badge}
                </Badge>
                <CardTitle className="text-xl font-bold text-gray-800 dark:text-white">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 dark:text-gray-300 leading-relaxed text-center">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4" data-testid="features-cta-title">
            {t("features.cta.title")}
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            {t("features.cta.subtitle")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3"
                data-testid="button-start-now"
              >
                {t("features.cta.start")}
              </Button>
            </Link>
            <Link href="/pricing">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-3"
                data-testid="button-view-pricing"
              >
                {t("features.cta.pricing")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}