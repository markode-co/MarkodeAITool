import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import Templates from "@/pages/Templates";
import Projects from "@/pages/Projects";
import Pricing from "@/pages/Pricing";
import Checkout from "@/pages/Checkout";
import Login from "@/pages/Login";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import HelpCenter from "@/pages/HelpCenter";
import NotFound from "@/pages/not-found";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Signup from "@/pages/Signup"; // ✅ استخدم نفس طريقة الاستيراد الموحدة

function App() {
  console.log("🚀 App started");

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/checkout" element={<Checkout />} />

            {/* ✅ صفحات التسجيل والدخول */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* صفحات عامة */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/help-center" element={<HelpCenter />} />

            {/* صفحة الخطأ */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
