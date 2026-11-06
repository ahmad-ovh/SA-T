# V5 dependency security release — 6 November 2026

## Scope

This is a dependency-only patch to the V4 QA-polished San Andreas Next.js handoff. None of the educational components, animation logic, map data, user-facing copy or assignment files was intentionally modified.

## Findings and selected fixes

| Package | V4 pinned | V5 pinned | Basis |
| --- | --- | --- | --- |
| `next` | `15.5.6` | **`15.5.29`** | Next.js maintenance-LTS security release, 3 November 2026 |
| `react` | `19.2.0` | **`19.2.9`** | React 19.2.x patched release, 14 October 2026 |
| `react-dom` | `19.2.0` | **`19.2.9`** | Match React runtime |
| `react-server-dom-webpack` | not directly declared | override **`19.2.9`** | React patched RSC package |
| `react-server-dom-parcel` | not directly declared | override **`19.2.9`** | React patched RSC package |
| `react-server-dom-turbopack` | not directly declared | override **`19.2.9`** | React patched RSC package |

The three `react-server-dom-*` packages are **not used directly** by the app and should not be added as unnecessary direct dependencies. Next.js can bundle a compiled copy of React Server Components: upgrading `next` to a patched build is necessary, independently of npm `overrides`.

V5 uses Next.js 15 Maintenance LTS (rather than moving to Next 16) to minimize risk of breaking the application during its final QA period. These are **exact versions** rather than ranges; after installation, commit an authentic `package-lock.json` for reproducible deploys.

### Authoritative references

- Vercel Next.js releases (v15.5.29, released November 3): https://github.com/vercel/next.js/releases/tag/v15.5.29
- Next.js Security Advisories: https://github.com/vercel/next.js/security/advisories
- React releases (v19.2.9, October 14): https://github.com/facebook/react/releases/tag/v19.2.9
- React critical RSC advisory: https://github.com/react/react/security/advisories/GHSA-xqc2-xf4c-x3h3
- React RSC DoS advisory: https://github.com/react/react/security/advisories/GHSA-h3gv-c5rc-p453

## Install, verify, and redeploy

From the **project root** on a machine with npm registry access:

```bash
npm install
npm run check:security:strict
npm run audit:security
npm run typecheck
npm run build
npm run check:gnss
npm run check:motion
npm run check:qa
```

If this is an existing deployment, ensure you **commit the updated `package.json` and real `package-lock.json`**, remove stale install caches if they preserve old versions, and redeploy. Inspect `npm ls next react react-dom react-server-dom-webpack react-server-dom-parcel react-server-dom-turbopack` to confirm resolved versions. If the platform still flags `next@15.5.6`, verify that its deployment root is this project's root and that an old lockfile is not overriding new declarations. Avoid `npm audit fix --force` blindly: it can introduce major framework upgrades.

On CI, prefer `npm ci` after committing the updated lockfile, then run the strict policy check and `npm audit`.

## Verification status and limits

- **Confirmed:** Next.js upstream release v15.5.29 and React v19.2.9 exist and address the referenced advisories (vendor release records and React security advisories).
- **Confirmed in this environment:** `package.json` passes `npm run check:security`; all V4 source and fixture regression scripts can run without newly installed packages.
- **Not confirmed here:** npm dependency resolution, a genuine `package-lock.json`, an `npm audit` against the registry, a production build, runtime smoke tests, or security status of every indirect package.
- The environment cannot resolve `registry.npmjs.org` (`EAI_AGAIN`). No lockfile has been fabricated. `npm run check:security` without a lockfile checks **manifest intent only**; `npm run check:security:strict` will fail until a real lockfile and installed dependencies exist.
- Future vulnerabilities may emerge. Re-run npm audit and check security advisories before deployment.
