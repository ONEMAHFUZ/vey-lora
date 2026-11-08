import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

// POST /api/auth/signup — creates a user from the plain HTML signup form
// (name, email, password). No email verification yet: no email provider is
// wired, so the account is active immediately. Redirects (303) so the
// browser follows with a GET: success -> /auth/signin?registered=1,
// problems -> /auth/signup?error=...
const FREE_PLAN_CREDITS = 20;

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim().toLowerCase();
    const password = String(form.get("password") ?? "");

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8) {
      return NextResponse.redirect(new URL("/auth/signup?error=invalid", req.url), 303);
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.redirect(new URL("/auth/signup?error=exists", req.url), 303);
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

    return NextResponse.redirect(new URL("/auth/signin?registered=1", req.url), 303);
  } catch (err) {
    console.error("Signup failed:", err);
    return NextResponse.redirect(new URL("/auth/signup?error=server", req.url), 303);
  }
}
