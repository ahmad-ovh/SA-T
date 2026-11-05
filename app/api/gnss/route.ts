import { NextResponse } from "next/server";
import { earthscopeNam14Url, parseEarthscopeVelocityField } from "@/src/data/earthscope-vel";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const response = await fetch(earthscopeNam14Url, { cache: "no-store", signal: AbortSignal.timeout(12000), headers: { Accept: "text/plain" } });
    if (!response.ok) throw new Error(`Archive returned HTTP ${response.status}`);
    const size = Number(response.headers.get("content-length") || 0);
    if(size > 15_000_000) throw new Error("Archive file exceeded the configured size limit");
    const text = await response.text();
    if(text.length > 15_000_000) throw new Error("Archive file exceeded the configured size limit");
    const parsed = parseEarthscopeVelocityField(text);
    return NextResponse.json({ ...parsed, sourceUrl: earthscopeNam14Url, retrievedAt: new Date().toISOString(), referenceFrame: "NAM14", unit: "mm/yr", processingCenter: "CWU", solution: "final" });
  } catch (e) {
    return NextResponse.json({error: e instanceof Error ? e.message : "GNSS archive unavailable", sourceUrl: earthscopeNam14Url}, {status: 503});
  }
}
