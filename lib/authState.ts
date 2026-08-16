/**
 * Shape of the auth forms' action state.
 *
 * Lives outside the `"use server"` module because those may only export async
 * functions — a plain object exported from one arrives `undefined` on the
 * client.
 */
export interface AuthFormState {
  status: "idle" | "error" | "check-email";
  message: string;
  errors: Partial<Record<"firstName" | "lastName" | "email" | "password", string>>;
}

export const initialAuthState: AuthFormState = {
  status: "idle",
  message: "",
  errors: {},
};

/** The signed-in traveller, as the UI needs them. */
export interface CurrentUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

/** Initials for the avatar button, e.g. "AK". Falls back to the email. */
export function initialsFor(user: CurrentUser): string {
  const first = user.firstName.trim()[0] ?? "";
  const last = user.lastName.trim()[0] ?? "";
  const initials = `${first}${last}`.trim();
  return (initials || user.email[0] || "?").toUpperCase();
}
