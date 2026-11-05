import type { GnssRecord } from "./evidence";

/**
 * Actual published, rounded classroom estimates, not synthetic site velocities.
 * Source: Fox-Lent et al., Exploring plate motion in California with GPS,
 * EarthScope/UNAVCO teacher version, 14 May 2022, pp. 5–6.
 * https://cdn.serc.carleton.edu/files/NAGTWorkshops/geodesy/activities/california-teacher-guide.v2.pdf
 * The coordinates and rates are approximate as published, NOT modern final-network precision.
 * The 2022 date is the teaching GUIDE DATE, not the GNSS processing reference epoch.
 */
export const earthscopeTeachingMetadata = {
  label: "EarthScope / UNAVCO teaching example",
  frame: "NAM14",
  published: "2022-05-14",
  sampleType: "rounded teaching-guide trends",
  sourceUrl: "https://cdn.serc.carleton.edu/files/NAGTWorkshops/geodesy/activities/california-teacher-guide.v2.pdf",
  licenseNote: "Cite original EarthScope/UNAVCO teaching material; approximate values only.",
} as const;

export const earthscopeTeachingRows: GnssRecord[] = [
  { site: "SBCC", lat: 33.553, lon: -117.661, ve: -26.1, vn: 27.3, referenceFrame: "NAM14", epoch: "not reported; 2022-05-14 guide date", sourceUrl: earthscopeTeachingMetadata.sourceUrl, estimated: true },
  { site: "BEMT", lat: 34.001, lon: -115.998, ve: -4.0, vn: 4.6, referenceFrame: "NAM14", epoch: "not reported; 2022-05-14 guide date", sourceUrl: earthscopeTeachingMetadata.sourceUrl, estimated: true },
];
