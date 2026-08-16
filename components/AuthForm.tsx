"use client";

import { Eye, EyeOff, MailCheck, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { signIn, signUp } from "@/app/actions/auth";
import { initialAuthState } from "@/lib/authState";
import { BRAND } from "@/data/footer";
import { cn } from "@/lib/utils";

type Mode = "login" | "signup";

/**
 * Email and password auth backed by Supabase.
 *
 * Validation runs again in the server action — these checks are only a
 * convenience, never the enforcement point.
 */
export default function AuthForm({ mode }: { mode: Mode }) {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/";
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction] = useActionState(
    mode === "signup" ? signUp : signIn,
    initialAuthState,
  );

  if (state.status === "check-email") {
    return (
      <div className="rounded-2xl border border-line bg-surface p-6 text-center">
        <MailCheck aria-hidden="true" className="mx-auto size-8 text-brand-600" />
        <p className="mt-3 text-base font-semibold text-ink">Check your inbox</p>
        <p className="mt-2 text-sm text-muted" role="status">
          {state.message}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate className="space-y-4">
      <input type="hidden" name="next" value={next} />

      {mode === "signup" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            id="firstName"
            label="First name"
            autoComplete="given-name"
            error={state.errors.firstName}
          />
          <Field
            id="lastName"
            label="Last name"
            autoComplete="family-name"
            error={state.errors.lastName}
          />
        </div>
      )}

      <Field
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        error={state.errors.email}
      />

      <Field
        id="password"
        label="Password"
        type={showPassword ? "text" : "password"}
        autoComplete={mode === "signup" ? "new-password" : "current-password"}
        error={state.errors.password}
        hint={mode === "signup" ? "At least 8 characters" : undefined}
        trailing={
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="text-muted transition hover:text-ink"
          >
            {showPassword ? (
              <EyeOff aria-hidden="true" className="size-4" />
            ) : (
              <Eye aria-hidden="true" className="size-4" />
            )}
          </button>
        }
      />

      {state.status === "error" && (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          <TriangleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          {state.message}
        </p>
      )}

      <SubmitButton mode={mode} />

      <p className="text-xs text-muted">
        By continuing you agree to {BRAND.name}&rsquo;s{" "}
        <Link href="/help#terms" className="text-ink underline underline-offset-2">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/help#privacy" className="text-ink underline underline-offset-2">
          Privacy Policy
        </Link>
        .
      </p>

      <div className="flex items-center gap-4 py-2">
        <span className="h-px flex-1 bg-line" />
        <span className="text-xs text-muted">or</span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <div className="space-y-3">
        <SocialButton provider="Google" />
        <SocialButton provider="Apple" />
      </div>

      <p className="pt-2 text-center text-sm text-muted">
        {mode === "signup" ? (
          <>
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-ink underline underline-offset-2">
              Log in
            </Link>
          </>
        ) : (
          <>
            New to {BRAND.name}?{" "}
            <Link href="/signup" className="font-semibold text-ink underline underline-offset-2">
              Sign up
            </Link>
          </>
        )}
      </p>
    </form>
  );
}

function SubmitButton({ mode }: { mode: Mode }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "w-full rounded-xl px-6 py-3.5 text-base font-semibold text-white transition",
        pending
          ? "cursor-wait bg-brand-400"
          : "bg-brand-600 hover:bg-brand-700 active:scale-[0.99]",
      )}
    >
      {pending
        ? mode === "signup"
          ? "Creating account…"
          : "Logging in…"
        : mode === "signup"
          ? "Agree and continue"
          : "Log in"}
    </button>
  );
}

function Field({
  id,
  label,
  type = "text",
  autoComplete,
  error,
  hint,
  trailing,
}: {
  id: string;
  label: string;
  type?: string;
  autoComplete?: string;
  error?: string;
  hint?: string;
  trailing?: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      <div
        className={cn(
          "flex items-center gap-2 rounded-xl border px-3.5 py-3 transition focus-within:border-ink",
          error ? "border-red-500" : "border-line-strong",
        )}
      >
        <input
          id={id}
          name={id}
          type={type}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className="w-full bg-transparent text-[15px] outline-none placeholder:text-subtle"
        />
        {trailing}
      </div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/** Social sign-in is not configured on this project yet. */
function SocialButton({ provider }: { provider: "Google" | "Apple" }) {
  return (
    <button
      type="button"
      disabled
      title={`${provider} sign-in is not configured on this project`}
      className="flex w-full cursor-not-allowed items-center justify-center gap-3 rounded-xl border border-line px-6 py-3 text-sm font-medium text-subtle"
    >
      <span
        aria-hidden="true"
        className="flex size-5 items-center justify-center rounded-full bg-line text-[11px] font-bold text-subtle"
      >
        {provider === "Google" ? "G" : "A"}
      </span>
      Continue with {provider}
    </button>
  );
}
