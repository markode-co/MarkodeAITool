import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/LanguageProvider";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Server,
  Languages,
  Users,
  GitBranch,
  CreditCard,
  Rocket,
  Calendar,
  Star,
  CheckCircle
} from "lucide-react";

export default function Landing() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [projectIdea, setProjectIdea] = useState("");

  const features = [
    {
      icon: Sparkles,
      title: "توليد ذكي للمشاريع",
      description:
        "يحول الذكاء الاصطناعي فكرتك المكتوبة بالعربية أو الإنجليزية إلى مشروع متكامل مع كود نظيف وتصميم احترافي.",
      color: "text-primary"
    },
    {
      icon: Server,
      title: "استضافة فورية",
      description:
        "انشر مشروعك على الإنترنت بنقرة واحدة مع خدمة استضافة سريعة وموثوقة مع شهادات SSL مجانية.",
      color: "text-accent"
    },
    {
      icon: Languages,
      title: "دعم كامل للعربية",
      description:
        "واجهة عربية بالكامل مع دعم الكتابة من اليمين لليسار وتوليد مشاريع بالمحتوى العربي.",
      color: "text-purple-500"
    },
    {
      icon: Users,
      title: "مجتمع تفاعلي",
      description:
        "انضم لمجتمع المطورين العرب، شارك مشاريعك، واحصل على تقييمات ومساعدة من الخبراء.",
      color: "text-blue-500"
    },
    {
      icon: GitBranch,
      title: "تكامل Git",
      description:
        "متصل مباشرة مع GitHub و GitLab لإدارة النسخ وتتبع التغييرات والتعاون مع الفريق.",
      color: "text-green-500"
    },
    {
      icon: CreditCard,
      title: "نظام دفع آمن",
      description:
        "ادفع بأمان عبر Visa وMasterCard وInstaPay مع حماية كاملة لبياناتك المالية.",
      color: "text-orange-500"
    }
  ];

  const templates = [
    {
      id: "restaurant",
      name: "موقع مطعم",
      description: "قالب احترافي للمطاعم مع قائمة طعام ونظام حجز",
      framework: "React + Node.js",
      image:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&h=600"
    },
    {
      id: "portfolio",
      name: "معرض أعمال",
      description: "قالب أنيق لعرض أعمالك الإبداعية والمهنية",
      framework: "Next.js",
      image:
        "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=800&h=600"
    },
    {
      id: "fitness",
      name: "تطبيق لياقة",
      description: "تطبيق موبايل متكامل لتتبع اللياقة البدنية",
      framework: "Flutter",
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&h=600"
    }
  ];

  const testimonials = [
    {
      name: "أحمد محمد",
      role: "مطور فريلانسر",
      content:
        "ماركود غيّر طريقة عملي تماماً. أصبحت أنجز المشاريع في ربع الوقت المعتاد وبجودة أعلى. الذكاء الاصطناعي يفهم ما أريده بالعربية.",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150"
    },
    {
      name: "فاطمة السالم",
      role: "مؤسسة شركة ناشئة",
      content:
        "لولا ماركود لما استطعت إطلاق متجري الإلكتروني بهذه السرعة. المنصة سهلة جداً وتوفر كل ما أحتاجه من استضافة وأمان.",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b332e234?auto=format&fit=crop&w=150&h=150"
    },
    {
      name: "عمر التميمي",
      role: "طالب جامعي",
      content:
        "كطالب في علوم الحاسوب، ماركود ساعدني أفهم البرمجة بشكل أفضل من خلال رؤية كيف يتم توليد الكود. أنصح به جداً.",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150"
    }
  ];

  const pricingPlans = [
    {
      name: "مجاني",
      price: "0",
      period: "شهرياً",
      description: "مثالي للمبتدئين والطلاب",
      features: [
        "3 مشاريع شهرياً",
        "استضافة أساسية",
        "قوالب محدودة",
        "دعم المجتمع",
        "مساحة تخزين 1GB"
      ],
      buttonText: "ابدأ مجاناً",
      popular: false,
      ctaAction: () => navigate("/login")
    },
    {
      name: "احترافي",
      price: "49",
      period: "شهرياً",
      description: "للمطورين والشركات الصغيرة",
      features: [
        "مشاريع غير محدودة",
        "استضافة سريعة",
        "جميع القوالب",
        "دعم أولوية",
        "مساحة تخزين 50GB",
        "نطاق مخصص",
        "تحليلات متقدمة"
      ],
      buttonText: "جرب 14 يوم مجاناً",
      popular: true,
      ctaAction: () => navigate("/login")
    },
    {
      name: "مؤسسي",
      price: "199",
      period: "شهرياً",
      description: "للفرق الكبيرة والمؤسسات",
      features: [
        "مشاريع غير محدودة",
        "استضافة Enterprise",
        "دعم مخصص 24/7",
        "إدارة الفريق",
        "مساحة تخزين 500GB",
        "نطاقات متعددة",
        "API متقدم",
        "SLA مضمون"
      ],
      buttonText: "تواصل معنا",
      popular: false,
      ctaAction: () => navigate("/contact")
    }
  ];

  return (
    <div className="min-h-screen">
      {/* --- Hero Section --- */}
      <section className="py-20 gradient-bg text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          {t("hero.title")} <span className="block mt-2">{t("hero.title.arabic")}</span>
        </h1>
        <p className="text-xl text-white/80 mb-8">{t("hero.description")}</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            size="lg"
            className="bg-white text-primary hover:bg-white/90"
            onClick={() => navigate("/login")}
          >
            <Rocket className="w-4 h-4 mr-2" /> ابدأ مجاناً الآن
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-white/30 text-white hover:bg-white/10"
          >
            <Calendar className="w-4 h-4 mr-2" /> احجز عرض تجريبي
          </Button>
        </div>
      </section>

      {/* --- Features Section --- */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, idx) => (
            <Card key={idx} className="hover:shadow-lg transition">
              <CardContent>
                <f.icon className={`w-8 h-8 mb-3 ${f.color}`} />
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-600">{f.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* --- Templates Section --- */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-10">قوالب جاهزة</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {templates.map((t) => (
              <Card key={t.id} className="hover:shadow-lg transition">
                <img src={t.image} alt={t.name} className="w-full h-48 object-cover rounded-t-lg" />
                <CardContent>
                  <h3 className="text-xl font-semibold">{t.name}</h3>
                  <p className="text-gray-600 mb-2">{t.description}</p>
                  <Badge variant="secondary">{t.framework}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* --- Testimonials Section --- */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-10">آراء المستخدمين</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <Card key={idx} className="hover:shadow-lg transition p-6">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-20 h-20 mx-auto rounded-full mb-4"
                />
                <h3 className="text-xl font-semibold">{t.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{t.role}</p>
                <p className="text-gray-700">{t.content}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* --- Pricing Section --- */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-10">الخطط والأسعار</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingPlans.map((plan, idx) => (
              <Card key={idx} className={`p-6 border ${plan.popular ? "border-primary" : "border-gray-200"} hover:shadow-lg transition`}>
                {plan.popular && <Badge className="mb-2">الأكثر شهرة</Badge>}
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="text-3xl font-bold mb-4">{plan.price} <span className="text-base font-normal">{plan.period}</span></div>
                <ul className="text-gray-600 mb-6 text-left">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-center mb-2">
                      <CheckCircle className="w-4 h-4 text-green-500 ml-2" /> {f}
                    </li>
                  ))}
                </ul>
                <Button onClick={plan.ctaAction} className="w-full">{plan.buttonText}</Button>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
