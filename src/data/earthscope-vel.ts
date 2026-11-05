import type { GnssRecord } from "./evidence";

/** EarthScope CWU final velocity solution in a North America-fixed NAM14 frame.
 * PBO/UNAVCO .vel format version 1.1.0 (2013 onward), described in:
 * https://www.unavco.org/data/gps-gnss/derived-products/docs/NOTICE-TO-DATA-PRODUCT-USERS-GPS-2013-03-15.pdf
 * Historical 1.0.1 format is also supported, with a separate field layout.
 * Horizontal rates and 1-sigma uncertainties in source .vel are METRES/YEAR.
 */
export const earthscopeNam14Url =
  "https://data.earthscope.org/archive/gnss/products/velocity/cwu.final_nam14.vel";

export type GnssArchive = {
  rows: GnssRecord[];
  releaseDate: string;
  allRegionalSites: number;
};

function dateFromToken(raw: string): string {
  // Modern: YYYYMMDDHHMMSS; legacy: YYYYMMDD,HHMMSS.
  const token = raw.replace(/[,T ]/g, "");
  if (!/^\d{8}(?:\d{5,6})?$/.test(token)) return "";
  const year = Number(token.slice(0,4));
  const month = Number(token.slice(4,6));
  const day = Number(token.slice(6,8));
  const date = new Date(Date.UTC(year, month-1, day));
  if (date.getUTCFullYear()!==year || date.getUTCMonth()!==month-1 || date.getUTCDate()!==day) return "";
  return `${token.slice(0,4)}-${token.slice(4,6)}-${token.slice(6,8)}`;
}

function normalizeLongitude(lon: number): number {
  // Some historical .vel products use 0–360° east longitude.
  return lon > 180 ? lon - 360 : lon;
}

export function parseEarthscopeVelocityField(text: string): GnssArchive {
  if (/<!doctype html|<html\b/i.test(text.slice(0, 1000)))
    throw new Error("Upstream did not return a .vel data file.");

  const lines = text.replace(/\r/g, "").split("\n");
  const releaseLine = lines.find(l => /release\s+date\s*:/i.test(l));
  const releaseToken = releaseLine?.match(/release\s+date\s*:\s*(\d{8})/i)?.[1] || "";
  const releaseDate = dateFromToken(releaseToken);
  // Filename is explicit NAM14. Reject contradictory source frame headers.
  const frameLine = lines.find(l=>/velocity\s+file.*reference\s+frame\s*:/i.test(l)) || "";
  if (/\b(IGS14|IGS08|ITRF|NAM08|NOAM_I08)\b/i.test(frameLine))
    throw new Error("Archive response declares a reference frame other than NAM14.");

  // Official release files use v1.1.0 with 30 columns. Historical v1.0.1
  // uses 27 columns; identify unambiguously by epoch format and column count.
  const version = lines.find(l=>/format\s+version\s*:/i.test(l))?.match(/format\s+version\s*:\s*([\d.]+)/i)?.[1] || "";
  const bySite = new Map<string, GnssRecord & {lastEpoch:string}>();

  for (const line of lines) {
    const fields=line.trim().split(/\s+/);
    if(fields.length < 27 || !/^[A-Za-z0-9]{4}$/.test(fields[0])) continue;
    const modern = version.startsWith("1.1") || (fields.length>=30 && /^\d{13,14}$/.test(fields[2]));
    const legacy = !modern && fields.length >=27 && /^\d{8},\d{6}$/.test(fields[2]);
    if(!modern && !legacy) continue;
    if(modern && fields.length<30) continue;
    const i = modern
      ? {lat:7,lon:8,n:19,e:20,sn:22,se:23,first:28,last:29}
      : {lat:4,lon:5,n:16,e:17,sn:19,se:20,first:25,last:26};
    const [site] = fields;
    const lat = Number(fields[i.lat]);
    const lon = normalizeLongitude(Number(fields[i.lon]));
    const vn = Number(fields[i.n])*1000;
    const ve = Number(fields[i.e])*1000;
    const northSigmaMmYr = Number(fields[i.sn])*1000;
    const eastSigmaMmYr = Number(fields[i.se])*1000;
    const first = dateFromToken(fields[i.first]);
    const last = dateFromToken(fields[i.last]);
    if(!dateFromToken(fields[2]) || !first || !last || first>last) continue;
    if(![lat,lon,vn,ve,northSigmaMmYr,eastSigmaMmYr].every(Number.isFinite)) continue;
    if(lat<32||lat>41||lon< -125||lon> -115) continue;
    // The EarthScope GNSS velocity viewer screens horizontal sigmas > 2 mm/yr.
    if(northSigmaMmYr<0||eastSigmaMmYr<0||northSigmaMmYr>2||eastSigmaMmYr>2) continue;
    if(Math.hypot(ve,vn)>150) continue; // guard against unexpected upstream units/format
    const next: GnssRecord & {lastEpoch:string}={
      site,lat,lon,
      ve:Number(ve.toFixed(3)),vn:Number(vn.toFixed(3)),
      northSigmaMmYr:Number(northSigmaMmYr.toFixed(3)),
      eastSigmaMmYr:Number(eastSigmaMmYr.toFixed(3)),
      referenceFrame:"NAM14",epoch:`${first} to ${last}`,
      sourceUrl:earthscopeNam14Url,estimated:false,lastEpoch:last,
    };
    const previous=bySite.get(site);
    if(!previous||last>previous.lastEpoch)bySite.set(site,next);
  }
  if(!releaseDate||bySite.size===0)
    throw new Error("No valid NAM14 station velocities in expected .vel layout or no release date.");
  const all=[...bySite.values()].sort((a,b)=>a.site.localeCompare(b.site));
  // Keep UI SVG responsive for large EarthScope releases; raw source is linked.
  const stride=Math.max(1,Math.ceil(all.length/240));
  return {
    rows:all.filter((_,i)=>i%stride===0).map(({lastEpoch,...record})=>record),
    releaseDate,allRegionalSites:all.length,
  };
}
