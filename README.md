# pacificfrontdesk.com

The two-door landing for one founder's two shifts. `/` is an equal split:
the day door leads to `/answering-service` (Pacific Front Desk, the AI
answering service for LA home-service businesses); the night door leads out
to [nattskiftgames.com](https://nattskiftgames.com). Astro 7 + Tailwind 4,
fully static, no forms, no third-party scripts, self-hosted fonts.

## Local development

```bash
npm install
npm run dev        # http://localhost:4331
npm run build      # favicons + OG images, then static build to dist/
npm run preview
npm run linkcheck  # verifies every internal link in dist/ (build first)
npm run contrast   # WCAG AA audit of every text pairing (all 14 pass)
```

## Content

All business copy on `/answering-service` was ported verbatim from the
previous pacificfrontdesk.com — steps, features, FAQ answers, report
numbers, pricing, guarantees, and the CIPA footer disclosure. Edit it
directly in [src/pages/answering-service.astro](src/pages/answering-service.astro)
(the copy lives in plain arrays at the top of the file).

Design tokens live in the `@theme` block of
[src/styles/global.css](src/styles/global.css): the day palette (paper,
Pacific blue) plus the night palette, which reuses Nattskift's exact brand
values. The brand mark (day/night split square) is
[src/assets/brand/mark.svg](src/assets/brand/mark.svg); favicons and OG
images are generated from source at every build and gitignored.

## Deploy (Netlify)

1. app.netlify.com → Add new project → Import from GitHub →
   `olegnochka/pacificfrontdesk-site`.
2. `netlify.toml` carries the build settings; just deploy.
3. Domain cutover (the domain currently points at the old site's host):
   in Netlify add `pacificfrontdesk.com`, then at the DNS provider replace
   the existing website records with `A @ 75.2.60.5` and
   `CNAME www nattskift.netlify.app`-style record pointing at THIS site's
   `*.netlify.app` name. **This replaces the live site** — flip DNS only
   when this one is approved.
