"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

// Client sign-in via next-auth's signIn() helper. A plain HTML form POST to
// /api/auth/signin cannot work with NextAuth v4 credentials: that endpoint
// requires a provider in the path and a valid CSRF token, and the
// credentials flow is handled by /api/auth/callback/credentials — signIn()
// fetches the CSRF token and posts there for us.
export default function SignInForm() {
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const registered = searchParams.get("registered") === "1";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const data = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      redirect: false,
      email: String(data.get("email") ?? ""),
      password: String(data.get("password") ?? ""),
      callbackUrl: "/dashboard",
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password. Please try again.");
      return;
    }
    // Navigate by path only, never by res.url's origin: if NEXTAUTH_URL is
    // misconfigured (e.g. localhost), NextAuth can return a localhost URL
    // here, which would send the browser to localhost instead of this site.
    let target = "/dashboard";
    if (res?.url) {
      try {
        const u = new URL(res.url, window.location.origin);
        target = u.pathname + u.search;
      } catch {
        target = "/dashboard";
      }
    }
    window.location.href = target;
  }

  return <div className="mx-auto max-w-md px-4 py-16"><h1 className="text-3xl font-bold">Sign In</h1><p className="mt-2 text-slate-400">Credentials sign-in via NextAuth. Email verification and password reset are wired after an email provider is configured.</p>{registered ? <p className="mt-4 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">Account created — please sign in.</p> : null}{error ? <p className="mt-4 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">{error}</p> : null}<form className="mt-6 space-y-3" onSubmit={handleSubmit}><input name="email" type="email" required placeholder="Email" className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3" /><input name="password" type="password" required placeholder="Password" className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3" /><button disabled={loading} className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 px-6 py-3 font-semibold disabled:opacity-60">{loading ? "Signing in…" : "Sign In"}</button></form><p className="mt-4 text-sm"><a href="/auth/signup" className="text-violet-300 underline">Create an account</a> · <a href="/faq" className="text-violet-300 underline">Forgot password?</a></p></div>;
}
