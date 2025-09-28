import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useLanguage } from "@/components/LanguageProvider";
import { Check, X, Star, Zap, Crown, Rocket } from "lucide-react";

export default function Pricing() {
  const { t } = useLanguage();
  
  const plans = [
    {
      name: t("plan.free.name"),
      nameEn: "Free",
      icon: <Zap className="w-8 h-8 text-blue-600" />,
      price: "0",
      period: t("plan.free.period"),
      description: t("plan.free.description"),
      features: [
        t("plan.feature.projects.monthly"),
        t("plan.feature.templates.basic"),
        t("plan.feature.editor.simple"),
        t("plan.feature.export"),
        t("plan.feature.support.community")
      ],
      limitations: [
        t("plan.limitation.no.ai"),
        t("plan.limitation.no.collaboration"),
        t("plan.limitation.no.deployment")
      ],
      popular: false,
      cta: t("plan.free.cta"),
      ctaLink: "/dashboard"
    },
    {
      name: t("plan.pro.name"),
      nameEn: "Pro",
      icon: <Star className="w-8 h-8 text-purple-600" />,
      price: "29",
      period: t("plan.pro.period"),
      description: t("plan.pro.description"),
      features: [
        t("plan.feature.projects.unlimited"),
        t("plan.feature.templates.advanced"),
        t("plan.feature.ai.improvement"),
        t("plan.feature.editor.advanced"),
        t("plan.feature.deployment"),
        t("plan.feature.collaboration"),
        t("plan.feature.support.email"),
        t("plan.feature.analytics")
      ],
      limitations: [],
      popular: true,
      cta: t("plan.pro.cta"),
      ctaLink: "/dashboard"
    },
    {
      name: t("plan.enterprise.name"),
      nameEn: "Enterprise",
      icon: <Crown className="w-8 h-8 text-gold-600" />,
      price: "199",
      period: t("plan.enterprise.period"),
      description: t("plan.enterprise.description"),
      features: [
        t("plan.feature.all.pro"),
        t("plan.feature.collaboration.unlimited"),
        t("plan.feature.support.dedicated"),
        t("plan.feature.training"),
        t("plan.feature.integration"),
        t("plan.feature.security"),
        t("plan.feature.reports"),
        t("plan.feature.development")
      ],
      limitations: [],
      popular: false,
      cta: t("plan.enterprise.cta"),
      ctaLink: "/contact"
    }
  ];

  const faqs = [
    {
      question: t("faq.change.question"),
      answer: t("faq.change.answer")
    },
    {
      question: t("faq.trial.question"),
      answer: t("faq.trial.answer")
    },
    {
      question: t("faq.payment.question"),
      answer: t("faq.payment.answer")
    },
    {
      question: t("faq.cancel.question"),
      answer: t("faq.cancel.answer")
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16" data-testid="pricing-header">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
            {t("pricing.title")}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {t("pricing.subtitle")}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <Card 
              key={index}
              className={`relative group hover:shadow-2xl transition-all duration-300 ${
                plan.popular 
                  ? 'ring-2 ring-purple-500 scale-105 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20' 
                  : 'bg-white/80 dark:bg-gray-800/80'
              } backdrop-blur-sm hover:scale-110`}
              data-testid={`pricing-card-${plan.nameEn.toLowerCase()}`}
            >
              {plan.popular && (
                <Badge 
                  className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1"
                  data-testid="popular-badge"
                >
                  {t("pricing.popular")}
                </Badge>
              )}
              
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 w-fit group-hover:scale-110 transition-transform duration-300">
                  {plan.icon}
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">
                  {plan.name}
                </CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">
                    ${plan.price}
                  </span>
                  <span className="text-gray-600 dark:text-gray-300 mr-2">
                    {plan.period}
                  </span>
                </div>
                <CardDescription className="text-gray-600 dark:text-gray-300 mt-2">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <div 
                      key={featureIndex} 
                      className="flex items-center gap-3"
                      data-testid={`feature-${plan.nameEn.toLowerCase()}-${featureIndex}`}
                    >
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                  
                  {plan.limitations.map((limitation, limitationIndex) => (
                    <div 
                      key={limitationIndex} 
                      className="flex items-center gap-3 opacity-60"
                      data-testid={`limitation-${plan.nameEn.toLowerCase()}-${limitationIndex}`}
                    >
                      <X className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      <span className="text-gray-500 dark:text-gray-400">{limitation}</span>
                    </div>
                  ))}
                </div>
                
                {/* CTA Button */}
                <Link href={
                  plan.nameEn === "Free" 
                    ? plan.ctaLink 
                    : `/checkout?plan=${plan.nameEn.toLowerCase()}`
                }>
                  <Button 
                    className={`w-full mt-6 ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700' 
                        : ''
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                    size="lg"
                    data-testid={`cta-button-${plan.nameEn.toLowerCase()}`}
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white" data-testid="faq-title">
            {t("pricing.faq.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <Card 
                key={index} 
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-lg transition-shadow duration-300"
                data-testid={`faq-card-${index}`}
              >
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800 dark:text-white">
                    {faq.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="text-center mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
          <Rocket className="w-16 h-16 mx-auto mb-6 text-white" />
          <h2 className="text-3xl font-bold mb-4" data-testid="final-cta-title">
            {t("pricing.final.title")}
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            {t("pricing.final.subtitle")}
          </p>
          <Link href="/dashboard">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3"
              data-testid="button-start-free-trial"
            >
              {t("pricing.final.cta")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}