/** Student-authored scientific reasoning belongs here, not inside UI components. */
export const PLACEHOLDER = "[INSERT YOUR VERIFIED RESEARCH HERE: student interpretation and inline APA citation]";
export const story = {
  title: "PROJECT SAN ANDREAS",
  subtitle: "The Ground Beneath Us",
  disclaimer: "Fictional educational archive · not a government document",
  hero: "How does California move, and why compare Malaysia?",
  chapters: [
    { id: "origin", n: "01", title: "Origin & Interior", eyebrow: "THE PLANETARY FILE" },
    { id: "tectonics", n: "02", title: "Tectonic Setting", eyebrow: "THE MOTION FILE" },
    { id: "evidence", n: "03", title: "The Evidence Layer", eyebrow: "THE INVESTIGATION FILE" },
    { id: "deep-time", n: "04", title: "Then & Now", eyebrow: "THE TIME FILE" },
    { id: "malaysia", n: "05", title: "Why It Matters", eyebrow: "THE MALAYSIA FILE" }
  ],
  formation: [
    { title: "Nebular hypothesis", subtitle: "A rotating disk around the young Sun", text: "A cloud of gas and dust contracted under gravity and flattened into a rotating disk. This is the starting setting for the solar system, not a model of tectonic motion. (Ragul et al., 2021; NASA, n.d.)" },
    { title: "Accretion", subtitle: "Small particles gradually build rocky bodies", text: "Dust and rocky fragments repeatedly collided and combined. Gravitational growth produced planetesimals and larger planetary bodies. (Ragul et al., 2021; NASA, n.d.)" },
    { title: "Differentiation", subtitle: "Early heating separated interior materials", text: "As early Earth heated, dense iron-rich material concentrated toward the center while less-dense silicates remained outside it, developing core and mantle. (Ragul et al., 2021, §5.1)" }
  ],
  interior: {
    composition: [
      { id: "crust", title: "Crust", color: "#a89e84", note: "The thin, compositionally distinct outer rocky shell. Thickness varies between oceanic and continental regions. (USGS, This Dynamic Earth)" },
      { id: "mantle", title: "Mantle", color: "#9a6d4f", note: "Hot, mostly solid silicate rock beneath the crust; mantle rock can deform slowly over geological time. (USGS, This Dynamic Earth)" },
      { id: "outer-core", title: "Outer core", color: "#ba7954", note: "A metallic, liquid layer surrounding the solid inner core. (USGS, This Dynamic Earth)" },
      { id: "inner-core", title: "Inner core", color: "#d1ac75", note: "The dense, solid metallic center of Earth. (USGS, This Dynamic Earth)" }
    ],
    mechanics: [
      { id: "lithosphere", title: "Lithosphere", color: "#7d8b77", note: "A mechanically rigid shell made of crust and uppermost mantle; lithospheric plates move as coherent blocks. (USGS)" },
      { id: "asthenosphere", title: "Asthenosphere", color: "#8f906b", note: "The relatively weak, solid mantle zone beneath the lithosphere flows slowly over long timescales. It is not an ocean of magma. (USGS)" },
      { id: "lower-mantle", title: "Lower mantle", color: "#9d694d", note: "Mantle rock remains predominantly solid and undergoes slow deformation under high temperatures and pressures. (USGS)" },
      { id: "core", title: "Core", color: "#d1ac75", note: "A separate metallic interior: the outer core is liquid and the inner core is solid. Neither is part of a tectonic plate. (USGS)" }
    ]
  },
  tectonics: { mechanism: "STUDENT ANALYSIS PENDING" },
  evidence: { synthesis: "STUDENT ANALYSIS PENDING" },
  time: { interpretation: "STUDENT ANALYSIS PENDING" },
  malaysia: { comparison: "STUDENT ANALYSIS PENDING", conclusion: "STUDENT ANALYSIS PENDING" }
} as const;
