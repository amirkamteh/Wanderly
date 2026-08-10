import type { Metadata } from "next";
import AuthForm from "@/components/AuthForm";
import AuthLayout from "@/components/AuthLayout";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to Wanderly to manage your trips, wishlist and hosting.",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to pick up where you left off."
    >
      <AuthForm mode="login" />
    </AuthLayout>
  );
}
