"use client";

import { X } from "lucide-react";
import { useFocusTrap, useScrollLock } from "@/lib/hooks";
import AuthForm from "./AuthForm";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  mode: "login" | "signup";
}

/** Dialog wrapper around `AuthForm` for in-page sign-in prompts. */
export default function AuthModal({ open, onClose, mode }: AuthModalProps) {
  useScrollLock(open);
  const panelRef = useFocusTrap<HTMLDivElement>(open);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />

      <div
        ref={panelRef}
        className="relative z-10 flex max-h-[92vh] w-full animate-sheet-up flex-col rounded-t-2xl bg-white sm:max-w-[520px] sm:animate-pop-in sm:rounded-2xl"
      >
        <header className="flex items-center justify-between border-b border-line px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex size-8 items-center justify-center rounded-full transition hover:bg-surface"
          >
            <X aria-hidden="true" className="size-4" />
          </button>
          <h2 id="auth-modal-title" className="text-base font-semibold text-ink">
            {mode === "signup" ? "Sign up" : "Log in"}
          </h2>
          <span className="size-8" aria-hidden="true" />
        </header>

        <div className="overflow-y-auto px-6 py-6">
          <p className="mb-5 text-xl font-semibold text-ink">Welcome to Wanderly</p>
          <AuthForm mode={mode} onSuccess={onClose} />
        </div>
      </div>
    </div>
  );
}
