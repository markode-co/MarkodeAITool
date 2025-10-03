import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/LanguageProvider";
import { useNavigate } from "react-router-dom";
import { 
  Sparkles, 
  Play, 
  Video, 
  Server, 
  Languages, 
  Users, 
  GitBranch, 
  CreditCard,
  Star,
  Rocket,
  Calendar,
  CheckCircle
} from "lucide-react";

console.log("🎯 Landing rendered");

export default function Landing() {
  const { t } = useLanguage();
  const [projectIdea, setProjectIdea] = useState("");
  const navigate = useNavigate();

  const features = [
    {
      icon: Sparkles,
      title: "توليد ذكي للمشاريع",
      description: "يحول الذكاء الاصطناعي فكرتك المكتوبة بالعربية أو الإنجليزية إلى مشروع متكامل مع كود نظيف وتصميم احترافي.",
      color: "text-primary"
    },
    {
      icon: Server,
      title: "استضافة فورية",
      description: "انشر مشروعك على الإنترنت بنقرة واحدة مع خدمة استضافة سريعة وموثوقة مع شهادات SSL مجانية.",
      color: "text-accent"
    },
    {
      icon: Languages,
      title: "دعم كامل للعربية",
      description: "واجهة عربية بالكامل مع دعم الكتابة من اليمين لليسار وتوليد مشاريع بالمحتوى العربي.",
      color: "text-purple-500"
    },
    {
      icon: Users,
      title: "مجتمع تفاعلي",
      description: "انضم لمجتمع المطورين العرب، شارك مشاريعك، واحصل على تقييمات ومساعدة من الخبراء.",
      color: "text-blue-500"
    },
    {
      icon: GitBranch,
      title: "تكامل Git",
      description: "متصل مباشرة مع GitHub و GitLab لإدارة النسخ وتتبع التغييرات والتعاون مع الفريق.",
      color: "text-green-500"
    },
    {
      icon: CreditCard,
      title: "نظام دفع آمن",
      description: "ادفع بأمان عبر Visa وMasterCard وInstaPay مع حماية كاملة لبياناتك المالية.",
      color: "text-orange-500"
    }
  ];

  const templates = [
    {
      id: "restaurant",
      name: "موقع مطعم",
      description: "قالب احترافي للمطاعم مع قائمة طعام ونظام حجز",
      framework: "React + Node.js",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&h=600"
    },
    {
      id: "portfolio",
      name: "معرض أعمال",
      description: "قالب أنيق لعرض أعمالك الإبداعية والمهنية",
      framework: "Next.js",
      image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=800&h=600"
    },
    {
      id: "fitness",
      name: "تطبيق لياقة",
      description: "تطبيق موبايل متكامل لتتبع اللياقة البدنية",
      framework: "Flutter",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&h=600"
    }
  ];

  const testimonials = [
    {
      name: "أحمد محمد",
      role: "مطور فريلانسر",
      content: "ماركود غيّر طريقة عملي تماماً. أصبحت أنجز المشاريع في ربع الوقت المعتاد وبجودة أعلى. الذكاء الاصطناعي يفهم ما أريده بالعربية.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150"
    },
    {
      name: "فاطمة السالم",
      role: "مؤسسة شركة ناشئة",
      content: "لولا ماركود لما استطعت إطلاق متجري الإلكتروني بهذه السرعة. المنصة سهلة جداً وتوفر كل ما أحتاجه من استضافة وأمان.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b332e234?auto=format&fit=crop&w=150&h=150"
    },
    {
      name: "عمر التميمي",
      role: "طالب جامعي",
      content: "كطالب في علوم الحاسوب، ماركود ساعدني أفهم البرمجة بشكل أفضل من خلال رؤية كيف يتم توليد الكود. أنصح به جداً.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150"
    }
  ];

  const pricingPlans = [
    {
      name: "مجاني",
      price: "0",
      period: "شهرياً",
      description: "مثالي للمبتدئين والطلاب",
      features: ["3 مشاريع شهرياً", "استضافة أساسية", "قوالب محدودة", "دعم المجتمع", "مساحة تخزين 1GB"],
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

  const handleGenerateProject = () => {
    if (projectIdea.trim()) {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen">
      {/* --- Hero Section --- */}
      <section className="py-20 gradient-bg">
        <div className="container mx-auto px-4 text-center">
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
              <Rocket className="w-4 h-4 mr-2" />
              ابدأ مجاناً الآن
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10"
            >
              <Calendar className="w-4 h-4 mr-2" />
              احجز عرض تجريبي
            </Button>
          </div>
        </div>
      </section>

      {/* يمكنك الإبقاء على باقي الأقسام كما هي */}
    </div>
  );
}
