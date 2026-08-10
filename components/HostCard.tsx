import { Award, MessageSquare } from "lucide-react";
import Image from "next/image";
import type { Host } from "@/types/listing";
import { pluralize } from "@/lib/utils";

/** Host profile block shown on every detail page. */
export default function HostCard({ host, role = "Host" }: { host: Host; role?: string }) {
  return (
    <section aria-labelledby="host-heading" className="border-t border-line py-8">
      <h2 id="host-heading" className="mb-5 text-xl font-semibold text-ink">
        Meet your {role.toLowerCase()}
      </h2>

      <div className="flex flex-wrap items-start gap-5">
        <div className="relative size-16 shrink-0 overflow-hidden rounded-full bg-surface">
          <Image src={host.avatar} alt="" fill sizes="64px" className="object-cover" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-lg font-semibold text-ink">{host.name}</p>
          {host.isSuperhost && (
            <p className="mt-0.5 inline-flex items-center gap-1.5 text-sm text-muted">
              <Award aria-hidden="true" className="size-4 text-brand-600" />
              Superhost
            </p>
          )}
          <p className="mt-3 max-w-prose text-[15px] leading-relaxed text-muted">
            {host.about}
          </p>

          <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm">
            <div>
              <dt className="text-muted">Hosting for</dt>
              <dd className="font-medium text-ink">{pluralize(host.yearsHosting, "year")}</dd>
            </div>
            <div>
              <dt className="text-muted">Response rate</dt>
              <dd className="font-medium text-ink">{host.responseRate}%</dd>
            </div>
            <div>
              <dt className="text-muted">Responds</dt>
              <dd className="font-medium text-ink">Within an hour</dd>
            </div>
          </dl>

          <button
            type="button"
            className="mt-5 inline-flex items-center gap-2 rounded-xl border border-ink px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-surface"
          >
            <MessageSquare aria-hidden="true" className="size-4" />
            Message {host.name}
          </button>
        </div>
      </div>
    </section>
  );
}
