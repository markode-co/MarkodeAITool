import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/components/LanguageProvider";
import { useState } from "react";
import { 
  Search, 
  MessageCircle, 
  Book, 
  FileText, 
  Video, 
  Mail,
  ChevronRight,
  ExternalLink
} from "lucide-react";

export default function HelpCenter() {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");

  const helpCategories = [
    {
      icon: Book,
      title: "دليل البدء السريع",
      description: "تعلم كيفية إنشاء أول مشروع في 5 دقائق",
      articles: 12,
      color: "text-blue-500"
    },
    {
      icon: FileText,
      title: "إدارة المشاريع",
      description: "كيفية إنشاء وتحرير ونشر مشاريعك",
      articles: 8,
      color: "text-green-500"
    },
    {
      icon: Video,
      title: "شروحات فيديو",
      description: "مقاطع فيديو تعليمية خطوة بخطوة",
      articles: 15,
      color: "text-purple-500"
    }
  ];

  const popularArticles = [
    {
      title: "كيفية إنشاء مشروع جديد",
      description: "دليل شامل لإنشاء مشروع باستخدام الذكاء الاصطناعي",
      readTime: "5 دقائق"
    },
    {
      title: "استخدام القوالب الجاهزة",
      description: "كيفية اختيار وتخصيص القوالب لمشروعك",
      readTime: "3 دقائق"
    },
    {
      title: "نشر مشروعك على الإنترنت",
      description: "خطوات نشر مشروعك وربط نطاق مخصص",
      readTime: "7 دقائق"
    },
    {
      title: "تحرير الكود يدوياً",
      description: "استخدام محرر الأكواد المدمج لتخصيص مشروعك",
      readTime: "10 دقائق"
    }
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">🛟 مركز المساعدة</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            ابحث عن إجابات لأسئلتك أو تواصل مع فريق الدعم
          </p>
          
          {/* Search */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="ابحث في مركز المساعدة..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg"
              data-testid="input-help-search"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {helpCategories.map((category, index) => (
            <Card key={index} className="feature-card cursor-pointer hover:shadow-lg transition-all" data-testid={`help-category-${index}`}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg bg-muted flex items-center justify-center ${category.color}`}>
                    <category.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {category.articles} مقال
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{category.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Popular Articles */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">📚 المقالات الأكثر شعبية</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {popularArticles.map((article, index) => (
              <Card key={index} className="feature-card cursor-pointer hover:shadow-lg transition-all" data-testid={`popular-article-${index}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-lg">{article.title}</h3>
                    <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0 ml-2" />
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">{article.description}</p>
                  <div className="text-xs text-muted-foreground">
                    وقت القراءة: {article.readTime}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <Card className="bg-muted/50 p-8 text-center">
          <div className="max-w-2xl mx-auto">
            <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">لا تجد ما تبحث عنه؟</h2>
            <p className="text-muted-foreground mb-6">
              فريق الدعم لدينا جاهز لمساعدتك على مدار الساعة. تواصل معنا وسنرد عليك في أقرب وقت ممكن.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" data-testid="button-contact-support">
                <Mail className="w-4 h-4 mr-2" />
                تواصل مع الدعم
              </Button>
              <Button variant="outline" size="lg" data-testid="button-live-chat">
                <MessageCircle className="w-4 h-4 mr-2" />
                دردشة مباشرة
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}