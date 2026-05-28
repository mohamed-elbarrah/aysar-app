"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/app/components/ui/Input";
import { DashboardButton } from "@/app/components/dashboard/DashboardButton";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();

      if (!json.success) {
        setError(json.error || "حدث خطأ");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("تعذر الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-full max-w-[400px] bg-[#0c2954] rounded-xl border border-white/10 p-8">
        <div className="text-center mb-8">
          <h1 className="text-xl font-bold text-white mb-1">تسجيل الدخول</h1>
          <p className="text-sm text-white/70">أدخل بياناتك للوصول إلى لوحة التحكم</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="البريد الإلكتروني"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            wrapperClassName="[&_label]:text-white/80"
          />
          <Input
            label="كلمة المرور"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            wrapperClassName="[&_label]:text-white/80"
          />

          {error && (
            <div className="bg-red-500/20 border border-red-400/30 rounded-lg px-4 py-2.5 text-sm text-red-200">
              {error}
            </div>
          )}

          <DashboardButton type="submit" disabled={loading} variant="secondary" className="w-full">
            {loading ? "جاري الدخول..." : "دخول"}
          </DashboardButton>
        </form>
      </div>
    </div>
  );
}
