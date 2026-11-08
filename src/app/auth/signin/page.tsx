import { Suspense } from "react";
import SignInForm from "./SignInForm";

// Rendered per request, never statically prerendered: the form reads the
// URL (?registered=1) with useSearchParams, and the static prerender of
// this page crashed the Render build ("Export encountered errors on
// /auth/signin"). The signup page is already dynamic, which is why only
// sign-in failed.
export const dynamic = "force-dynamic";

export default function SignIn() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}
