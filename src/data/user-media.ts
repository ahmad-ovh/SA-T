/** Explicit user-controlled attachments. Keep values empty until the corresponding PDF is
 * supplied under public/assets/papers/. Never pretend that a placeholder is a publication. */
export const localPaperFiles: Record<string,string> = {
  // "nebular-paper": "/assets/papers/nebular-hypothesis.pdf",
  // "safod2010": "/assets/papers/scientific-drilling.pdf",
  // "scharer2019": "/assets/papers/san-andreas-review.pdf",
};

/** Optional student-owned formation visuals; set path AFTER placing licensed file in public/assets/.
 * Leave null for built-in labelled schematic (and avoid missing-image requests). */
export const formationImageFiles: readonly (string|null)[] = [
  null, // "/assets/formation-nebula.jpg"
  null, // "/assets/formation-accretion.jpg"
  null, // "/assets/formation-differentiation.jpg"
];
