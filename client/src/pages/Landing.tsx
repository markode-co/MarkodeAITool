import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/LanguageProvider";
import { useState } from "react";
import { useLocation } from "wouter";
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

export default function Landing() {
  const { t } = useLanguage();
  const [projectIdea, setProjectIdea] = useState("");
  const [, setLocation] = useLocation();

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
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      id: "portfolio",
      name: "معرض أعمال",
      description: "قالب أنيق لعرض أعمالك الإبداعية والمهنية",
      framework: "Next.js",
      image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    },
    {
      id: "fitness",
      name: "تطبيق لياقة",
      description: "تطبيق موبايل متكامل لتتبع اللياقة البدنية",
      framework: "Flutter",
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
    }
  ];

  const testimonials = [
    {
      name: "أحمد محمد",
      role: "مطور فريلانسر",
      content: "ماركود غيّر طريقة عملي تماماً. أصبحت أنجز المشاريع في ربع الوقت المعتاد وبجودة أعلى. الذكاء الاصطناعي يفهم ما أريده بالعربية.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"
    },
    {
      name: "فاطمة السالم",
      role: "مؤسسة شركة ناشئة",
      content: "لولا ماركود لما استطعت إطلاق متجري الإلكتروني بهذه السرعة. المنصة سهلة جداً وتوفر كل ما أحتاجه من استضافة وأمان.",
      image: "https://images.unsplash.com/photo-1494790108755-2616b332e234?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"
    },
    {
      name: "عمر التميمي",
      role: "طالب جامعي",
      content: "كطالب في علوم الحاسوب، ماركود ساعدني أفهم البرمجة بشكل أفضل من خلال رؤية كيف يتم توليد الكود. أنصح به جداً.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"
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
      ctaAction: () => setLocation("/login")
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
      ctaAction: () => setLocation("/login")
    },
    {
      name: "مؤسسي",
      price: "199",
      period: "شهرياً",
      description: "للفرق الكبيرة والمؤسسات",
      features: [
        "مشاريع غير محدودة",
        "استضافة enterprise",
        "دعم مخصص 24/7",
        "إدارة الفريق",
        "مساحة تخزين 500GB",
        "نطاقات متعددة",
        "API متقدم",
        "SLA مضمون"
      ],
      buttonText: "تواصل معنا",
      popular: false,
      ctaAction: () => setLocation("/contact")
    }
  ];

  const handleGenerateProject = () => {
    if (projectIdea.trim()) {
      setLocation("/login");
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 gradient-bg" data-testid="hero-section">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-6">
              <Badge className="px-4 py-2 bg-white/10 text-white border-0" data-testid="hero-badge">
                {t("hero.subtitle")}
              </Badge>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight" data-testid="hero-title">
              {t("hero.title")}
              <span className="block text-4xl md:text-5xl mt-2">
                {t("hero.title.arabic")}
              </span>
            </h1>

            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed" data-testid="hero-description">
              {t("hero.description")}
              <span className="block mt-2">{t("hero.description.sub")}</span>
            </p>

            {/* AI Input Demo */}
            <div className="max-w-2xl mx-auto mb-8">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardContent className="p-6">
                  <div className="text-right text-white/80 text-sm mb-2">✨ اكتب فكرتك هنا:</div>
                  <div className="mb-4">
                    <Input
                      value={projectIdea}
                      onChange={(e) => setProjectIdea(e.target.value)}
                      placeholder={t("hero.input.example")}
                      className="bg-white/5 border-white/20 text-white placeholder:text-white/60 text-right"
                      data-testid="input-project-idea"
                    />
                  </div>
                  <Button 
                    onClick={handleGenerateProject}
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                    data-testid="button-generate-project"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {t("hero.button.generate")}
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90"
                onClick={() => setLocation("/login")}
                data-testid="button-start-free"
              >
                <Play className="w-4 h-4 mr-2" />
                {t("hero.button.start")}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10"
                data-testid="button-demo"
              >
                <Video className="w-4 h-4 mr-2" />
                {t("hero.button.demo")}
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-8 border-t border-white/20">
              <div className="text-center" data-testid="stat-projects">
                <div className="text-3xl font-bold text-white">10K+</div>
                <div className="text-white/80 text-sm">مشروع تم إنشاؤه</div>
              </div>
              <div className="text-center" data-testid="stat-developers">
                <div className="text-3xl font-bold text-white">5K+</div>
                <div className="text-white/80 text-sm">مطور نشط</div>
              </div>
              <div className="text-center" data-testid="stat-uptime">
                <div className="text-3xl font-bold text-white">99.9%</div>
                <div className="text-white/80 text-sm">وقت التشغيل</div>
              </div>
              <div className="text-center" data-testid="stat-support">
                <div className="text-3xl font-bold text-white">24/7</div>
                <div className="text-white/80 text-sm">دعم فني</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-background" data-testid="features-section">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">⚡ مميزات المنصة</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              كل ما تحتاجه لتحويل فكرتك إلى منتج رقمي متكامل
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="feature-card p-6" data-testid={`feature-card-${index}`}>
                <CardContent className="p-0">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${feature.color.replace('text-', 'bg-')}/10`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Code Editor Section */}
      <section id="editor" className="py-20 bg-muted/30" data-testid="editor-section">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">🖥️ محرر أكواد عصري</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              واجهة تشبه Replit لكن أبسط وأوضح، مع دعم للغات برمجة وإطارات عمل متعددة
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <Card className="code-editor-bg rounded-lg shadow-2xl overflow-hidden">
              {/* Browser header */}
              <div className="bg-gray-800 px-4 py-3 flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex-1 text-center">
                  <span className="text-gray-300 text-sm">markode.app/editor</span>
                </div>
              </div>

              {/* Editor preview */}
              <div className="flex h-96">
                <div className="w-64 bg-gray-900 border-r border-gray-700 p-4">
                  <h3 className="text-white font-medium text-sm mb-2">مشروع متجر إلكتروني</h3>
                  <p className="text-gray-400 text-xs mb-4">React + Node.js</p>
                  <div className="space-y-2">
                    <div className="text-gray-300 text-sm">📁 src</div>
                    <div className="text-gray-300 text-sm pl-4">📄 App.js</div>
                    <div className="text-white text-sm pl-4 bg-gray-800 p-1 rounded">📄 ProductList.js</div>
                  </div>
                </div>
                <div className="flex-1 bg-gray-900 p-4">
                  <div className="text-gray-300 font-mono text-sm">
                    <div className="text-purple-400">import React from 'react';</div>
                    <div className="text-green-400">function ProductList() {`{`}</div>
                    <div className="pl-4 text-blue-400">return (</div>
                    <div className="pl-8 text-red-400">&lt;div className="grid"&gt;</div>
                    <div className="pl-12 text-gray-300">// AI generated code</div>
                    <div className="pl-8 text-red-400">&lt;/div&gt;</div>
                    <div className="pl-4 text-blue-400">);</div>
                    <div className="text-green-400">{`}`}</div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="text-center" data-testid="step-1">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">1</div>
                <h3 className="font-semibold mb-2">اكتب الفكرة</h3>
                <p className="text-muted-foreground text-sm">صف مشروعك بالعربية أو الإنجليزية</p>
              </div>
              <div className="text-center" data-testid="step-2">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">2</div>
                <h3 className="font-semibold mb-2">الذكاء الاصطناعي يعمل</h3>
                <p className="text-muted-foreground text-sm">يحلل الطلب وينشئ الكود المناسب</p>
              </div>
              <div className="text-center" data-testid="step-3">
                <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">3</div>
                <h3 className="font-semibold mb-2">مشروع جاهز</h3>
                <p className="text-muted-foreground text-sm">عدل واختبر وانشر مشروعك</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section className="py-20 bg-background" data-testid="templates-section">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">🎨 قوالب جاهزة</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              ابدأ بسرعة باستخدام قوالب احترافية جاهزة للتخصيص
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map((template) => (
              <Card key={template.id} className="feature-card overflow-hidden" data-testid={`template-card-${template.id}`}>
                <img
                  src={template.image}
                  alt={template.name}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">{template.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{template.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {template.framework}
                    </Badge>
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 h-auto"
                      data-testid={`template-use-${template.id}`}
                    >
                      {t("template.use")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" data-testid="button-all-templates">
              عرض جميع القوالب (50+ قالب)
            </Button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-muted/30" data-testid="pricing-section">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">💰 الخطط والأسعار</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              اختر الخطة المناسبة لاحتياجاتك وابدأ رحلتك في التطوير بالذكاء الاصطناعي
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative feature-card p-8 ${plan.popular ? 'border-primary ring-2 ring-primary/20' : ''}`} 
                data-testid={`pricing-plan-${plan.name.toLowerCase()}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-white px-4 py-1">
                      الأكثر شعبية
                    </Badge>
                  </div>
                )}
                
                <CardContent className="p-0">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">ر.س</span>
                      <span className="text-muted-foreground text-sm">/ {plan.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className={`w-full ${plan.popular ? 'gradient-bg text-white' : ''}`}
                    variant={plan.popular ? "default" : "outline"}
                    onClick={plan.ctaAction}
                    data-testid={`button-plan-${plan.name.toLowerCase()}`}
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground text-sm mb-4">
              جميع الخطط تتضمن ضمان استرداد المال خلال 30 يوم
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                دعم فني على مدار الساعة
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                تحديثات مجانية
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                بدون رسوم إضافية
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="community" className="py-20 bg-muted/30" data-testid="testimonials-section">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">👥 مجتمع المطورين</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              انضم لآلاف المطورين العرب واكتشف ما يقولونه عن ماركود
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="feature-card p-6" data-testid={`testimonial-${index}`}>
                <CardContent className="p-0">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Community stats */}
          <Card className="bg-muted/50 p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div data-testid="community-stat-developers">
                <div className="text-3xl font-bold text-primary mb-2">5,000+</div>
                <div className="text-muted-foreground">مطور نشط</div>
              </div>
              <div data-testid="community-stat-projects">
                <div className="text-3xl font-bold text-accent mb-2">15,000+</div>
                <div className="text-muted-foreground">مشروع منشور</div>
              </div>
              <div data-testid="community-stat-companies">
                <div className="text-3xl font-bold text-purple-500 mb-2">200+</div>
                <div className="text-muted-foreground">مؤسسة تستخدم المنصة</div>
              </div>
              <div data-testid="community-stat-satisfaction">
                <div className="text-3xl font-bold text-orange-500 mb-2">98%</div>
                <div className="text-muted-foreground">معدل الرضا</div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-bg" data-testid="cta-section">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            جاهز لبناء مشروعك القادم؟
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            انضم لآلاف المطورين واحصل على أول مشروع مجاناً في أقل من 5 دقائق
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90"
              onClick={() => window.location.href = "/api/login"}
              data-testid="button-cta-start"
            >
              <Rocket className="w-4 h-4 mr-2" />
              ابدأ مجاناً الآن
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10"
              data-testid="button-cta-demo"
            >
              <Calendar className="w-4 h-4 mr-2" />
              احجز عرض تجريبي
            </Button>
          </div>

          <div className="text-white/80 text-sm flex items-center justify-center gap-4">
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              بدون بطاقة ائتمان
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              إلغاء في أي وقت
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              دعم 24/7
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
