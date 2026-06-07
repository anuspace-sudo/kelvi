"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: authError } =
      mode === "login"
        ? await supabaseBrowser.auth.signInWithPassword({ email, password })
        : await supabaseBrowser.auth.signUp({ email, password });

    setLoading(false);

    if (authError) {
      setError(authError.message);
    } else {
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-16">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.14),transparent_40%),radial-gradient(circle_at_top_right,rgba(192,132,252,0.16),transparent_35%)] blur-2xl" />
      </div>

      <div className="w-full max-w-md rounded-[28px] border border-cyan-400/20 bg-[linear-gradient(135deg,rgba(6,11,24,0.96),rgba(10,16,30,0.98))] p-8 shadow-[0_0_60px_rgba(56,189,248,0.14)] backdrop-blur-xl">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/10 text-lg font-black tracking-[0.28em] text-cyan-100 shadow-[0_0_24px_rgba(56,189,248,0.22)]">
            Q
          </div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-cyan-100/70">Cyber Hub</p>
          <h1 className="mt-1 text-2xl font-black tracking-[0.18em] text-cyan-50 drop-shadow-[0_0_12px_rgba(56,189,248,0.25)]">
            LIVE Q&amp;A
          </h1>
        </div>

        <div className="mb-6 flex rounded-2xl border border-white/8 bg-white/5 p-1">
          <button
            type="button"
            onClick={() => { setMode("login"); setError(null); }}
            className={`flex-1 rounded-xl py-2 text-sm font-semibold transition duration-200 ${
              mode === "login"
                ? "bg-cyan-400/20 text-cyan-50 shadow-[0_0_14px_rgba(56,189,248,0.18)]"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode("signup"); setError(null); }}
            className={`flex-1 rounded-xl py-2 text-sm font-semibold transition duration-200 ${
              mode === "signup"
                ? "bg-violet-400/20 text-violet-100 shadow-[0_0_14px_rgba(167,139,250,0.18)]"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-[11px] uppercase tracking-[0.22em] text-slate-300/80">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-2xl border border-cyan-400/20 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/25"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[11px] uppercase tracking-[0.22em] text-slate-300/80">
              Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-2xl border border-cyan-400/20 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 outline-none placeholder:text-slate-500 transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-400/25"
            />
          </div>

          {error && (
            <p className="rounded-2xl border border-red-400/25 bg-red-400/10 px-4 py-3 text-sm text-red-200">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-2xl bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-500 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.35)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_28px_rgba(125,211,252,0.45)] disabled:cursor-not-allowed disabled:opacity-60 disabled:translate-y-0"
          >
            {loading
              ? "Please wait…"
              : mode === "login"
              ? "Sign In"
              : "Create Account"}
          </button>
        </form>

        {mode === "signup" && (
          <p className="mt-4 text-center text-xs text-slate-400">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => { setMode("login"); setError(null); }}
              className="text-cyan-300 underline underline-offset-2 hover:text-cyan-100"
            >
              Sign in
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
