# Hector “Jay” Vedor Jr. — Portfolio

Static portfolio for Hector “Jay” Vedor Jr., Executive & Operations Assistant for legal and professional-services teams.

Plain HTML, CSS, and JavaScript. There is no framework, no build step, and no request to any outside service, so a CDN outage can't break the site. It deploys to GitHub Pages as-is.

## Pages

| File | What it is |
|---|---|
| `index.html` | The portfolio |
| `client-billing-tracker.html` | Working tracker. Filters accounts by status and recalculates every amount from the row data with the spreadsheet's own formula |
| `trust-replenishment-calculator.html` | Working calculator. Calculation logic is unchanged from v8 |
| `executive-operations.html` | Working daily workspace. Priorities can be ticked off |

## Structure

```
assets/css/site.css      design tokens and shared components (every page)
assets/css/home.css      homepage only
assets/css/samples.css   the three sample pages
assets/js/site.js        mobile menu and scroll reveal (pages work without it)
assets/js/tracker.js     tracker filters and recalculation
assets/js/calculator.js  calculator: original logic plus an accessibility layer
assets/js/workspace.js   workspace checkboxes
assets/fonts/            Schibsted Grotesk, self-hosted (OFL.txt)
assets/img/              portrait cut-out (WebP), sample screenshots, favicon, social image
assets/tools/            brand icons as local SVG files
Jay.jpg                  original photo, used where WebP isn't supported
```

## Live site and social sharing

The site is live at https://jayvedor0.github.io/jay-vedor-portfolio/ (GitHub Pages, deployed from the `main` branch root). The canonical URL, Open Graph URL and image, and the JSON-LD `url`/`image` in `index.html` all point there. If the address ever changes (for example, a custom domain), update those values together.

## Keeping things in sync

- **Tracker page and spreadsheet.** The tracker page mirrors the "Client Tracker" and "Follow-Ups" sheets. If the spreadsheet changes, update the matching row's `data-` attributes in `client-billing-tracker.html`, plus the open follow-ups figure. `tracker.js` recalculates amounts and totals from those attributes and logs a console warning if a displayed amount disagrees.
- **Screenshots.** `assets/img/work-*.webp` are real captures of the sample pages. Retake them if a page changes.
- **Names.** Hector Vedor Jr. is the legal and resume name. Jay Vedor is the brand name used in the site header and file names.

## Tool logos

Every tool shows its logo except LawPay, which stays a text label. The only official LawPay asset available was a 2020 raster wordmark (from AffiniPay's SDK examples) that is unreadable at icon size, and a redrawn logo would not be official. To add one later, save the official SVG from LawPay's brand kit as `assets/tools/lawpay.svg`, then in `index.html` change

    <li class="tool tool--text">LawPay</li>

to

    <li class="tool"><img src="assets/tools/lawpay.svg" alt="" width="21" height="21">LawPay</li>

Always bundle logo files locally. Never hotlink a logo from another site.

## Data

Every client name, matter, balance, and activity in the samples is fictional.

## Credits

- Typeface: Schibsted Grotesk, SIL Open Font License 1.1 (`assets/fonts/OFL.txt`)
- Icons, all bundled locally:
  - SVG Logos by Gil Barbara (CC0): Google, Slack, Zoom, ActiveCampaign, Salesforce, Zendesk, Trello, Jira, Photoshop, Illustrator
  - VSCode Icons (MIT): Outlook, Excel
  - thesvg (MIT): Canva, Google Sheets, Filmora, CapCut
  - Simple Icons (CC0): OBS Studio
  - n8n-nodes-gohighlevel (MIT): HighLevel mark, with that package's version badge removed
  - Clio: Clio's own SVG from its official repository `clio/example-third-party-application` (MIT, © Themis Solutions Inc.)
  - Quo (formerly OpenPhone): Quo's own SVG from its official repository `OpenPhone/quo-grok-plugin` (Apache-2.0)
- Product names and logos are trademarks of their owners and appear only to identify software used.

## v9.1 changes

- Canonical, Open Graph, and JSON-LD URLs enabled for the live GitHub Pages address.
- Official Clio and Quo (formerly OpenPhone) logos added from the companies' own repositories. LawPay remains a text label.
- Hero employment dates now quote the resume exactly (Nov 2024 – Aug 2026).

## v9 changes

- One design system and a self-hosted typeface replace six stacked CSS passes.
- The hero now shows who, what, and why, with an art-directed portrait.
- The featured case study follows Problem, Role, What I handled, Process, Tools, and Outcome, illustrated with real screenshots of the working samples.
- Experience is rebuilt from the resume: real titles, every role in date order, and education.
- Tools are grouped by workflow, with genuine brand icons bundled locally. There is no CDN and no placeholder fallback.
- The tracker is interactive, and its figures match the spreadsheet.
- Spreadsheet: follow-up rows for Clients 021–030, which don't exist in the 20-client tracker, were removed. Formula results are cached, so previews show numbers.
- Resume: the headline now reads "Executive & Operations Assistant | Legal Administration" and the file metadata names the author. The name and every job title are unchanged.
- Accessibility: keyboard support, visible focus, reduced motion, no-JS fallbacks, and WCAG 2.2 AA checks.
