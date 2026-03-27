"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate loading
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="text-3xl">✈️</span>
            <span className="text-2xl font-black tracking-tight">
              Get<span className="gold">Flatbed</span>
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="deal-card rounded-2xl p-8">
          <h1 className="text-2xl font-black mb-1">Welcome back</h1>
          <p className="text-gray-500 text-sm mb-8">
            Sign in to your account to access deals
          </p>

          {/* Google SSO */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 border border-white/20 text-white font-semibold py-3.5 rounded-xl hover:bg-white/5 transition mb-6 text-sm"
          >
            <span className="text-xl">G</span>
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-gray-600">or continue with email</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">
                Email address
              </label>
              <input
                type="email"
                placeholder="your@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl text-sm"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-yellow-500 hover:text-yellow-400"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-gold text-black font-black py-4 rounded-xl hover:opacity-90 transition disabled:opacity-60 mt-2"
            >
              {loading ? "Signing in..." : "Sign in →"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-yellow-500 hover:text-yellow-400 font-semibold"
            >
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
