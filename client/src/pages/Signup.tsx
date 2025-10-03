import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        alert("تم إنشاء الحساب بنجاح ✅");
        navigate("/login");
      } else {
        alert(data.message || "حدث خطأ أثناء إنشاء الحساب");
      }
    } catch (err) {
      console.error(err);
      alert("خطأ في الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = `${import.meta.env.VITE_API_URL || ""}/auth/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">
          إنشاء حساب جديد
        </h2>
        <p className="text-center text-gray-500 mb-6">
          قم بالتسجيل باستخدام Google أو البريد الإلكتروني
        </p>

        {/* زر Google */}
        <button
          onClick={handleGoogleSignup}
          className="flex items-center justify-center w-full border border-gray-300 rounded-lg py-2 mb-4 hover:bg-gray-50 transition"
        >
          <FcGoogle size={22} className="mr-2" />
          <span className="text-gray-700 font-medium">
            التسجيل باستخدام Google
          </span>
        </button>

        <div className="flex items-center my-4">
          <hr className="flex-1 border-gray-300" />
          <span className="mx-2 text-gray-500">أو</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        {/* نموذج التسجيل */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 text-gray-700">الاسم الكامل</label>
            <input
              type="text"
              name="name"
              required
              placeholder="ادخل اسمك الكامل"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-gray-700">البريد الإلكتروني</label>
            <input
              type="email"
              name="email"
              required
              placeholder="example@email.com"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-1 text-gray-700">كلمة المرور</label>
            <input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition"
          >
            {loading ? "جاري التسجيل..." : "تسجيل حساب جديد"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          لديك حساب بالفعل؟{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-blue-600 font-semibold hover:underline"
          >
            تسجيل الدخول
          </button>
        </p>
      </div>
    </div>
  );
}
