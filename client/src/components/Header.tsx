import { Button } from "@/components/ui/button";
import { Code2, Globe, Moon, Sun, Menu } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useLanguage } from "./LanguageProvider";
import { useAuth } from "@/hooks/useAuth";
import { Link, useLocation } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function Header() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t, isRTL } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [location] = useLocation();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const toggleLanguage = () => {
    setLanguage(language === "ar" ? "en" : "ar");
  };

  const navigation = [
    { href: "#features", label: t("nav.features") },
    { href: "#editor", label: t("nav.editor") },
    { href: "#pricing", label: t("nav.pricing") },
    { href: "#community", label: t("nav.community") },
  ];

  const authenticatedNavigation = [
    { href: "/dashboard", label: t("nav.dashboard") },
    { href: "/templates", label: t("nav.templates") },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/landing" className="flex items-center gap-2" data-testid="link-home">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
              <Code2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t("hero.title.arabic")}
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {isAuthenticated ? (
            authenticatedNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-muted-foreground hover:text-foreground transition-colors ${
                  location === item.href ? 'text-foreground font-medium' : ''
                }`}
                data-testid={`nav-${item.href.replace('/', '')}`}
              >
                {item.label}
              </Link>
            ))
          ) : (
            navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid={`nav-${item.href.replace('#', '')}`}
              >
                {item.label}
              </a>
            ))
          )}
        </nav>

        <div className="flex items-center gap-4">
          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            data-testid="button-language"
          >
            <Globe className="w-4 h-4" />
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            data-testid="button-theme"
          >
            {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </Button>

          {/* Auth Section */}
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full" data-testid="user-menu">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.profileImageUrl || undefined} alt={user.firstName || "User"} />
                    <AvatarFallback>
                      {user.firstName?.charAt(0) || user.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align={isRTL ? "start" : "end"}>
                <DropdownMenuItem onClick={() => window.location.href = "/api/logout"} data-testid="button-logout">
                  {t("nav.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => window.location.href = "/login"} data-testid="button-login">
                {t("nav.login")}
              </Button>
              <Button onClick={() => window.location.href = "/signup"} data-testid="button-signup">
                {t("nav.signup")}
              </Button>
            </div>
          )}

          {/* Mobile Menu */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" data-testid="mobile-menu">
                  <Menu className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align={isRTL ? "start" : "end"}>
                {isAuthenticated
                  ? authenticatedNavigation.map((item) => (
                      <DropdownMenuItem key={item.href} asChild>
                        <Link href={item.href}>{item.label}</Link>
                      </DropdownMenuItem>
                    ))
                  : navigation.map((item) => (
                      <DropdownMenuItem key={item.href} asChild>
                        <a href={item.href}>{item.label}</a>
                      </DropdownMenuItem>
                    ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
