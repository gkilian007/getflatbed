"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Step = 1 | 2 | 3;

const airports = ["MAD", "BCN", "BOG", "MEX", "EZE", "MIA", "LIS"];
const destinations = ["NYC", "Tokyo", "Dubai", "Singapore", "Bangkok", "London", "Paris"];
const dealTypes = ["Error fares", "Miles deals", "Flash sales", "Upgrades"];
const expertiseLevels = ["Beginner", "Intermediate", "Expert"];

const MONTHLY_PRICE_ID = process.env.NEXT_PUBLIC_STRIPE_MONTHLY_PRICE_ID || "price_1TFqrXGi2m9cbdSO9ETjNyvd";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Step 2
  const [selectedAirports, setSelectedAirports] = useState<string[]>([]);
  const [selectedDests, setSelectedDests] = useState<string[]>([]);
  const [selectedDealTypes, setSelectedDealTypes] = useState<string[]>([]);
  const [expertise, setExpertise] = useState("Beginner");

  const supabase = createClient();

  const toggleItem = (list: string[], setList: (v: string[]) => void, item: string) => {
    setList(list.includes(item) ? list.filter((i) => i !== item) : [...list, item]);
  };

  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setError("");

    if (password !== confirmPassword) {
      setPasswordError("Passwords don't match");
      return;
    }
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    });

    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setStep(2);
    }
  };

  const handleStep2 = async () => {
    setLoading(true);
    setError("");

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("profiles").update({
        origin_airports: selectedAirports,
        dest_preferences: selectedDests,
        miles_level: expertise.toLowerCase() as "beginner" | "intermediate" | "expert",
        updated_at: new Date().toISOString(),
      }).eq("id", user.id);
    }

    setLoading(false);
    setStep(3);
  };

  const handleGoogleSignup = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const handleFreeplan = () => {
    router.push("/dashboard");
  };

  const handlePremium = async () => {
    setLoading(true);
    setError("");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: MONTHLY_PRICE_ID }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Failed to start checkout");
        setLoading(false);
      }
    } catch {
      setError("Failed to start checkout");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="text-3xl">✈️</span>
            <span className="text-2xl font-black tracking-tight">
              Get<span className="gold">Flatbed</span>
            </span>
          </Link>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {([1, 2, 3] as Step[]).map((s) => (
            <div key={s} className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition ${
                  s === step
                    ? "gradient-gold text-black"
                    : s < step
                    ? "bg-green-500/20 text-green-400 border border-green-500/40"
                    : "bg-white/10 text-gray-600"
                }`}
              >
                {s < step ? "✓" : s}
              </div>
              {s < 3 && (
                <div className={`w-8 h-0.5 ${s < step ? "bg-green-500/40" : "bg-white/10"}`} />
              )}
            </div>
          ))}
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3 mb-6">
            {error}
          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <div className="deal-card rounded-2xl p-8">
            <h1 className="text-2xl font-black mb-1">Create your account</h1>
            <p className="text-gray-500 text-sm mb-6">Free forever. No credit card required.</p>

            <button
              type="button"
              onClick={handleGoogleSignup}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 border border-white/20 text-white font-semibold py-3.5 rounded-xl hover:bg-white/5 transition mb-6 text-sm disabled:opacity-60"
            >
              <span className="text-xl">G</span>
              Continue with Google
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-gray-600">or continue with email</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <form onSubmit={handleStep1} className="space-y-4">
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
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">
                  Confirm password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl text-sm"
                />
                {passwordError && (
                  <p className="text-red-400 text-xs mt-2">{passwordError}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full gradient-gold text-black font-black py-4 rounded-xl hover:opacity-90 transition mt-2 disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Next →"}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{" "}
              <Link href="/login" className="text-yellow-500 hover:text-yellow-400 font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="deal-card rounded-2xl p-8">
            <h2 className="text-2xl font-black mb-1">Your preferences</h2>
            <p className="text-gray-500 text-sm mb-8">Help us find the right deals for you</p>

            <div className="mb-6">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-3">
                Home airports
              </label>
              <div className="flex flex-wrap gap-2">
                {airports.map((ap) => (
                  <button
                    key={ap}
                    type="button"
                    onClick={() => toggleItem(selectedAirports, setSelectedAirports, ap)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                      selectedAirports.includes(ap)
                        ? "gradient-gold text-black"
                        : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10"
                    }`}
                  >
                    {ap}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-3">
                Dream destinations
              </label>
              <div className="flex flex-wrap gap-2">
                {destinations.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleItem(selectedDests, setSelectedDests, d)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition ${
                      selectedDests.includes(d)
                        ? "gradient-gold text-black"
                        : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-3">
                Deal types
              </label>
              <div className="space-y-2">
                {dealTypes.map((dt) => (
                  <label key={dt} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedDealTypes.includes(dt)}
                      onChange={() => toggleItem(selectedDealTypes, setSelectedDealTypes, dt)}
                      className="w-4 h-4 accent-yellow-400"
                    />
                    <span className="text-sm text-gray-300">{dt}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-3">
                Miles & points expertise
              </label>
              <div className="grid grid-cols-3 gap-2">
                {expertiseLevels.map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setExpertise(level)}
                    className={`py-2.5 rounded-xl text-sm font-semibold transition ${
                      expertise === level
                        ? "gradient-gold text-black"
                        : "bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 border border-white/20 text-white font-bold py-4 rounded-xl hover:bg-white/5 transition"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleStep2}
                disabled={loading}
                className="flex-1 gradient-gold text-black font-black py-4 rounded-xl hover:opacity-90 transition disabled:opacity-60"
              >
                {loading ? "Saving..." : "Next →"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="deal-card rounded-2xl p-8">
            <h2 className="text-2xl font-black mb-1">Choose your plan</h2>
            <p className="text-gray-500 text-sm mb-8">Start free, upgrade anytime</p>

            <div className="space-y-4 mb-8">
              {/* Explorer */}
              <div className="border border-white/10 rounded-xl p-5 hover:border-white/20 transition">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold">Explorer</h3>
                    <p className="text-xs text-gray-500">For casual travelers</p>
                  </div>
                  <div className="text-xl font-black">Free</div>
                </div>
                <ul className="space-y-1.5 text-xs text-gray-500 mb-4">
                  <li>✓ 2 deals per week (48h delay)</li>
                  <li>✓ Weekly newsletter</li>
                  <li>✓ Basic guides</li>
                </ul>
                <button
                  onClick={handleFreeplan}
                  className="block w-full text-center border border-white/20 text-white font-bold py-3 rounded-xl hover:bg-white/5 transition text-sm"
                >
                  Start with Explorer
                </button>
              </div>

              {/* Premium */}
              <div
                className="border-2 border-yellow-500/60 rounded-xl p-5 glow relative"
                style={{ background: "rgba(245,200,66,0.04)" }}
              >
                <div className="absolute -top-3 right-4">
                  <span className="text-xs font-bold gradient-gold text-black px-3 py-1 rounded-full">
                    Recommended
                  </span>
                </div>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold">Premium</h3>
                    <p className="text-xs text-gray-400">For serious deal hunters</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-black">€9</div>
                    <div className="text-xs text-gray-500">/month</div>
                  </div>
                </div>
                <ul className="space-y-1.5 text-xs text-gray-300 mb-4">
                  <li><span className="gold">✓</span> All deals in real-time</li>
                  <li><span className="gold">✓</span> Instant Telegram alerts</li>
                  <li><span className="gold">✓</span> Error fare notifications</li>
                  <li><span className="gold">✓</span> Full playbooks & guides</li>
                </ul>
                <button
                  onClick={handlePremium}
                  disabled={loading}
                  className="block w-full text-center gradient-gold text-black font-black py-3 rounded-xl hover:opacity-90 transition text-sm disabled:opacity-60"
                >
                  {loading ? "Redirecting..." : "Start free trial →"}
                </button>
                <p className="text-xs text-center text-gray-600 mt-2">
                  7-day free trial · Cancel anytime
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full border border-white/10 text-gray-500 font-semibold py-3 rounded-xl hover:bg-white/5 transition text-sm"
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
