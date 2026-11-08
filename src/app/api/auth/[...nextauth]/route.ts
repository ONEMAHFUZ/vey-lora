import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// NextAuth handler (Credentials provider configured in src/lib/auth.ts).
// Serves /api/auth/signin, /api/auth/callback/credentials, /api/auth/csrf,
// /api/auth/session and /api/auth/signout.
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
