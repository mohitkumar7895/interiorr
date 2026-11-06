"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import MaLogo from "@/components/ui/MaLogo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@mainterior.com");
  const [password, setPassword] = useState("admin123");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      toast.success(`Welcome back, ${data.user.name}!`);
      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Invalid credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-black flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />

      {/* Back to Live Website Link */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20">
        <Link
          href="/"
          className="text-xs text-gray-400 hover:text-brand-gold transition-colors inline-flex items-center gap-1.5"
        >
          &larr; Return to Live Website
        </Link>
      </div>

      <div className="w-full max-w-md relative z-10 pt-8 sm:pt-0">
        {/* Card Header with Emblem */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto relative mb-3 sm:mb-4">
            <Image
              src="/logo/ma-emblem.svg"
              alt="MA Emblem"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-white">
            Admin Management Portal
          </h1>
          <p className="text-[11px] sm:text-xs text-brand-gold tracking-widest uppercase font-semibold mt-1">
            MA Carpenter and Interior • Sector 120 Noida
          </p>
        </div>

        {/* Login Form Box */}
        <div className="bg-brand-charcoal/90 border border-brand-gold/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl backdrop-blur-md">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-gold mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@mainterior.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-brand-surface border border-brand-gold/20 focus:border-brand-gold text-brand-cream text-xs outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-gold mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-brand-surface border border-brand-gold/20 focus:border-brand-gold text-brand-cream text-xs outline-none transition-colors"
                />
              </div>
            </div>

            {/* Quick Helper for convenience */}
            <div className="p-3 rounded-xl bg-brand-gold/5 border border-brand-gold/20 text-[11px] text-gray-300">
              <span className="font-semibold text-brand-gold">Default Credentials:</span>
              <p className="mt-0.5 text-gray-400">
                Email: <code className="text-white">admin@mainterior.com</code> or <code className="text-white">Monishpasha233@gmail.com</code>
                <br />
                Password: <code className="text-white">admin123</code>
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-gold via-brand-goldLight to-brand-goldDark text-brand-black font-bold text-xs uppercase tracking-widest hover:shadow-gold-md active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
            >
              <span>{isLoading ? "Signing In..." : "Access Control Panel"}</span>
              <ArrowRight size={15} />
            </button>
          </form>
        </div>

        {/* Security Badge */}
        <p className="text-[11px] text-gray-500 text-center mt-6 flex items-center justify-center gap-1.5">
          <ShieldCheck size={14} className="text-brand-gold" />
          <span>Secured with HTTP-Only Session JWT & Rate-Limiting</span>
        </p>
      </div>
    </div>
  );
}

