import { NextResponse } from "next/server";
import { countResults } from "@/lib/queries";
import { filtersFromParams, isSearchTab } from "@/lib/search";

/**
 * Result count for a filter set, so the filter sheet can show a live
 * "Show N places" without shipping the whole catalogue to the browser.
 */
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const tabParam = params.get("tab");
  const tab = isSearchTab(tabParam) ? tabParam : "homes";
  const serviceType = params.get("service") ?? undefined;

  try {
    const count = await countResults(tab, filtersFromParams(params), serviceType);
    return NextResponse.json({ count });
  } catch (error) {
    console.error("search count failed", error);
    return NextResponse.json({ error: "Count unavailable" }, { status: 500 });
  }
}
