"use client";

import { TriangleAlert } from "lucide-react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { respondToBooking } from "@/app/actions/bookings";
import { initialHostActionState } from "@/lib/bookingFlow";
import { cn } from "@/lib/utils";

/**
 * Accept / decline controls for a pending request.
 *
 * The decision is authorised in the database, not here: RLS limits the update
 * to the host's own properties and a trigger rejects illegal transitions, so
 * these buttons cannot be used to act on somebody else's booking.
 */
export default function HostActions({ bookingId }: { bookingId: string }) {
  const [state, formAction] = useActionState(respondToBooking, initialHostActionState);

  return (
    <div className="mt-3">
      <form action={formAction} className="flex flex-wrap gap-2">
        <input type="hidden" name="bookingId" value={bookingId} />
        <DecisionButton decision="approved" label="Accept" />
        <DecisionButton decision="declined" label="Decline" />
      </form>

      {state.status === "error" && (
        <p
          role="alert"
          className="mt-2 flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          <TriangleAlert aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          {state.message}
        </p>
      )}
    </div>
  );
}

function DecisionButton({
  decision,
  label,
}: {
  decision: "approved" | "declined";
  label: string;
}) {
  const { pending } = useFormStatus();
  const isAccept = decision === "approved";

  return (
    <button
      type="submit"
      name="decision"
      value={decision}
      disabled={pending}
      className={cn(
        "rounded-xl px-5 py-2.5 text-sm font-semibold transition",
        pending && "cursor-wait opacity-60",
        isAccept
          ? "bg-brand-600 text-white hover:bg-brand-700"
          : "border border-line-strong text-ink hover:border-ink",
      )}
    >
      {pending ? "Saving…" : label}
    </button>
  );
}
