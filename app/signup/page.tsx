import type { Metadata } from "next";
import AuthForm from "@/components/AuthForm";
import AuthLayout from "@/components/AuthLayout";

export const metadata: Metadata = {
  title: "Sign up",
  description:
    "Create a Wanderly account to save homes, book experiences and message hosts.",
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="It takes a minute, and your wishlist comes with you."
    >
      <AuthForm mode="signup" />
    </AuthLayout>
  );
}
