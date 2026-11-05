import { NextResponse } from "next/server";
import { earthquakeArchive } from "@/src/data/evidence";

export const revalidate = 86400;
export async function GET() {
  const parameters = new URLSearchParams({
    format: "geojson", starttime: earthquakeArchive.start, endtime: earthquakeArchive.end,
    minlatitude: String(earthquakeArchive.lat[0]), maxlatitude: String(earthquakeArchive.lat[1]),
    minlongitude: String(earthquakeArchive.lon[0]), maxlongitude: String(earthquakeArchive.lon[1]),
    minmagnitude: String(earthquakeArchive.minimumMagnitude), orderby: "time", limit: String(earthquakeArchive.maximumResults)
  });
  const requestUrl = `https://earthquake.usgs.gov/fdsnws/event/1/query?${parameters}`;
  try {
    const response = await fetch(requestUrl, { next: { revalidate }, signal: AbortSignal.timeout(12000) });
    if (!response.ok) throw new Error(`Upstream status ${response.status}`);
    const payload: unknown = await response.json();
    if (!payload || typeof payload !== "object" || !("features" in payload) || !Array.isArray(payload.features)) throw new Error("Invalid catalog response");
    return NextResponse.json({ data: payload, retrievedAt: new Date().toISOString(), requestUrl });
  } catch {
    return NextResponse.json({ error: "USGS catalog unavailable; no fabricated fallback is supplied.", requestUrl }, { status: 503 });
  }
}
