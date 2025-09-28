import { createContext, useContext, useEffect, useState } from "react";

type Language = "ar" | "en";

type LanguageProviderProps = {
  children: React.ReactNode;
  defaultLanguage?: Language;
  storageKey?: string;
};

type LanguageProviderState = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
};

const translations = {
  ar: {
    // Navigation
    "nav.features": "المميزات",
    "nav.editor": "المحرر",
    "nav.pricing": "الأسعار",
    "nav.community": "المجتمع",
    "nav.login": "تسجيل الدخول",
    "nav.signup": "ابدأ مجاناً",
    "nav.dashboard": "لوحة التحكم",
    "nav.templates": "القوالب",
    "nav.logout": "تسجيل الخروج",

    // Hero section
    "hero.subtitle": "🚀 منصتك الذكية لإنشاء المواقع والتطبيقات",
    "hero.title": "Markode App AI",
    "hero.title.arabic": "ماركود",
    "hero.description": "اكتب فكرتك فقط ودع الذكاء الاصطناعي يحولها إلى كود جاهز ومشروع متكامل في دقائق!",
    "hero.description.sub": "بدون تعقيد، بدون خبرة برمجية.",
    "hero.input.placeholder": "اكتب فكرتك هنا...",
    "hero.input.example": "أريد موقع للتجارة الإلكترونية مع نظام دفع",
    "hero.button.generate": "إنشاء المشروع بالذكاء الاصطناعي",
    "hero.button.start": "ابدأ الآن مجاناً",
    "hero.button.demo": "شاهد العرض التوضيحي",

    // Common buttons
    "button.create": "إنشاء",
    "button.edit": "تعديل",
    "button.delete": "حذف",
    "button.save": "حفظ",
    "button.cancel": "إلغاء",
    "button.back": "رجوع",
    "button.next": "التالي",
    "button.loading": "جاري التحميل...",

    // Dashboard
    "dashboard.title": "مشاريعي",
    "dashboard.subtitle": "إدارة مشاريعك والتحكم بها",
    "dashboard.new.project": "مشروع جديد",
    "dashboard.empty.title": "لا توجد مشاريع بعد",
    "dashboard.empty.description": "ابدأ بإنشاء مشروعك الأول",
    "project.status.draft": "مسودة",
    "project.status.building": "جاري الإنشاء",
    "project.status.ready": "جاهز",
    "project.status.deployed": "منشور",
    "project.status.error": "خطأ",

    // Forms
    "form.project.name": "اسم المشروع",
    "form.project.description": "وصف المشروع",
    "form.project.prompt": "اكتب فكرة مشروعك",
    "form.project.framework": "إطار العمل",
    "form.project.language": "لغة البرمجة",
    "form.validation.required": "هذا الحقل مطلوب",
    "form.validation.min": "يجب أن يكون النص أطول",

    // Templates
    "templates.title": "القوالب الجاهزة",
    "templates.subtitle": "ابدأ بسرعة باستخدام قوالب احترافية",
    "template.use": "استخدم القالب",
    "template.preview": "معاينة",

    // Footer
    "footer.product": "المنتج",
    "footer.support": "الدعم",
    "footer.company": "الشركة",
    "footer.rights": "جميع الحقوق محفوظة",
    "footer.brand.title": "ماركود",
    "footer.brand.description": "منصتك الذكية لإنشاء المواقع والتطبيقات بالذكاء الاصطناعي. نحوّل أفكارك إلى واقع رقمي.",
    
    "footer.support.help": "مركز المساعدة",
    "footer.support.contact": "تواصل معنا",
    "footer.support.status": "حالة الخدمة",
    
    "footer.company.about": "عن ماركود",
    "footer.company.jobs": "الوظائف",
    "footer.company.blog": "المدونة",
    "footer.company.partners": "الشراكات",
    
    "footer.product.api": "API",

    // Features page
    "features.title": "مميزات ماركود",
    "features.subtitle": "اكتشف القوة الحقيقية للذكاء الاصطناعي في تطوير المواقع والتطبيقات. ماركود يوفر أدوات متطورة تجعل البرمجة أسهل وأسرع من أي وقت مضى.",
    "features.cta.title": "جاهز لبدء رحلتك مع ماركود؟",
    "features.cta.subtitle": "انضم إلى آلاف المطورين الذين يستخدمون ماركود لتطوير تطبيقاتهم بسرعة وسهولة",
    "features.cta.start": "ابدأ الآن مجاناً",
    "features.cta.pricing": "عرض الأسعار",
    
    "feature.ai.title": "الذكاء الاصطناعي المتطور",
    "feature.ai.description": "يستخدم ماركود أحدث تقنيات الذكاء الاصطناعي لتوليد كود عالي الجودة يناسب احتياجاتك",
    "feature.ai.badge": "AI-Powered",
    
    "feature.generation.title": "توليد الكود التلقائي",
    "feature.generation.description": "أنشئ تطبيقات ومواقع ويب كاملة بمجرد وصف فكرتك باللغة العربية",
    "feature.generation.badge": "Smart Generation",
    
    "feature.improvement.title": "تحسين الكود الذكي",
    "feature.improvement.description": "حسّن الكود الموجود بطلبات واضحة لتحسين الأداء والجودة والأمان",
    "feature.improvement.badge": "Code Enhancement",
    
    "feature.speed.title": "سرعة التطوير",
    "feature.speed.description": "اختصر وقت التطوير من أسابيع إلى دقائق مع أدوات الذكاء الاصطناعي",
    "feature.speed.badge": "Fast Development",
    
    "feature.arabic.title": "دعم اللغة العربية",
    "feature.arabic.description": "واجهة عربية كاملة مع دعم للبرمجة باللغة العربية لأول مرة",
    "feature.arabic.badge": "Arabic Support",
    
    "feature.editor.title": "محرر كود متطور",
    "feature.editor.description": "محرر كود مدمج مع إبراز الصيغة وإكمال تلقائي وأدوات تطوير متقدمة",
    "feature.editor.badge": "Advanced Editor",
    
    "feature.templates.title": "قوالب جاهزة",
    "feature.templates.description": "مجموعة واسعة من القوالب الجاهزة للمشاريع المختلفة",
    "feature.templates.badge": "Ready Templates",
    
    "feature.management.title": "إدارة المشاريع",
    "feature.management.description": "احفظ وأدر مشاريعك بسهولة مع نظام تخزين آمن ومنظم",
    "feature.management.badge": "Project Management",
    
    "feature.security.title": "الأمان والخصوصية",
    "feature.security.description": "حماية كاملة لبياناتك ومشاريعك مع أعلى معايير الأمان",
    "feature.security.badge": "Secure",
    
    "feature.collaboration.title": "العمل الجماعي",
    "feature.collaboration.description": "تعاون مع فريقك على المشاريع مع أدوات المشاركة المتقدمة",
    "feature.collaboration.badge": "Collaboration",
    
    "feature.deploy.title": "التطوير السريع",
    "feature.deploy.description": "من الفكرة إلى التطبيق المكتمل في وقت قياسي",
    "feature.deploy.badge": "Quick Deploy",
    
    "feature.updates.title": "التحديث المستمر",
    "feature.updates.description": "تحديثات منتظمة لإضافة ميزات جديدة وتحسينات مستمرة",
    "feature.updates.badge": "Always Updated",

    // Pricing page
    "pricing.title": "خطط الأسعار",
    "pricing.subtitle": "اختر الخطة التي تناسب احتياجاتك. جميع الخطط تشمل الوصول الكامل للذكاء الاصطناعي ومحرر الكود المتطور مع ضمان استرداد المال لمدة 30 يوماً.",
    "pricing.popular": "الأكثر شعبية",
    "pricing.faq.title": "الأسئلة الشائعة",
    "pricing.final.title": "جاهز لتحويل أفكارك إلى واقع؟",
    "pricing.final.subtitle": "انضم إلى آلاف المطورين الذين يستخدمون ماركود لبناء تطبيقات مذهلة",
    "pricing.final.cta": "ابدأ التجربة المجانية الآن",
    
    "plan.free.name": "المجاني",
    "plan.free.period": "مجاناً للأبد",
    "plan.free.description": "مثالي للمطورين المبتدئين والمشاريع الشخصية",
    "plan.free.cta": "ابدأ مجاناً",
    
    "plan.pro.name": "المحترف",
    "plan.pro.period": "شهرياً",
    "plan.pro.description": "للمطورين المحترفين والشركات الناشئة",
    "plan.pro.cta": "ابدأ التجربة المجانية",
    
    "plan.enterprise.name": "المؤسسات",
    "plan.enterprise.period": "شهرياً",
    "plan.enterprise.description": "للشركات الكبيرة والفرق المتقدمة",
    "plan.enterprise.cta": "تواصل معنا",

    "plan.feature.projects.monthly": "5 مشاريع شهرياً",
    "plan.feature.projects.unlimited": "مشاريع غير محدودة",
    "plan.feature.templates.basic": "قوالب أساسية",
    "plan.feature.templates.advanced": "جميع القوالب المتقدمة",
    "plan.feature.editor.simple": "محرر كود بسيط",
    "plan.feature.editor.advanced": "محرر كود متطور",
    "plan.feature.export": "تصدير الكود",
    "plan.feature.support.community": "دعم المجتمع",
    "plan.feature.support.email": "دعم عبر البريد الإلكتروني",
    "plan.feature.support.dedicated": "دعم فني مخصص 24/7",
    "plan.feature.ai.improvement": "تحسين ذكي للكود بـ AI",
    "plan.feature.deployment": "نشر مباشر",
    "plan.feature.collaboration": "مشاركة جماعية (5 أعضاء)",
    "plan.feature.collaboration.unlimited": "أعضاء غير محدودين",
    "plan.feature.analytics": "تحليلات المشاريع",
    "plan.feature.training": "تدريب فريق العمل",
    "plan.feature.integration": "تكامل مع أنظمة الشركة",
    "plan.feature.security": "أمان متقدم و SSO",
    "plan.feature.reports": "تقارير مفصلة",
    "plan.feature.development": "خدمات تطوير مخصصة",
    "plan.feature.all.pro": "كل ميزات المحترف",

    "plan.limitation.no.ai": "بدون تحسين ذكي للكود",
    "plan.limitation.no.collaboration": "بدون مشاركة جماعية",
    "plan.limitation.no.deployment": "بدون نشر مباشر",

    "faq.change.question": "هل يمكنني تغيير خطتي في أي وقت؟",
    "faq.change.answer": "نعم، يمكنك الترقية أو التراجع عن خطتك في أي وقت. التغييرات تدخل حيز التنفيذ فوراً.",
    "faq.trial.question": "هل هناك فترة تجريبية مجانية؟",
    "faq.trial.answer": "نعم، نوفر فترة تجريبية مجانية لمدة 14 يوماً لجميع الخطط المدفوعة بدون الحاجة لبطاقة ائتمان.",
    "faq.payment.question": "ما هي طرق الدفع المتاحة؟",
    "faq.payment.answer": "نقبل جميع البطاقات الائتمانية الرئيسية، PayPal، والتحويل البنكي للمؤسسات.",
    "faq.cancel.question": "هل يمكنني إلغاء اشتراكي في أي وقت؟",
    "faq.cancel.answer": "نعم، يمكنك إلغاء اشتراكك في أي وقت. لن تتم محاسبتك في الدورة التالية.",

    // Contact page
    "contact.title": "تواصل معنا",
    "contact.subtitle": "نحن هنا لمساعدتك! تواصل معنا عبر النموذج أدناه أو عبر إحدى طرق التواصل المتاحة.",
    
    "contact.info.email.title": "البريد الإلكتروني",
    "contact.info.email.description": "راسلنا في أي وقت وسنرد خلال 24 ساعة",
    "contact.info.phone.title": "الهاتف",
    "contact.info.phone.description": "دعم هاتفي من السبت إلى الخميس",
    "contact.info.address.title": "العنوان",
    "contact.info.address.content": "الرياض، المملكة العربية السعودية",
    "contact.info.address.description": "حي الملك عبدالله للتقنية المالية",
    "contact.info.hours.title": "ساعات العمل",
    "contact.info.hours.content": "9:00 ص - 6:00 م",
    "contact.info.hours.description": "السبت - الخميس (بتوقيت الرياض)",
    
    "contact.form.title": "إرسال رسالة",
    "contact.form.name": "الاسم الكامل",
    "contact.form.email": "البريد الإلكتروني",
    "contact.form.subject": "الموضوع",
    "contact.form.message": "الرسالة",
    "contact.form.send": "إرسال الرسالة",
    "contact.form.sending": "جاري الإرسال...",
    "contact.form.success.title": "تم إرسال رسالتك بنجاح!",
    "contact.form.success.description": "سنتواصل معك خلال 24 ساعة",

    // Help Center page
    "help.title": "🛟 مركز المساعدة",
    "help.subtitle": "ابحث عن إجابات لأسئلتك أو تواصل مع فريق الدعم",
    
    "help.category.quickstart.title": "دليل البدء السريع",
    "help.category.quickstart.description": "تعلم كيفية إنشاء أول مشروع في 5 دقائق",
    "help.category.projects.title": "إدارة المشاريع",
    "help.category.projects.description": "كيفية إنشاء وتحرير ونشر مشاريعك",
    "help.category.videos.title": "شروحات فيديو",
    "help.category.videos.description": "مقاطع فيديو تعليمية خطوة بخطوة",
    
    "help.articles.title": "المقالات الشعبية",
    "help.articles.new_project": "كيفية إنشاء مشروع جديد",
    "help.articles.new_project.description": "دليل شامل لإنشاء مشروع باستخدام الذكاء الاصطناعي",
    "help.articles.templates": "استخدام القوالب الجاهزة",
    "help.articles.templates.description": "كيفية اختيار وتخصيص القوالب لمشروعك",
    "help.articles.deploy": "نشر مشروعك على الإنترنت",
    "help.articles.deploy.description": "خطوات نشر مشروعك وربط نطاق مخصص",
    "help.articles.editor": "تحرير الكود يدوياً",
    "help.articles.editor.description": "استخدام محرر الأكواد المدمج لتخصيص مشروعك",
    
    "help.readtime": "دقائق",
    "help.articles.count": "مقالة",
    "help.search.placeholder": "ابحث في مركز المساعدة...",
    "help.contact.support": "تواصل مع الدعم",

    // About page
    "about.title": "عن ماركود",
    "about.subtitle": "نحن فريق شغوف بالتقنية ونؤمن بقوة الذكاء الاصطناعي في تغيير طريقة تطوير البرمجيات.",
    
    "about.mission.title": "مهمتنا",
    "about.mission.description": "تمكين المطورين العرب من بناء تطبيقات مذهلة باستخدام قوة الذكاء الاصطناعي",
    "about.vision.title": "رؤيتنا",
    "about.vision.description": "أن نكون المنصة الرائدة في العالم العربي لتطوير البرمجيات بالذكاء الاصطناعي",
    
    "about.team.title": "فريق العمل",
    "about.stats.title": "إحصائيات مهمة",
    "about.timeline.title": "رحلتنا",
    
    "about.stats.developers": "مطور نشط",
    "about.stats.projects": "مشروع منجز",
    "about.stats.countries": "دولة",
    "about.stats.uptime": "متاحية",
    
    "about.team.ceo.name": "أحمد العلي",
    "about.team.ceo.role": "المؤسس والرئيس التنفيذي",
    "about.team.ceo.description": "خبير في الذكاء الاصطناعي وريادة الأعمال التقنية",
    
    "about.team.dev.name": "فاطمة محمد",
    "about.team.dev.role": "مديرة التطوير",
    "about.team.dev.description": "متخصصة في تطوير الواجهات وتجربة المستخدم",
    
    "about.team.tech.name": "عمر السالم",
    "about.team.tech.role": "مدير التقنية",
    "about.team.tech.description": "خبير في الحوسبة السحابية والأمان الرقمي",

    // Checkout page
    "checkout.title": "استكمال الدفع",
    "checkout.subtitle": "اختر خطتك واستكمل عملية الدفع بشكل آمن",
    "checkout.plan.selected": "الخطة المختارة",
    "checkout.total": "الإجمالي",
    "checkout.monthly": "شهرياً",
    "checkout.loading": "جاري التحميل...",
    "checkout.processing": "جاري معالجة الدفع...",
    "checkout.pay": "دفع الآن",
    "checkout.secure": "دفع آمن مع Stripe",
    "checkout.success.title": "تم الدفع بنجاح!",
    "checkout.success.description": "شكراً لشرائك! تم تفعيل خطتك",
    "checkout.error.title": "فشل في الدفع",
    "checkout.stripe.test.title": "اختبار اتصال Stripe",
    "checkout.stripe.test.button": "اختبار الاتصال",
    "checkout.stripe.test.success": "تم الاتصال بنجاح",
    "checkout.stripe.test.failed": "فشل في الاتصال",
    "checkout.payment.method": "طريقة الدفع",
    "checkout.payment.card": "بطاقة ائتمانية (Stripe)",
    "checkout.payment.paypal": "PayPal",
    "checkout.paypal.loading": "جاري تحضير PayPal...",
    "checkout.paypal.unavailable.title": "خدمة PayPal غير متوفرة",
    "checkout.paypal.unavailable.message": "يرجى استخدام بطاقة ائتمانية للدفع",
  },
  en: {
    // Navigation
    "nav.features": "Features",
    "nav.editor": "Editor",
    "nav.pricing": "Pricing",
    "nav.community": "Community",
    "nav.login": "Login",
    "nav.signup": "Get Started",
    "nav.dashboard": "Dashboard",
    "nav.templates": "Templates",
    "nav.logout": "Logout",

    // Hero section
    "hero.subtitle": "🚀 Your smart platform for creating websites and apps",
    "hero.title": "Markode App AI",
    "hero.title.arabic": "ماركود",
    "hero.description": "Just write your idea and let AI turn it into ready code and a complete project in minutes!",
    "hero.description.sub": "No complexity, no programming experience needed.",
    "hero.input.placeholder": "Write your idea here...",
    "hero.input.example": "I want an e-commerce website with payment system",
    "hero.button.generate": "Generate Project with AI",
    "hero.button.start": "Start Now For Free",
    "hero.button.demo": "Watch Demo",

    // Common buttons
    "button.create": "Create",
    "button.edit": "Edit",
    "button.delete": "Delete",
    "button.save": "Save",
    "button.cancel": "Cancel",
    "button.back": "Back",
    "button.next": "Next",
    "button.loading": "Loading...",

    // Dashboard
    "dashboard.title": "My Projects",
    "dashboard.subtitle": "Manage and control your projects",
    "dashboard.new.project": "New Project",
    "dashboard.empty.title": "No projects yet",
    "dashboard.empty.description": "Start by creating your first project",
    "project.status.draft": "Draft",
    "project.status.building": "Building",
    "project.status.ready": "Ready",
    "project.status.deployed": "Deployed",
    "project.status.error": "Error",

    // Forms
    "form.project.name": "Project Name",
    "form.project.description": "Project Description",
    "form.project.prompt": "Describe your project idea",
    "form.project.framework": "Framework",
    "form.project.language": "Programming Language",
    "form.validation.required": "This field is required",
    "form.validation.min": "Text must be longer",

    // Templates
    "templates.title": "Ready Templates",
    "templates.subtitle": "Start quickly with professional templates",
    "template.use": "Use Template",
    "template.preview": "Preview",

    // Footer
    "footer.product": "Product",
    "footer.support": "Support",
    "footer.company": "Company",
    "footer.rights": "All rights reserved",
    "footer.brand.title": "Markode",
    "footer.brand.description": "Your smart platform for creating websites and applications with artificial intelligence. We turn your ideas into digital reality.",
    
    "footer.support.help": "Help Center",
    "footer.support.contact": "Contact Us",
    "footer.support.status": "Service Status",
    
    "footer.company.about": "About Markode",
    "footer.company.jobs": "Careers",
    "footer.company.blog": "Blog",
    "footer.company.partners": "Partnerships",
    
    "footer.product.api": "API",

    // Features page
    "features.title": "Markode Features",
    "features.subtitle": "Discover the true power of artificial intelligence in web and app development. Markode provides advanced tools that make programming easier and faster than ever before.",
    "features.cta.title": "Ready to start your journey with Markode?",
    "features.cta.subtitle": "Join thousands of developers who use Markode to develop their applications quickly and easily",
    "features.cta.start": "Start Now For Free",
    "features.cta.pricing": "View Pricing",
    
    "feature.ai.title": "Advanced Artificial Intelligence",
    "feature.ai.description": "Markode uses the latest AI technologies to generate high-quality code that meets your needs",
    "feature.ai.badge": "AI-Powered",
    
    "feature.generation.title": "Automatic Code Generation",
    "feature.generation.description": "Create complete web applications and websites by simply describing your idea in Arabic",
    "feature.generation.badge": "Smart Generation",
    
    "feature.improvement.title": "Smart Code Enhancement",
    "feature.improvement.description": "Improve existing code with clear requests to enhance performance, quality, and security",
    "feature.improvement.badge": "Code Enhancement",
    
    "feature.speed.title": "Development Speed",
    "feature.speed.description": "Reduce development time from weeks to minutes with AI-powered tools",
    "feature.speed.badge": "Fast Development",
    
    "feature.arabic.title": "Arabic Language Support",
    "feature.arabic.description": "Complete Arabic interface with support for Arabic programming for the first time",
    "feature.arabic.badge": "Arabic Support",
    
    "feature.editor.title": "Advanced Code Editor",
    "feature.editor.description": "Integrated code editor with syntax highlighting, auto-completion, and advanced development tools",
    "feature.editor.badge": "Advanced Editor",
    
    "feature.templates.title": "Ready Templates",
    "feature.templates.description": "Wide range of ready-made templates for different projects",
    "feature.templates.badge": "Ready Templates",
    
    "feature.management.title": "Project Management",
    "feature.management.description": "Save and manage your projects easily with a secure and organized storage system",
    "feature.management.badge": "Project Management",
    
    "feature.security.title": "Security and Privacy",
    "feature.security.description": "Complete protection for your data and projects with the highest security standards",
    "feature.security.badge": "Secure",
    
    "feature.collaboration.title": "Team Collaboration",
    "feature.collaboration.description": "Collaborate with your team on projects with advanced sharing tools",
    "feature.collaboration.badge": "Collaboration",
    
    "feature.deploy.title": "Quick Development",
    "feature.deploy.description": "From idea to complete application in record time",
    "feature.deploy.badge": "Quick Deploy",
    
    "feature.updates.title": "Continuous Updates",
    "feature.updates.description": "Regular updates to add new features and continuous improvements",
    "feature.updates.badge": "Always Updated",

    // Pricing page
    "pricing.title": "Pricing Plans",
    "pricing.subtitle": "Choose the plan that suits your needs. All plans include full access to artificial intelligence and advanced code editor with 30-day money-back guarantee.",
    "pricing.popular": "Most Popular",
    "pricing.faq.title": "Frequently Asked Questions",
    "pricing.final.title": "Ready to turn your ideas into reality?",
    "pricing.final.subtitle": "Join thousands of developers who use Markode to build amazing applications",
    "pricing.final.cta": "Start Free Trial Now",
    
    "plan.free.name": "Free",
    "plan.free.period": "Free Forever",
    "plan.free.description": "Perfect for beginner developers and personal projects",
    "plan.free.cta": "Start For Free",
    
    "plan.pro.name": "Professional",
    "plan.pro.period": "Monthly",
    "plan.pro.description": "For professional developers and startups",
    "plan.pro.cta": "Start Free Trial",
    
    "plan.enterprise.name": "Enterprise",
    "plan.enterprise.period": "Monthly",
    "plan.enterprise.description": "For large companies and advanced teams",
    "plan.enterprise.cta": "Contact Us",

    "plan.feature.projects.monthly": "5 projects monthly",
    "plan.feature.projects.unlimited": "Unlimited projects",
    "plan.feature.templates.basic": "Basic templates",
    "plan.feature.templates.advanced": "All advanced templates",
    "plan.feature.editor.simple": "Simple code editor",
    "plan.feature.editor.advanced": "Advanced code editor",
    "plan.feature.export": "Code export",
    "plan.feature.support.community": "Community support",
    "plan.feature.support.email": "Email support",
    "plan.feature.support.dedicated": "Dedicated 24/7 technical support",
    "plan.feature.ai.improvement": "Smart AI code improvement",
    "plan.feature.deployment": "Direct deployment",
    "plan.feature.collaboration": "Team collaboration (5 members)",
    "plan.feature.collaboration.unlimited": "Unlimited members",
    "plan.feature.analytics": "Project analytics",
    "plan.feature.training": "Team training",
    "plan.feature.integration": "Company systems integration",
    "plan.feature.security": "Advanced security & SSO",
    "plan.feature.reports": "Detailed reports",
    "plan.feature.development": "Custom development services",
    "plan.feature.all.pro": "All Pro features",

    "plan.limitation.no.ai": "No smart code improvement",
    "plan.limitation.no.collaboration": "No team collaboration",
    "plan.limitation.no.deployment": "No direct deployment",

    "faq.change.question": "Can I change my plan anytime?",
    "faq.change.answer": "Yes, you can upgrade or downgrade your plan anytime. Changes take effect immediately.",
    "faq.trial.question": "Is there a free trial?",
    "faq.trial.answer": "Yes, we offer a 14-day free trial for all paid plans without requiring a credit card.",
    "faq.payment.question": "What payment methods are available?",
    "faq.payment.answer": "We accept all major credit cards, PayPal, and bank transfers for enterprises.",
    "faq.cancel.question": "Can I cancel my subscription anytime?",
    "faq.cancel.answer": "Yes, you can cancel your subscription anytime. You won't be charged for the next cycle.",

    // Contact page
    "contact.title": "Contact Us",
    "contact.subtitle": "We're here to help! Reach out to us using the form below or through any of the available contact methods.",
    
    "contact.info.email.title": "Email",
    "contact.info.email.description": "Email us anytime and we'll respond within 24 hours",
    "contact.info.phone.title": "Phone",
    "contact.info.phone.description": "Phone support from Saturday to Thursday",
    "contact.info.address.title": "Address",
    "contact.info.address.content": "Riyadh, Saudi Arabia",
    "contact.info.address.description": "King Abdullah Financial District",
    "contact.info.hours.title": "Working Hours",
    "contact.info.hours.content": "9:00 AM - 6:00 PM",
    "contact.info.hours.description": "Saturday - Thursday (Riyadh Time)",
    
    "contact.form.title": "Send Message",
    "contact.form.name": "Full Name",
    "contact.form.email": "Email Address",
    "contact.form.subject": "Subject",
    "contact.form.message": "Message",
    "contact.form.send": "Send Message",
    "contact.form.sending": "Sending...",
    "contact.form.success.title": "Message sent successfully!",
    "contact.form.success.description": "We'll get back to you within 24 hours",

    // Help Center page
    "help.title": "🛟 Help Center",
    "help.subtitle": "Search for answers to your questions or contact our support team",
    
    "help.category.quickstart.title": "Quick Start Guide",
    "help.category.quickstart.description": "Learn how to create your first project in 5 minutes",
    "help.category.projects.title": "Project Management",
    "help.category.projects.description": "How to create, edit, and publish your projects",
    "help.category.videos.title": "Video Tutorials",
    "help.category.videos.description": "Step-by-step video tutorials",
    
    "help.articles.title": "Popular Articles",
    "help.articles.new_project": "How to create a new project",
    "help.articles.new_project.description": "Complete guide to creating a project using artificial intelligence",
    "help.articles.templates": "Using ready-made templates",
    "help.articles.templates.description": "How to choose and customize templates for your project",
    "help.articles.deploy": "Publishing your project online",
    "help.articles.deploy.description": "Steps to publish your project and connect a custom domain",
    "help.articles.editor": "Editing code manually",
    "help.articles.editor.description": "Using the integrated code editor to customize your project",
    
    "help.readtime": "minutes",
    "help.articles.count": "article",
    "help.search.placeholder": "Search in help center...",
    "help.contact.support": "Contact Support",

    // About page
    "about.title": "About Markode",
    "about.subtitle": "We are a passionate technology team that believes in the power of artificial intelligence to change the way software is developed.",
    
    "about.mission.title": "Our Mission",
    "about.mission.description": "Empowering Arab developers to build amazing applications using the power of artificial intelligence",
    "about.vision.title": "Our Vision",
    "about.vision.description": "To be the leading platform in the Arab world for AI-powered software development",
    
    "about.team.title": "Our Team",
    "about.stats.title": "Key Statistics",
    "about.timeline.title": "Our Journey",
    
    "about.stats.developers": "Active Developer",
    "about.stats.projects": "Project Completed",
    "about.stats.countries": "Countries",
    "about.stats.uptime": "Uptime",
    
    "about.team.ceo.name": "Ahmed Al-Ali",
    "about.team.ceo.role": "Founder & CEO",
    "about.team.ceo.description": "Expert in artificial intelligence and technology entrepreneurship",
    
    "about.team.dev.name": "Fatima Mohammed",
    "about.team.dev.role": "Development Manager",
    "about.team.dev.description": "Specialist in frontend development and user experience",
    
    "about.team.tech.name": "Omar Al-Salem",
    "about.team.tech.role": "Technology Manager",
    "about.team.tech.description": "Expert in cloud computing and digital security",

    // Checkout page
    "checkout.title": "Complete Payment",
    "checkout.subtitle": "Choose your plan and complete your secure payment",
    "checkout.plan.selected": "Selected Plan",
    "checkout.total": "Total",
    "checkout.monthly": "Monthly",
    "checkout.loading": "Loading...",
    "checkout.processing": "Processing payment...",
    "checkout.pay": "Pay Now",
    "checkout.secure": "Secure payment with Stripe",
    "checkout.success.title": "Payment Successful!",
    "checkout.success.description": "Thank you for your purchase! Your plan has been activated",
    "checkout.error.title": "Payment Failed",
    "checkout.stripe.test.title": "Test Stripe Connection",
    "checkout.stripe.test.button": "Test Connection",
    "checkout.stripe.test.success": "Connection successful",
    "checkout.stripe.test.failed": "Connection failed",
    "checkout.payment.method": "Payment Method",
    "checkout.payment.card": "Credit Card (Stripe)",
    "checkout.payment.paypal": "PayPal",
    "checkout.paypal.loading": "Preparing PayPal...",
    "checkout.paypal.unavailable.title": "PayPal Service Unavailable",
    "checkout.paypal.unavailable.message": "Please use credit card payment instead",
  },
};

const initialState: LanguageProviderState = {
  language: "ar",
  setLanguage: () => null,
  t: () => "",
  isRTL: true,
};

const LanguageProviderContext = createContext<LanguageProviderState>(initialState);

export function LanguageProvider({
  children,
  defaultLanguage = "ar",
  storageKey = "markode-language",
  ...props
}: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>(
    () => (localStorage.getItem(storageKey) as Language) || defaultLanguage
  );

  useEffect(() => {
    const root = window.document.documentElement;
    const body = window.document.body;

    root.lang = language;
    root.dir = language === "ar" ? "rtl" : "ltr";
    
    // Set appropriate font family
    if (language === "ar") {
      body.style.fontFamily = "var(--font-arabic)";
    } else {
      body.style.fontFamily = "var(--font-sans)";
    }
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  const value = {
    language,
    setLanguage: (language: Language) => {
      localStorage.setItem(storageKey, language);
      setLanguage(language);
    },
    t,
    isRTL: language === "ar",
  };

  return (
    <LanguageProviderContext.Provider {...props} value={value}>
      {children}
    </LanguageProviderContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageProviderContext);

  if (context === undefined)
    throw new Error("useLanguage must be used within a LanguageProvider");

  return context;
};
