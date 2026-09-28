# Cleos Help Centre

A task-based, static documentation site for Cleos clinic teams.

## Local development

```bash
npm ci
npm run dev
```

Open `http://localhost:3000/cleos-docs/`. The default `/cleos-docs` path matches the GitHub Pages project URL.

## Production build

```bash
npm run lint
npm run test:export
npm run test:e2e
```

The export appears in `out/`. The existing GitHub Actions workflow publishes this directory when approved changes reach `main`. No application server or database is required for the Help Centre.

`npm run preview` serves that export at `http://127.0.0.1:3108/cleos-docs/`. The end-to-end suite runs Chromium against this production export at desktop, tablet, and mobile widths.

For a future custom domain, first configure the domain and DNS in the repository's GitHub Pages settings. Then build with `CLEOS_DOCS_BASE_PATH=` (empty value) so routes are generated at the domain root; configure that value in the workflow when the domain is ready. Do not add a `CNAME` file or switch the base path before the domain is configured.

## Content

Categories, groups, and articles are in `lib/docs.ts`. Each article needs a unique title, a short summary, audience, steps, and a final check. The site statically generates each topic and article route. Keep instructions aligned with the live product and exclude patient data from committed content.
