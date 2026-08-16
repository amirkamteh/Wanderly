"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { AuthFormState } from "@/lib/authState";
import { createClient } from "@/lib/supabase/server";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

function asString(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Only allow relative paths as a post-login destination. Accepting an
 * arbitrary `next` value would turn the login page into an open redirect.
 */
function safeRedirect(target: string): string {
  return target.startsWith("/") && !target.startsWith("//") ? target : "/";
}

export async function signUp(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const firstName = asString(formData.get("firstName"));
  const lastName = asString(formData.get("lastName"));
  const email = asString(formData.get("email"));
  const password = asString(formData.get("password"));
  const next = safeRedirect(asString(formData.get("next")) || "/");

  const errors: AuthFormState["errors"] = {};
  if (!firstName || firstName.length > 80) errors.firstName = "Enter your first name";
  if (!lastName || lastName.length > 80) errors.lastName = "Enter your last name";
  if (!EMAIL_PATTERN.test(email)) errors.email = "Enter a valid email address";
  if (password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `Use at least ${MIN_PASSWORD_LENGTH} characters`;
  }
  if (Object.keys(errors).length > 0) {
    return { status: "error", message: "Please check the highlighted fields.", errors };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    // Consumed by the private.handle_new_user trigger to seed the profile.
    // Never used for authorisation — user metadata is user-editable.
    options: { data: { first_name: firstName, last_name: lastName } },
  });

  if (error) {
    return { status: "error", message: error.message, errors: {} };
  }

  // With email confirmation on, there is no session until the link is clicked.
  if (!data.session) {
    return {
      status: "check-email",
      message: `Almost there — confirm your address from the email we sent to ${email}.`,
      errors: {},
    };
  }

  revalidatePath("/", "layout");
  redirect(next);
}

export async function signIn(
  _previous: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = asString(formData.get("email"));
  const password = asString(formData.get("password"));
  const next = safeRedirect(asString(formData.get("next")) || "/");

  const errors: AuthFormState["errors"] = {};
  if (!EMAIL_PATTERN.test(email)) errors.email = "Enter a valid email address";
  if (!password) errors.password = "Enter your password";
  if (Object.keys(errors).length > 0) {
    return { status: "error", message: "Please check the highlighted fields.", errors };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Supabase returns one message for both unknown email and wrong password,
    // which is what you want — anything more specific enumerates accounts.
    return {
      status: "error",
      message: "That email and password combination did not work.",
      errors: {},
    };
  }

  revalidatePath("/", "layout");
  redirect(next);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
