import { sources } from "@/src/data/sources";
import type { ReactNode } from "react";

export function SectionHeading({ number, label, title, summary }: { number: string; label: string; title: string; summary: string }) {
  return <header className="section-heading"><div className="chapter-number">{number}<span className="chapter-rule" /></div><div><p className="eyebrow">FILE {number} / {label}</p><h2>{title}</h2><p className="section-summary">{summary}</p></div></header>;
}

export function SourceLabel({ id, children }: { id: string; children?: ReactNode }) {
  const source = sources.find(x => x.id === id);
  if (!source) return null;
  return <a className="source-label" href={source.url} target="_blank" rel="noopener noreferrer" title={source.apa}>{children || `SOURCE: ${id.toUpperCase()}`} <span aria-hidden="true">↗</span></a>;
}

export function ScientificFigure({ figure, description, children }: { figure: string; description: string; children: ReactNode }) {
  return <figure className="scientific-figure">{children}<figcaption><span>FIG. {figure}</span> {description}</figcaption></figure>;
}

export function ResearchSlot({ children }: { children: string }) {
  return <p className="research-slot">{children}</p>;
}

export function FieldStatus({ children, kind = "neutral" }: { children: ReactNode; kind?: "neutral" | "warn" | "good" }) {
  return <span className={`field-status status-${kind}`}><span className="status-dot" />{children}</span>;
}
