/** Conceptual educational sketches only; NOT a verified paleogeographic model or measured positions. */
export const epochs = [
  { ma: 200, title: "EARLY JURASSIC", label: "Subduction margin", regime: "Conceptual oceanic subduction", plate: "Farallon / North America", citation: "Atwater (1970)" },
  { ma: 100, title: "LATE CRETACEOUS", label: "Convergent margin", regime: "Conceptual continental margin", plate: "Farallon / North America", citation: "Atwater (1970)" },
  { ma: 30, title: "OLIGOCENE", label: "Transition interval", regime: "Ridge–trench interaction", plate: "Pacific / Farallon / North America", citation: "Atwater (1970)" },
  { ma: 0, title: "PRESENT", label: "Transform margin", regime: "San Andreas transform system", plate: "Pacific / North America", citation: "USGS; Atwater (1970)" }
] as const;
