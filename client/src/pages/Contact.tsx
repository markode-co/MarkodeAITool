import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/components/LanguageProvider";
import { useState } from "react";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageCircle,
  Send,
  CheckCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const contactInfo = [
    {
      icon: Mail,
      title: "البريد الإلكتروني",
      content: "support@markode.app",
      description: "راسلنا في أي وقت وسنرد خلال 24 ساعة",
      color: "text-blue-500"
    },
    {
      icon: Phone,
      title: "الهاتف",
      content: "+966 11 234 5678",
      description: "دعم هاتفي من السبت إلى الخميس",
      color: "text-green-500"
    },
    {
      icon: MapPin,
      title: "العنوان",
      content: "الرياض، المملكة العربية السعودية",
      description: "حي الملك عبدالله للتقنية المالية",
      color: "text-purple-500"
    },
    {
      icon: Clock,
      title: "ساعات العمل",
      content: "9:00 ص - 6:00 م",
      description: "السبت - الخميس (بتوقيت الرياض)",
      color: "text-orange-500"
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast({
      title: "تم إرسال رسالتك بنجاح!",
      description: "سنتواصل معك خلال 24 ساعة",
    });

    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">📞 تواصل معنا</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            نحن هنا لمساعدتك. تواصل معنا بأي طريقة تناسبك وسنكون سعداء للإجابة على أسئلتك
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <Card className="feature-card">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Send className="w-6 h-6 text-primary" />
                أرسل لنا رسالة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">الاسم الكامل</label>
                    <Input
                      type="text"
                      placeholder="أدخل اسمك الكامل"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                      data-testid="input-contact-name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
                    <Input
                      type="email"
                      placeholder="example@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                      data-testid="input-contact-email"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">الموضوع</label>
                  <Input
                    type="text"
                    placeholder="موضوع رسالتك"
                    value={formData.subject}
                    onChange={(e) => handleInputChange("subject", e.target.value)}
                    required
                    data-testid="input-contact-subject"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">الرسالة</label>
                  <Textarea
                    placeholder="اكتب رسالتك هنا..."
                    rows={5}
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    required
                    data-testid="textarea-contact-message"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting}
                  data-testid="button-send-message"
                >
                  {isSubmitting ? (
                    "جارٍ الإرسال..."
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      إرسال الرسالة
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">طرق التواصل</h2>
            
            {contactInfo.map((info, index) => (
              <Card key={index} className="feature-card" data-testid={`contact-info-${index}`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg bg-muted flex items-center justify-center ${info.color}`}>
                      <info.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{info.title}</h3>
                      <p className="text-primary font-medium mb-2">{info.content}</p>
                      <p className="text-muted-foreground text-sm">{info.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <Card className="bg-muted/50 p-8 text-center">
          <div className="max-w-3xl mx-auto">
            <MessageCircle className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">أسئلة شائعة</h2>
            <p className="text-muted-foreground mb-6">
              قد تجد إجابة سؤالك في قسم الأسئلة الشائعة قبل التواصل معنا
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right">
              <div className="space-y-4">
                <div className="p-4 bg-background rounded-lg">
                  <h4 className="font-semibold mb-2">كم يستغرق إنشاء مشروع؟</h4>
                  <p className="text-muted-foreground text-sm">عادة ما يستغرق 2-5 دقائق حسب تعقيد المشروع</p>
                </div>
                <div className="p-4 bg-background rounded-lg">
                  <h4 className="font-semibold mb-2">هل يمكنني تعديل الكود؟</h4>
                  <p className="text-muted-foreground text-sm">نعم، يمكنك تعديل الكود باستخدام محرر الأكواد المدمج</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-background rounded-lg">
                  <h4 className="font-semibold mb-2">هل الاستضافة مجانية؟</h4>
                  <p className="text-muted-foreground text-sm">نعم، نوفر استضافة مجانية للمشاريع الأساسية</p>
                </div>
                <div className="p-4 bg-background rounded-lg">
                  <h4 className="font-semibold mb-2">ما هي طرق الدفع المتاحة؟</h4>
                  <p className="text-muted-foreground text-sm">نقبل Visa، Mastercard، وInstaPay</p>
                </div>
              </div>
            </div>
            
            <Button variant="outline" className="mt-6" data-testid="button-view-faq">
              عرض جميع الأسئلة الشائعة
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}