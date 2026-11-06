# Bring-your-own images and papers

Images are **not bundled from the web**. Replace the original teaching drawings in File 01 by placing your licensed photographs or figures at these exact paths:

- `public/assets/formation-nebula.jpg`
- `public/assets/formation-accretion.jpg`
- `public/assets/formation-differentiation.jpg`

After adding your images, enable their exact paths in `src/data/user-media.ts` under `formationImageFiles` (replace each `null`). The app then displays the image on the right of its matching tab; otherwise it displays the built-in **illustrative** SVG. This avoids missing-asset 404 requests. If using material from a publication, add a full APA figure citation in the visible caption and obtain reuse permission as needed. Update `components/FormationArt.tsx` accordingly.

Place your PDF paper files in `public/assets/papers/` and uncomment the corresponding `id: path` entry in `src/data/user-media.ts`. The References drawer then exposes a local PDF viewer for the entry. Keep copyrighted PDFs private unless you have permission to redistribute; linking to the publisher or campus library is safer if rights are uncertain.

No student-supplied images or PDFs are included in this archive.
