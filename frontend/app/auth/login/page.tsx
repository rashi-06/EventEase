"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL, api } from "../../lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await api.post("/api/auth/login", {
        email,
        password
      });
      if (res.status !== 200) throw new Error("Invalid credentials");
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_BASE_URL}/api/auth/google`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top_right,_rgba(149,106,250,0.18),_transparent_35%),linear-gradient(180deg,rgba(149,106,250,0.08),transparent_28%)] p-4">
      <div className="w-full max-w-md rounded-[28px] border border-black/5 bg-background p-8 shadow-[0_24px_90px_rgba(149,106,250,0.15)] space-y-6">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-primary/65">Welcome back</p>
          <h2 className="mt-2 text-3xl font-bold text-foreground">Login</h2>
          <p className="mt-2 text-sm text-foreground/65">
            Continue to your dashboard or use Google to sign in faster.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-300"
          >
            {submitting ? "Logging in..." : "Login"}
          </button>
          {error && <div className="text-red-600 text-center mt-2">{error}</div>}
        </form>
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-black/10" />
          <span className="text-xs uppercase tracking-[0.18em] text-foreground/45">or</span>
          <div className="h-px flex-1 bg-black/10" />
        </div>
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-black/10 bg-white px-4 py-3 text-sm font-medium text-slate-800 transition hover:border-primary/30 hover:bg-primary/5"
        >
          <img src="/google-icon.svg" alt="" className="h-5 w-5" />
          Continue with Google
        </button>
      </div>
    </div>
  );
}
