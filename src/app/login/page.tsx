"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const supabase = createClient();

  // Si ya está logado, redirigir al dashboard
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace("/dashboard");
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
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
          <h1 className="text-2xl font-black mb-1">Bienvenido de vuelta</h1>
          <p className="text-gray-500 text-sm mb-8">
            Inicia sesión para acceder a tus ofertas
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3 mb-6">
              {error}
            </div>
          )}

          {/* Google SSO */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 border border-white/20 text-white font-semibold py-3.5 rounded-xl hover:bg-white/5 transition mb-6 text-sm disabled:opacity-60"
          >
            <span className="text-xl">G</span>
            Continuar con Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-gray-600">o continúa con email</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                placeholder="tu@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl text-sm"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  Contraseña
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-yellow-500 hover:text-yellow-400"
                >
                  ¿Olvidaste tu contraseña?
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
              {loading ? "Iniciando sesión..." : "Iniciar sesión →"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            ¿No tienes cuenta?{" "}
            <Link
              href="/register"
              className="text-yellow-500 hover:text-yellow-400 font-semibold"
            >
              Crear cuenta gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
