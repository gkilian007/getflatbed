"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 w-full z-50 backdrop-blur-md border-b border-white/5"
      style={{ background: "rgba(10,10,15,0.85)" }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">✈️</span>
          <span className="text-xl font-black tracking-tight">
            Get<span className="gold">Flatbed</span>
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
          <Link href="/how-it-works" className="hover:text-white transition">
            Cómo funciona
          </Link>
          <Link href="/deals" className="hover:text-white transition">
            Deals
          </Link>
          <Link href="/pricing" className="hover:text-white transition">
            Precios
          </Link>
          <Link href="/guides" className="hover:text-white transition">
            Guías
          </Link>
        </div>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-4">
          <Link
            href="/register"
            className="gradient-gold text-black text-sm font-bold px-5 py-2.5 rounded-full hover:opacity-90 transition"
          >
            Acceso anticipado
          </Link>
          <button
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Abrir menú"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/5 px-6 py-4 flex flex-col gap-4 text-sm text-gray-400">
          <Link
            href="/how-it-works"
            className="hover:text-white transition"
            onClick={() => setMobileMenuOpen(false)}
          >
            Cómo funciona
          </Link>
          <Link
            href="/deals"
            className="hover:text-white transition"
            onClick={() => setMobileMenuOpen(false)}
          >
            Deals
          </Link>
          <Link
            href="/pricing"
            className="hover:text-white transition"
            onClick={() => setMobileMenuOpen(false)}
          >
            Precios
          </Link>
          <Link
            href="/guides"
            className="hover:text-white transition"
            onClick={() => setMobileMenuOpen(false)}
          >
            Guías
          </Link>
        </div>
      )}
    </nav>
  );
}
