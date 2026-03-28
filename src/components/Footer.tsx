"use client";

import Link from "next/link";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="border-t border-white/5 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <span className="text-xl">✈️</span>
              <span className="font-black text-lg">
                Get<span className="gold">Flatbed</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 mb-6">
              Vuela inteligente, vuela en business.
              <br />
              El único servicio de alertas de vuelos hecho para viajeros de habla hispana.
            </p>
            {/* Social */}
            <div className="flex gap-4 text-sm text-gray-500">
              <a href="#" className="hover:text-gold transition">
                Instagram
              </a>
              <a href="#" className="hover:text-gold transition">
                Twitter/X
              </a>
              <a href="#" className="hover:text-gold transition">
                Telegram
              </a>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4">Producto</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li>
                <Link href="/deals" className="hover:text-white transition">
                  Deals
                </Link>
              </li>
              <li>
                <Link href="/guides" className="hover:text-white transition">
                  Guías
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-white transition">
                  Precios
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-white transition">
                  Cómo funciona
                </Link>
              </li>
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4">Empresa</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li>
                <Link href="/about" className="hover:text-white transition">
                  Quiénes somos
                </Link>
              </li>
              <li>
                <a
                  href="mailto:hello@getflatbed.com"
                  className="hover:text-white transition"
                >
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h4 className="text-sm font-bold text-white mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li>
                <Link
                  href="/legal/privacy"
                  className="hover:text-white transition"
                >
                  Privacidad
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/terms"
                  className="hover:text-white transition"
                >
                  Términos
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-white/5 pt-10 mb-10">
          <div className="max-w-md">
            <h4 className="text-sm font-bold text-white mb-1">
              Recibe ofertas en tu bandeja de entrada
            </h4>
            <p className="text-xs text-gray-600 mb-4">
              Resumen semanal gratuito. Sin spam, nunca.
            </p>
            {subscribed ? (
              <p className="text-sm text-green-400 font-semibold">
                ¡Suscrito! Revisa tu bandeja de entrada pronto.
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-3">
                <input
                  type="email"
                  placeholder="tu@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-lg text-sm"
                />
                <button
                  type="submit"
                  className="gradient-gold text-black text-sm font-bold px-5 py-2.5 rounded-lg hover:opacity-90 transition whitespace-nowrap"
                >
                  Suscribirme
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600">
            © 2026 GetFlatbed · Vuela inteligente, vuela en business
          </p>
          <p className="text-xs text-gray-700">
            Nosotros encontramos las ofertas. Tú reservas el vuelo. Así de simple.
          </p>
        </div>
      </div>
    </footer>
  );
}
