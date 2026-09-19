# IKAD Engineering — Company Website

A static, dependency-free website (plain HTML/CSS/JS) built as IKAD Engineering's
primary online company profile. No build step is required — open any `.html`
file directly, or serve the folder with any static web server.

## Structure

```
index.html      Home
about.html      Company overview, vision, mission, management, capabilities
services.html   Fire protection, HVAC, plumbing, construction, equipment supply
projects.html   Completed project gallery with client filtering
clients.html    Clients, partners and equipment suppliers
contact.html    Contact details, map and enquiry form

assets/
  css/style.css       All styling (brand colors extracted from the real logo)
  js/main.js          Nav toggle, scroll reveal, project filter, contact form
  img/brand/          Logo, favicon, icons
  img/projects/       Project photography (sourced from the company profile PDF)
  data/site-content.json   Structured reference copy of all site content
```

## Editing content

This site has **no backend or CMS** — it is static HTML so it loads fast and can
be hosted anywhere for free (GitHub Pages, Netlify, Vercel, cPanel, etc.).

To update content:

1. Edit the relevant section directly in the `.html` file (services, projects,
   clients and text are written in plain, readable markup).
2. Also update `assets/data/site-content.json` so it stays the single
   reference record of what the site says — useful if this site is later
   migrated to a CMS or rebuilt with a static site generator.
3. To add a new project card, copy an existing `.project-card` block in
   `projects.html` and adjust the client filter (`data-client="..."`), image,
   and text. To add a new filter button, copy a `.filter-btn` in the same file.
4. To replace an image, drop the new file into `assets/img/...` and update the
   `src` attribute(s) that reference it (compress images before uploading —
   see the note below).

## Known limitations / next steps

- **No CMS or admin panel yet.** All edits are made directly in the HTML/JSON
  files above. A future upgrade could move this to a static site generator
  (Astro/Next.js) or a headless CMS so non-technical edits don't require
  touching code.
- **Contact form has no backend.** Submitting it opens the visitor's email
  client via a `mailto:` link pre-filled with their message. For a production
  form that lands in an inbox or CRM without opening the visitor's mail app,
  wire it to a form service (e.g. Formspree) or a small serverless function.
- **Project photography** was extracted from the company's own 2021/2026
  profile PDFs at the resolution available in that document. Higher-resolution
  originals, if available, would improve visual quality.
- **No Google Drive sync.** Content changes require manually editing files in
  this repository. Automating updates from a source document would require a
  script or CMS integration, not covered by this initial build.
