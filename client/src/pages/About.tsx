import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/LanguageProvider";
import { 
  Sparkles, 
  Target, 
  Users, 
  Award,
  Code2,
  Rocket,
  Heart,
  Star,
  Globe,
  TrendingUp
} from "lucide-react";

export default function About() {
  const { t } = useLanguage();

  const teamMembers = [
    {
      name: "أحمد العلي",
      role: "المؤسس والرئيس التنفيذي",
      description: "خبير في الذكاء الاصطناعي وريادة الأعمال التقنية",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
      linkedin: "#"
    },
    {
      name: "فاطمة محمد",
      role: "مديرة التطوير",
      description: "متخصصة في تطوير الواجهات وتجربة المستخدم",
      image: "https://images.unsplash.com/photo-1494790108755-2616b332e234?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
      linkedin: "#"
    },
    {
      name: "عمر السالم",
      role: "مدير التقنية",
      description: "خبير في الحوسبة السحابية والأمان الرقمي",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150",
      linkedin: "#"
    }
  ];

  const milestones = [
    {
      year: "2023",
      title: "تأسيس الشركة",
      description: "بدأت الفكرة من رؤية لتسهيل التطوير على المطورين العرب"
    },
    {
      year: "2024",
      title: "إطلاق النسخة التجريبية",
      description: "إطلاق أول نسخة تجريبية مع 1000 مطور"
    },
    {
      year: "2024",
      title: "وصلنا 10,000 مطور",
      description: "تجاوزنا 10 آلاف مطور مسجل وأنتجنا أكثر من 50 ألف مشروع"
    },
    {
      year: "2025",
      title: "التوسع الإقليمي",
      description: "خطة للتوسع في منطقة الشرق الأوسط وشمال أفريقيا"
    }
  ];

  const stats = [
    {
      icon: Users,
      number: "15,000+",
      label: "مطور نشط",
      color: "text-blue-500"
    },
    {
      icon: Code2,
      number: "75,000+",
      label: "مشروع منشور",
      color: "text-green-500"
    },
    {
      icon: Globe,
      number: "25+",
      label: "دولة",
      color: "text-purple-500"
    },
    {
      icon: TrendingUp,
      number: "99%",
      label: "معدل الرضا",
      color: "text-orange-500"
    }
  ];

  const values = [
    {
      icon: Sparkles,
      title: "الابتكار",
      description: "نؤمن بقوة الذكاء الاصطناعي في تغيير مستقبل التطوير"
    },
    {
      icon: Heart,
      title: "التركيز على المطور",
      description: "كل قرار نتخذه يهدف لتحسين تجربة المطور"
    },
    {
      icon: Target,
      title: "الجودة",
      description: "نلتزم بتقديم أعلى معايير الجودة في كل ما نطوره"
    },
    {
      icon: Users,
      title: "المجتمع",
      description: "نبني مجتمعاً قوياً من المطورين العرب المبدعين"
    }
  ];

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">🚀 عن ماركود</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            نحن فريق من المطورين والمبدعين العرب، نعمل على تطوير أدوات ذكية تساعد المطورين على تحويل أفكارهم إلى مشاريع حقيقية بسرعة وسهولة
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          <Card className="feature-card p-8">
            <CardContent className="p-0">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg gradient-bg flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold">رسالتنا</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                نهدف إلى تمكين كل مطور عربي من تحويل أفكاره إلى مشاريع ناجحة باستخدام أحدث تقنيات الذكاء الاصطناعي، مع توفير تجربة سلسة ومحتوى باللغة العربية.
              </p>
            </CardContent>
          </Card>

          <Card className="feature-card p-8">
            <CardContent className="p-0">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-lg gradient-bg flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold">رؤيتنا</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                أن نصبح المنصة الرائدة للتطوير بالذكاء الاصطناعي في المنطقة العربية، وأن نساهم في بناء جيل جديد من المطورين المبدعين والمبتكرين.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <Card key={index} className="feature-card p-6 text-center" data-testid={`stat-${index}`}>
              <CardContent className="p-0">
                <div className={`w-12 h-12 rounded-lg bg-muted flex items-center justify-center mx-auto mb-4 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-3xl font-bold mb-2">{stat.number}</div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Values */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">قيمنا</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="feature-card p-6 text-center" data-testid={`value-${index}`}>
                <CardContent className="p-0">
                  <div className="w-12 h-12 rounded-lg gradient-bg flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-3">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">فريق العمل</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="feature-card p-6 text-center" data-testid={`team-member-${index}`}>
                <CardContent className="p-0">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="font-semibold text-lg mb-1">{member.name}</h3>
                  <Badge variant="outline" className="mb-3">{member.role}</Badge>
                  <p className="text-muted-foreground text-sm">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">رحلتنا</h2>
          <div className="max-w-4xl mx-auto">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-start gap-6 mb-8 last:mb-0" data-testid={`milestone-${index}`}>
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center text-white font-bold">
                    {milestone.year.slice(-2)}
                  </div>
                </div>
                <Card className="feature-card flex-1">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{milestone.year}</Badge>
                      <h3 className="font-semibold text-lg">{milestone.title}</h3>
                    </div>
                    <p className="text-muted-foreground">{milestone.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Awards */}
        <Card className="bg-muted/50 p-8 text-center">
          <div className="max-w-3xl mx-auto">
            <Award className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">الجوائز والإنجازات</h2>
            <p className="text-muted-foreground mb-6">
              حصلنا على عدة جوائز وإشادات من مؤسسات تقنية مرموقة
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-background rounded-lg">
                <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <h4 className="font-semibold mb-1">أفضل منصة تطوير 2024</h4>
                <p className="text-muted-foreground text-sm">جائزة التقنية العربية</p>
              </div>
              
              <div className="p-4 bg-background rounded-lg">
                <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <h4 className="font-semibold mb-1">الشركة الناشئة الأكثر ابتكاراً</h4>
                <p className="text-muted-foreground text-sm">مؤتمر الذكاء الاصطناعي 2024</p>
              </div>
              
              <div className="p-4 bg-background rounded-lg">
                <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <h4 className="font-semibold mb-1">أسرع نمو في المنطقة</h4>
                <p className="text-muted-foreground text-sm">تقرير الشركات التقنية</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}