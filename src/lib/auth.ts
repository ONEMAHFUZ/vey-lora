import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
export type Role = "GUEST" | "USER" | "CREATOR" | "ADMIN" | "SUPER_ADMIN";
export function hasRole(role: string | undefined, allowed: Role[]): boolean {
  return !!role && allowed.includes(role as Role);
}
export function isAdmin(role: string | undefined): boolean {
  return hasRole(role, ["ADMIN", "SUPER_ADMIN"]);
}

// Credentials provider against the Prisma User table. Email verification,
// forgot/reset password flows are stubs to be wired to an email provider;
// never accept a login without a bcrypt-verified password hash.
export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: { email: { label: "Email", type: "email" }, password: { label: "Password", type: "password" } },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user) return null;
        const ok = await verifyPassword(credentials.password, user.passwordHash);
        if (!ok) return null;
        return { id: user.id, email: user.email, name: user.name, role: user.role } as never;
      },
    }),
  ],
  callbacks: {
    // Carry the user id (and role) through the JWT into the session, so
    // server code (e.g. src/lib/usage.ts getSessionUser) can identify the
    // signed-in user. Without the id, signed-in users look like guests.
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as { id?: string }).id;
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
  pages: { signIn: "/auth/signin" },
  secret: process.env.NEXTAUTH_SECRET,
};
