# Cleos Help Centre

A task-based, static documentation site for Cleos clinic teams.

## Local development

```bash
npm ci
npm run dev
```

Open `http://localhost:3000/`. The site is served from the root to match the `help.cleos.health` custom domain.

## Production build

```bash
npm run lint
npm run test:export
npm run test:e2e
```

The export appears in `out/`. The existing GitHub Actions workflow publishes this directory when approved changes reach `main`. No application server or database is required for the Help Centre.

`npm run preview` serves that export at `http://127.0.0.1:3108/`. The end-to-end suite runs Chromium against this production export at desktop, tablet, and mobile widths.

The site is served from the custom domain `help.cleos.health`, so routes and assets are generated at the domain root. The `public/CNAME` file preserves the domain across deploys. To build for a GitHub Pages project subpath instead (e.g. for a staging fork), set `CLEOS_DOCS_BASE_PATH=/your-subpath` when building and previewing.

## Content

Categories, groups, and articles are in `lib/docs.ts`. Each article needs a unique title, a short summary, audience, steps, and a final check. The site statically generates each topic and article route. Keep instructions aligned with the live product and exclude patient data from committed content.
