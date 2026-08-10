"use client";

import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { BRAND } from "@/data/footer";
import { cn } from "@/lib/utils";

type Mode = "login" | "signup";

interface AuthFormProps {
  mode: Mode;
  /** Called after a valid submit; the page decides what happens next. */
  onSuccess?: () => void;
}

interface FieldErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Presentational auth form with real client-side validation. Nothing is sent
 * anywhere — there is no backend behind this build.
 */
export default function AuthForm({ mode, onSuccess }: AuthFormProps) {
  const [values, setValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function validate(): FieldErrors {
    const next: FieldErrors = {};
    if (mode === "signup") {
      if (!values.firstName.trim()) next.firstName = "Enter your first name";
      if (!values.lastName.trim()) next.lastName = "Enter your last name";
    }
    if (!EMAIL_PATTERN.test(values.email)) next.email = "Enter a valid email address";
    if (values.password.length < 8) next.password = "Use at least 8 characters";
    return next;
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length === 0) {
      setSubmitted(true);
      onSuccess?.();
    }
  }

  const set = (key: keyof typeof values) => (event: React.ChangeEvent<HTMLInputElement>) =>
    setValues((current) => ({ ...current, [key]: event.target.value }));

  if (submitted) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-6 text-center">
        <p className="text-base font-semibold text-ink">
          {mode === "signup" ? "Account details captured" : "Details captured"}
        </p>
        <p className="mt-2 text-sm text-muted">
          This build has no backend, so nothing was submitted or stored. Wire this
          form to your auth provider to make it real.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-4 text-sm font-semibold text-ink underline underline-offset-2"
        >
          Back to the form
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {mode === "signup" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            id="firstName"
            label="First name"
            autoComplete="given-name"
            value={values.firstName}
            onChange={set("firstName")}
            error={errors.firstName}
          />
          <Field
            id="lastName"
            label="Last name"
            autoComplete="family-name"
            value={values.lastName}
            onChange={set("lastName")}
            error={errors.lastName}
          />
        </div>
      )}

      <Field
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        value={values.email}
        onChange={set("email")}
        error={errors.email}
      />

      <Field
        id="password"
        label="Password"
        type={showPassword ? "text" : "password"}
        autoComplete={mode === "signup" ? "new-password" : "current-password"}
        value={values.password}
        onChange={set("password")}
        error={errors.password}
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

      <button
        type="submit"
        className="w-full rounded-xl bg-brand-600 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-brand-700 active:scale-[0.99]"
      >
        {mode === "signup" ? "Agree and continue" : "Log in"}
      </button>

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

function Field({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  autoComplete,
  trailing,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  autoComplete?: string;
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
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className="w-full bg-transparent text-[15px] outline-none placeholder:text-subtle"
        />
        {trailing}
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

/** Social sign-in buttons are UI-only in this build. */
function SocialButton({ provider }: { provider: "Google" | "Apple" }) {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-center gap-3 rounded-xl border border-ink px-6 py-3 text-sm font-medium text-ink transition hover:bg-surface"
    >
      <span
        aria-hidden="true"
        className={cn(
          "flex size-5 items-center justify-center rounded-full text-[11px] font-bold",
          provider === "Google" ? "bg-line text-ink" : "bg-ink text-white",
        )}
      >
        {provider === "Google" ? "G" : "A"}
      </span>
      Continue with {provider}
    </button>
  );
}
