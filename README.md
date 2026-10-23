# Pratheek Eranki - Portfolio

React and Vite portfolio for AI/ML and software engineering work, published at https://pratheekeranki.github.io/portfolio/.

## Development

Use Node.js 24 (Node >=22.12 is supported).

```sh
npm ci
npm run dev
```

Vite serves the application under `/portfolio/`, matching GitHub Pages. Open the full URL printed by the development server, including that base path.

## Verification

```sh
npm run check
npx playwright install chromium
npm test
npm run preview
```

The content checks validate project destinations, downloaded artifacts, skill references, evaluation consistency, and confirmed dates. `npm test` builds first, then tests the production bundle under `/portfolio/`. Browser checks cover mobile overflow, project filtering, case-study focus and dismissal, direct links, Back navigation, reduced motion, asset loading, and automated accessibility scans. They are useful checks, not a complete manual accessibility audit.

GitHub Actions uses the lockfile with `npm ci`, runs the checks and production build, and deploys `dist/` on pushes to `main`. Pull requests run verification without deployment.

## Updating content

- `src/portfolio.json`: profile, experience, projects, result tables, skills, education, and certifications.
- `src/App.jsx`: semantic sections, filtering, navigation, and native project dialogs.
- `src/styles.css`: shared design system and responsive layouts.
- `public/images/`: existing project screenshots, the explanatory research diagram, and social preview.
- `public/evidence/`: compact saved result summaries used in case studies.
- `CONTENT_SOURCES.md`: provenance, confirmed edits, and interpretation limits.
- `DESIGN.md`: visual and accessibility decisions.

Every project must have a real evidence destination. Use only public repository URLs, paper URLs, or local artifact paths. Local assets are resolved against Vite's base path. Do not add placeholder demos or unverified achievement metrics.

Project case studies have shareable fragment links, such as `/portfolio/#project/academic-rag`. This works on GitHub Pages without a route fallback. The native dialog supports Escape, keyboard focus containment, focus restoration, and browser Back.

## Resume and social preview

The committed PDF is typeset in LaTeX and uses the same owner-approved experience text as the website. Its section order is Summary, Education, Skills, Experience, Projects, Publications, Certifications. The editable project is `resume/main.tex`, and the public source download is `public/Pratheek-Eranki-Resume.tex`.

Install the official [Tectonic compiler](https://tectonic-typesetting.github.io/en-US/install.html), then regenerate after reviewing content:

```sh
python scripts/generate-resume.py --compiler tectonic
npm run generate:social
```

The generator uses Python's standard library and invokes Tectonic. It writes the editable source and both public downloads. Review the rendered PDF after changes. Social preview generation needs the Playwright Chromium browser. Committed assets let ordinary builds run without a LaTeX installation.

When changing the deployment URL, update `vite.config.js`, canonical/Open Graph/Twitter URLs in `index.html`, `public/sitemap.xml`, and `public/robots.txt` together.

Credential names link to the owner's LinkedIn certification section. Individual badge verification URLs can be added when their actual issuer-issued addresses are available; issuer homepages are not presented as verification.
