/** Student-authored scientific reasoning belongs here, not inside UI components. */
export const PLACEHOLDER = "[INSERT YOUR VERIFIED RESEARCH HERE: student interpretation and inline APA citation]";
export const story = {
  title: "PROJECT SAN ANDREAS",
  subtitle: "The Ground Beneath Us",
  disclaimer: "Fictional educational archive · not a government document",
  hero: "How do we know California is moving—and what can Malaysia learn from the evidence?",
  chapters: [
    { id: "origin", n: "01", title: "Origin & Interior", eyebrow: "THE PLANETARY FILE" },
    { id: "tectonics", n: "02", title: "Tectonic Setting", eyebrow: "THE MOTION FILE" },
    { id: "evidence", n: "03", title: "The Evidence Layer", eyebrow: "THE INVESTIGATION FILE" },
    { id: "deep-time", n: "04", title: "Then & Now", eyebrow: "THE TIME FILE" },
    { id: "malaysia", n: "05", title: "Why It Matters", eyebrow: "THE MALAYSIA FILE" }
  ],
  formation: [
    { title: "Nebular hypothesis", subtitle: "Material around the early Sun", text: "[INSERT YOUR VERIFIED RESEARCH HERE: solar nebula evidence]" },
    { title: "Accretion", subtitle: "Collisions grow a planet", text: "[INSERT YOUR VERIFIED RESEARCH HERE: accretion evidence]" },
    { title: "Differentiation", subtitle: "Earth separates internally", text: "[INSERT YOUR VERIFIED RESEARCH HERE: core–mantle differentiation]" }
  ],
  interior: {
    composition: [
      { id: "crust", title: "Crust", color: "#a89e84", note: "[INSERT YOUR VERIFIED RESEARCH HERE: composition and thickness]" },
      { id: "mantle", title: "Mantle", color: "#9a6d4f", note: "[INSERT YOUR VERIFIED RESEARCH HERE: mantle characteristics]" },
      { id: "outer-core", title: "Outer core", color: "#ba7954", note: "[INSERT YOUR VERIFIED RESEARCH HERE: liquid outer core]" },
      { id: "inner-core", title: "Inner core", color: "#d1ac75", note: "[INSERT YOUR VERIFIED RESEARCH HERE: solid inner core]" }
    ],
    mechanics: [
      { id: "lithosphere", title: "Lithosphere", color: "#7d8b77", note: "[INSERT YOUR VERIFIED RESEARCH HERE: mechanically strong shell]" },
      { id: "asthenosphere", title: "Asthenosphere", color: "#8f906b", note: "[INSERT YOUR VERIFIED RESEARCH HERE: ductile solid deformation]" },
      { id: "lower-mantle", title: "Lower mantle", color: "#9d694d", note: "[INSERT YOUR VERIFIED RESEARCH HERE: solid-state creep]" },
      { id: "core", title: "Core", color: "#d1ac75", note: "[INSERT YOUR VERIFIED RESEARCH HERE: core behaviour]" }
    ]
  },
  tectonics: { mechanism: "[INSERT YOUR VERIFIED RESEARCH HERE: dominant plate-driving forces and uncertainties]" },
  evidence: { synthesis: "[INSERT YOUR VERIFIED RESEARCH HERE: compare seismic, geodetic and geological observations]" },
  time: { interpretation: "[INSERT YOUR VERIFIED RESEARCH HERE: published reconstruction model, limitations and timeline]" },
  malaysia: { comparison: "[INSERT YOUR VERIFIED RESEARCH HERE: Malaysia-specific engineering interpretation and standards]", conclusion: "[INSERT YOUR VERIFIED RESEARCH HERE: your final conclusion]" }
} as const;
