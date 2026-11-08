import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

// POST /api/auth/signup — creates a user from the plain HTML signup form
// (name, email, password). No email verification yet: no email provider is
// wired, so the account is active immediately. Redirects (303) so the
// browser follows with a GET: success -> /auth/signin?registered=1,
// problems -> /auth/signup?error=...
// The redirect Location is RELATIVE on purpose: building it from req.url
// breaks on Render, where the service is reached internally as
// https://localhost:10000 and req.url carries that origin, sending the
// browser to localhost (ERR_CONNECTION_REFUSED) after a successful signup.
const FREE_PLAN_CREDITS = 20;

function redirect303(path: string) {
  return new Response(null, { status: 303, headers: { Location: path } });
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim().toLowerCase();
    const password = String(form.get("password") ?? "");

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8) {
      return redirect303("/auth/signup?error=invalid");
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return redirect303("/auth/signup?error=exists");
    }

    const passwordHash = await hashPassword(password);
    await prisma.user.create({
      data: {
        email,
        name: name || null,
        passwordHash,
        credit: { create: { balance: FREE_PLAN_CREDITS } },
      },
    });

    return redirect303("/auth/signin?registered=1");
  } catch (err) {
    console.error("Signup failed:", err);
    return redirect303("/auth/signup?error=server");
  }
}
