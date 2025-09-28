import { Code2 } from "lucide-react";
import { useLanguage } from "./LanguageProvider";
import { Link } from "wouter";

export function Footer() {
  const { t } = useLanguage();

  // Helper function to determine if we should use Link or anchor tag
  const renderLink = (link: { href: string; label: string }, testId: string) => {
    const isInternalRoute = link.href.startsWith('/') && !link.href.startsWith('#');
    
    if (isInternalRoute) {
      return (
        <Link
          href={link.href}
          className="hover:text-foreground transition-colors"
          data-testid={testId}
        >
          {link.label}
        </Link>
      );
    } else {
      return (
        <a
          href={link.href}
          className="hover:text-foreground transition-colors"
          data-testid={testId}
        >
          {link.label}
        </a>
      );
    }
  };

  const productLinks = [
    { label: t("nav.features"), href: "/features" },
    { label: t("nav.pricing"), href: "/pricing" },
    { label: t("templates.title"), href: "/templates" },
    { label: t("footer.product.api"), href: "/api" },
  ];

  const supportLinks = [
    { label: t("footer.support.help"), href: "/help" },
    { label: t("footer.support.contact"), href: "/contact" },
    { label: t("nav.community"), href: "/community" },
    { label: t("footer.support.status"), href: "/status" },
  ];

  const companyLinks = [
    { label: t("footer.company.about"), href: "/about" },
    { label: t("footer.company.jobs"), href: "/jobs" },
    { label: t("footer.company.blog"), href: "/blog" },
    { label: t("footer.company.partners"), href: "/partners" },
  ];

  return (
    <footer className="bg-muted/30 py-12 border-t">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
                <Code2 className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold">{t("footer.brand.title")}</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t("footer.brand.description")}
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4">{t("footer.product")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {productLinks.map((link, index) => (
                <li key={`product-${index}`}>
                  {renderLink(link, `footer-link-${link.label.toLowerCase()}`)}
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">{t("footer.support")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {supportLinks.map((link, index) => (
                <li key={`support-${index}`}>
                  {renderLink(link, `footer-link-${link.label.toLowerCase()}`)}
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">{t("footer.company")}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {companyLinks.map((link, index) => (
                <li key={`company-${index}`}>
                  {renderLink(link, `footer-link-${link.label.toLowerCase()}`)}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row items-center justify-between">
          <div className="text-sm text-muted-foreground mb-4 md:mb-0">
            © 2024 Markode App AI. {t("footer.rights")}
          </div>

          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
              data-testid="social-twitter"
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
              data-testid="social-linkedin"
            >
              <i className="fab fa-linkedin"></i>
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
              data-testid="social-github"
            >
              <i className="fab fa-github"></i>
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
              data-testid="social-discord"
            >
              <i className="fab fa-discord"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
