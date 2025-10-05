// src/index.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/components/LanguageProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import "./index.css";

// ================================
// إنشاء QueryClient مع إعدادات افتراضية
// ================================
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // محاولة واحدة عند الفشل
      refetchOnWindowFocus: false, // منع إعادة التحميل عند ترك الصفحة
      staleTime: 1000 * 60 * 5, // 5 دقائق قبل اعتبار البيانات قديمة
    },
  },
});

// ================================
// البحث عن عنصر الجذر
// ================================
const rootEl = document.getElementById("root");

if (!rootEl) {
  throw new Error("❌ Root element not found! Please make sure <div id='root'></div> exists in index.html");
}

// ================================
// إنشاء جذر React
// ================================
const root = ReactDOM.createRoot(rootEl);

// ================================
// Render التطبيق
// ================================
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <LanguageProvider defaultLanguage="ar">
          <TooltipProvider>
            <Toaster />
            <App /> {/* ✅ التطبيق الرئيسي */}
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
