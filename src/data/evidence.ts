export const earthquakeArchive = {
  provider: "USGS ANSS ComCat",
  start: "2025-01-01",
  end: "2025-12-31",
  lat: [32, 41] as const,
  lon: [-125, -115] as const,
  minimumMagnitude: 2,
  maximumResults: 500,
  sourceUrl: "https://earthquake.usgs.gov/fdsnws/event/1/",
  note: "California-region catalog search, not events confirmed on the San Andreas fault."
};
export type Quake = { id: string; lat: number; lon: number; depth: number; magnitude: number; time: string; place: string };
export type GnssRecord = { site: string; lat: number; lon: number; ve: number; vn: number; referenceFrame: string; epoch: string; sourceUrl?: string; estimated?: boolean; northSigmaMmYr?: number; eastSigmaMmYr?: number };
export const gnssCsvHeader = "site,lat,lon,ve_mm_yr,vn_mm_yr,reference_frame,epoch";
export function parseGnssCsv(text: string): GnssRecord[] {
  const lines = text.replace(/\r/g, "").trim().split("\n");
  if (lines[0]?.trim() !== gnssCsvHeader) throw new Error("CSV header mismatch; use the provided 7-column template.");
  const rows = lines.slice(1).filter(Boolean).map(line => {
    const fields = line.split(",").map(item => item.trim());
    if (fields.length !== 7) throw new Error("Each row needs exactly seven columns.");
    const [site, lat, lon, ve, vn, referenceFrame, epoch] = fields;
    const values = [lat, lon, ve, vn].map(Number);
    if (!site || !referenceFrame || !epoch || values.some(v => !Number.isFinite(v)) || values[0] < -90 || values[0] > 90 || values[1] < -180 || values[1] > 180) throw new Error(`Invalid GNSS row: ${site || "unknown"}`);
    return { site, lat: values[0], lon: values[1], ve: values[2], vn: values[3], referenceFrame, epoch };
  });
  if (!rows.length) throw new Error("No station rows were provided.");
  if (new Set(rows.map(r => r.site)).size !== rows.length) throw new Error("Duplicate GNSS station IDs; choose one measurement epoch per station.");
  if (rows.length > 500) throw new Error("Maximum 500 stations per file.");
  if (new Set(rows.map(r => r.referenceFrame)).size > 1) throw new Error("Do not mix GNSS reference frames.");
  return rows;
}
