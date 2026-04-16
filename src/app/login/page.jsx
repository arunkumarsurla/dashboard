"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogIn, Eye, EyeOff, Mail, Lock } from "lucide-react";
import { getToken, setToken, setUser } from "@/utils/auth";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [creds, setCreds] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (getToken()) router.replace("/admin");
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!creds.email || !creds.password) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(creds),
      });
      const json = await res.json();
      if (res.ok) {
        setToken(json.data.token);
        setUser(json.data.user);
        router.push("/admin");
      } else {
        setError(json.message || "Invalid credentials");
      }
    } catch {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-blue-600"
      style={{
        background:
          "linear-gradient(135deg,#f0f4f8 0%,#e0ecfb 50%,#dbeafe 100%)",
      }}
    >
      {/* Decorative waves */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1440 810"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill="#5b8fc7"
          fillOpacity=".2"
          d="M0,400 C300,500 600,450 900,400 C1200,350 1350,380 1440,400 L1440,810 L0,810 Z"
        />
        <path
          fill="#4a7bb7"
          fillOpacity=".35"
          d="M0,460 C350,560 650,510 950,460 C1250,410 1380,440 1440,460 L1440,810 L0,810 Z"
        />
        <path
          fill="#1e5a9e"
          fillOpacity=".55"
          d="M0,510 C400,610 700,560 1000,510 C1300,460 1400,490 1440,510 L1440,810 L0,810 Z"
        />
        <path
          fill="#1e3a8a"
          d="M0,560 C450,660 750,610 1050,560 C1350,510 1420,545 1440,565 L1440,810 L0,810 Z"
        />
      </svg>
      <div className="absolute top-8 left-8 w-40 h-40 rounded-full bg-blue-300 opacity-10 blur-3xl" />
      <div className="absolute bottom-20 right-12 w-32 h-32 rounded-full bg-blue-500 opacity-15 blur-2xl" />

      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative z-10 animate-fadeIn">
        <div className="text-center mb-7">
          <div
            className="inline-flex items-center justify-center "
            style={{ background: "#1e3a8a" }}
          >
            <Image
              src="/ak_logo_white.png"
              width={100}
              height={100}
              alt="logo"
            />
            {/* <Droplets size={30} className="text-white"/> */}
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            AK Admin
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Customer Management System
          </p>
        </div>

        {error && (
          <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">
              Email Address
            </label>

            <div className="relative group">
              <div
                className="absolute left-3 top-1/2 -translate-y-1/2 
                bg-blue-50 p-1.5 rounded-lg"
              >
                <Mail size={16} className="text-blue-600" />
              </div>

              <input
                type="email"
                value={creds.email}
                onChange={(e) => setCreds({ ...creds, email: e.target.value })}
                placeholder="admin@ak.com"
                className="w-full pl-14 pr-4 py-3 rounded-xl border border-gray-200 
                focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                outline-none transition-all text-sm"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">
              Password
            </label>

            <div className="relative group">
              <div
                className="absolute left-3 top-1/2 -translate-y-1/2 
                bg-blue-50 p-1.5 rounded-lg"
              >
                <Lock size={16} className="text-blue-600" />
              </div>

              <input
                type={showPass ? "text" : "password"}
                value={creds.password}
                onChange={(e) =>
                  setCreds({ ...creds, password: e.target.value })
                }
                placeholder="Enter password"
                className="w-full pl-14 pr-12 py-3 rounded-xl border border-gray-200 
                focus:border-blue-500 focus:ring-2 focus:ring-blue-200 
                outline-none transition-all text-sm"
                required
              />

              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 
                text-gray-400 hover:text-gray-600"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-bold text-sm shadow-lg transition-all hover:shadow-xl disabled:opacity-60 mt-2"
          >
            {loading ? (
              <div
                className="spinner"
                style={{ width: 18, height: 18, borderWidth: 2 }}
              />
            ) : (
              <LogIn size={18} />
            )}
            {loading ? "Signing in…" : "Sign In to Dashboard"}
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            onClick={() => router.push("/forgot-password")}
            className="text-xs text-blue-500 hover:text-blue-700 hover:underline transition-colors"
          >
            Forgot your password?
          </button>
        </div>

        <p className="mt-5 text-center text-xs text-slate-400">
          Single-admin system · AK Enterprises
        </p>
      </div>
    </div>
  );
}
