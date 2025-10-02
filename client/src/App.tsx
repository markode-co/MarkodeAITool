import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/components/LanguageProvider";
import Header from "@/components/Header"; 
import Footer from "@/components/Footer"; 
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import Editor from "@/pages/Editor";
import Templates from "@/pages/Templates";
import Features from "@/pages/Features";
import Pricing from "@/pages/Pricing";
import HelpCenter from "@/pages/HelpCenter";
import Contact from "@/pages/Contact";
import About from "@/pages/About";
import ComingSoon from "@/pages/ComingSoon";
import Login from "@/pages/Login";
import Checkout from "@/pages/Checkout";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Switch>
          {isLoading || !isAuthenticated ? (
            <>
              <Route path="/" component={Landing} />
              <Route path="/landing" component={Landing} />
              <Route path="/login" component={Login} />
              <Route path="/templates" component={Templates} />
              <Route path="/features" component={Features} />
              <Route path="/pricing" component={Pricing} />
              <Route path="/help" component={HelpCenter} />
              <Route path="/contact" component={Contact} />
              <Route path="/about" component={About} />
              <Route path="/api" component={ComingSoon} />
              <Route path="/community" component={ComingSoon} />
              <Route path="/status" component={ComingSoon} />
              <Route path="/jobs" component={ComingSoon} />
              <Route path="/blog" component={ComingSoon} />
              <Route path="/partners" component={ComingSoon} />
              <Route path="/checkout" component={Checkout} />
            </>
          ) : (
            <>
              <Route path="/" component={Dashboard} />
              <Route path="/landing" component={Landing} />
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/editor/:id" component={Editor} />
              <Route path="/login" component={Login} />
              <Route path="/templates" component={Templates} />
              <Route path="/features" component={Features} />
              <Route path="/pricing" component={Pricing} />
              <Route path="/help" component={HelpCenter} />
              <Route path="/contact" component={Contact} />
              <Route path="/about" component={About} />
              <Route path="/api" component={ComingSoon} />
              <Route path="/community" component={ComingSoon} />
              <Route path="/status" component={ComingSoon} />
              <Route path="/jobs" component={ComingSoon} />
              <Route path="/blog" component={ComingSoon} />
              <Route path="/partners" component={ComingSoon} />
              <Route path="/checkout" component={Checkout} />
            </>
          )}
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <LanguageProvider defaultLanguage="ar">
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
