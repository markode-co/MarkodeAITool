import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/components/LanguageProvider";
import { useLocation } from "wouter";
import { 
  Construction, 
  ArrowLeft,
  Bell,
  Calendar
} from "lucide-react";

export default function ComingSoon() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();

  // Default content based on current path
  const getPageContent = () => {
    const currentPath = window.location.pathname;
    
    switch (currentPath) {
      case '/api':
        return {
          title: "📡 مستندات API",
          description: "سنقوم بتوفير مستندات شاملة لـ API ماركود للمطورين قريباً"
        };
      case '/status':
        return {
          title: "🔄 حالة الخدمة",
          description: "صفحة مراقبة حالة الخدمات والسيرفرات ستكون متاحة قريباً"
        };
      case '/jobs':
        return {
          title: "💼 الوظائف",
          description: "نحن نبحث عن المواهب المميزة! صفحة الوظائف ستكون متاحة قريباً"
        };
      case '/blog':
        return {
          title: "📝 المدونة",
          description: "مدونة ماركود مع أحدث الأخبار والتحديثات والمقالات التقنية قريباً"
        };
      case '/partners':
        return {
          title: "🤝 الشراكات",
          description: "معلومات الشراكات والتعاون مع ماركود ستكون متاحة قريباً"
        };
      default:
        return {
          title: "🚧 قريباً",
          description: "هذه الصفحة قيد التطوير وستكون متاحة قريباً"
        };
    }
  };

  const content = getPageContent();

  return (
    <div className="min-h-screen py-20 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <Card className="max-w-2xl mx-auto text-center p-8">
          <CardContent className="p-0">
            <div className="w-20 h-20 rounded-full gradient-bg flex items-center justify-center mx-auto mb-6">
              <Construction className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-4xl font-bold mb-4">{content.title}</h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              {content.description}
            </p>

            <div className="bg-muted/50 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Bell className="w-5 h-5 text-primary" />
                <span className="font-semibold">تنبيه عند الإطلاق</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                أدخل بريدك الإلكتروني وسنرسل لك تنبيه عند إطلاق هذه الميزة
              </p>
              <div className="flex gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="بريدك الإلكتروني"
                  className="flex-1 px-4 py-2 rounded-lg border border-border bg-background"
                  data-testid="input-notify-email"
                />
                <Button data-testid="button-notify-me">
                  أشعرني
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-muted/30 rounded-lg">
                <Calendar className="w-6 h-6 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-sm">الإطلاق المتوقع</h3>
                <p className="text-xs text-muted-foreground">الربع الأول 2025</p>
              </div>
              
              <div className="p-4 bg-muted/30 rounded-lg">
                <Construction className="w-6 h-6 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-sm">قيد التطوير</h3>
                <p className="text-xs text-muted-foreground">نعمل عليها الآن</p>
              </div>
              
              <div className="p-4 bg-muted/30 rounded-lg">
                <Bell className="w-6 h-6 text-primary mx-auto mb-2" />
                <h3 className="font-semibold text-sm">إشعارات</h3>
                <p className="text-xs text-muted-foreground">سنخبرك عند الانتهاء</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => setLocation('/')}
                data-testid="button-back-home"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                العودة للرئيسية
              </Button>
              <Button 
                onClick={() => setLocation('/contact')}
                data-testid="button-contact-us"
              >
                تواصل معنا للاستفسار
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}