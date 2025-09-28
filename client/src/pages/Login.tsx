import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function Login() {
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || "https://markode-ai-tool.onrender.com";

      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "فشل تسجيل الدخول");

      localStorage.setItem("token", data.token);
      alert("✅ تم تسجيل الدخول بنجاح!");
      window.location.href = "/"; // توجيه المستخدم إلى الصفحة الرئيسية
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-96">
        <CardContent className="p-8">
          <h2 className="text-xl font-semibold text-center mb-4">تسجيل الدخول</h2>

          <form onSubmit={handleLogin}>
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="أدخل معرف المستخدم (User ID)"
              className="border border-gray-300 rounded p-2 w-full mb-4"
              required
            />

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-70"
              disabled={loading}
            >
              {loading ? (
                <div className="flex justify-center items-center">
                  <Loader2 className="animate-spin w-4 h-4 mr-2" />
                  جاري تسجيل الدخول...
                </div>
              ) : (
                "تسجيل الدخول"
              )}
            </button>

            {error && <p className="text-red-600 text-center mt-3">{error}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
