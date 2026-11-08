const ERROR_MESSAGES: Record<string, string> = {
  exists: "An account with this email already exists. Try signing in instead.",
  invalid: "Enter a valid email and a password of at least 8 characters.",
  server: "Something went wrong creating your account. Please try again.",
};

export default function SignUp({ searchParams }: { searchParams?: { error?: string } }) {
  const error = searchParams?.error ? ERROR_MESSAGES[searchParams.error] : null;
  return <div className="mx-auto max-w-md px-4 py-16"><h1 className="text-3xl font-bold">Create your account</h1><p className="mt-2 text-slate-400">Passwords are hashed with bcrypt (12 rounds). Verification email is sent once an email provider is configured.</p>{error ? <p className="mt-4 rounded-xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">{error}</p> : null}<form className="mt-6 space-y-3" action="/api/auth/signup" method="post"><input name="name" required placeholder="Full name" className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3" /><input name="email" type="email" required placeholder="Email" className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3" /><input name="password" type="password" required minLength={8} placeholder="Password (min 8 characters)" className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3" /><button className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-blue-500 px-6 py-3 font-semibold">Get Started</button></form><p className="mt-4 text-sm">Already have an account? <a href="/auth/signin" className="text-violet-300 underline">Sign in</a></p></div>;
}
