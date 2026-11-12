# Page content schema (graf-interim-site)

Each page is ONE JSON file in `src/content/pages/<id>.json` (UTF-8, pretty-printed, valid JSON).
The Astro templates render these files — do not write HTML.

```json
{
  "id": "coo",
  "template": "service",          // "service" | "page" | "faq" | "legal" | "contact"
  "de": { ...LangContent },
  "en": { ...LangContent }
}
```

## LangContent

```json
{
  "slug": "/interim-chief-operating-officer-coo/",   // use EXACTLY the route from the table below
  "navTitle": "Interim COO",                           // short label (menus, breadcrumbs)
  "seoTitle": "Interim COO für produzierende Unternehmen | Graf Interim",   // <= 60 chars, keyword first
  "seoDescription": "…",                               // 140–160 chars, specific, no fluff
  "eyebrow": "Leistung · Operations",                  // 2–4 words, shown small above the H1
  "title": "Interim COO",                              // H1 main part (plain text)
  "titleAccent": "für produzierende Unternehmen",      // optional; rendered in gold serif italic after/below title
  "intro": "One or two sentence lead paragraph.",
  "highlights": ["Prozesse", "Qualitätskosten", "Cash Flow"],   // optional, 3–6 short chips
  "sections": [ Block, Block, ... ]
}
```

## Block types

Inline text in `body`, `text`, `items`, `a` may use **bold** and [links](/kontakt/) (Markdown inline only — no headings, no lists inside strings).

| type | fields | use for |
|---|---|---|
| `text` | `heading`, `body: string[]` (paragraphs) | normal copy |
| `list` | `heading`, `intro?`, `items: string[]` | bullet lists (benefits, tasks) |
| `cards` | `heading`, `intro?`, `items: [{title, text}]` | 3–6 parallel items (phases, focus areas) |
| `steps` | `heading`, `intro?`, `items: [{title, text}]` | ordered process (rendered 01/02/03) |
| `quote` | `text`, `cite?` | one strong statement from the source |
| `faq` | `heading`, `items: [{q, a}]` (`a` may be several sentences; use `\n\n` for paragraph breaks) | FAQ |
| `stats` | (no fields) | inserts the standard KPI row (30+ Jahre · 35 Mio € · Weltmarktführer · DACH) |
| `cta` | `heading`, `text` | contact call-to-action band (button + phone are added by the template) |
| `video` | `provider: "youtube"|"vimeo"`, `videoId`, `title` | privacy-friendly 2-click video embed |
| `prose` | `markdown` (full Markdown string: `##`/`###` headings, paragraphs, lists, links) | ONLY for legal pages |

## Rules

1. **Faithful content.** Use ONLY facts/claims that appear in the source Markdown in `_source/`. Do not invent numbers, clients, industries, guarantees, testimonials or services. You may tighten wording, fix typos/grammar, merge duplicate paragraphs and drop filler.
2. **Remove template junk** from the source: repeated "Vereinbaren Sie jetzt ein erstes Gespräch", mailto links, phone blocks ("SCHNELLER GEHT'S PER TELEFON"), the stats block ("+30 Jahre / 35 Mio € / Weltmarktführer / DACH" → use one `{"type":"stats"}` block instead), anchors like `#awb-oc__3490`, cookie/Borlabs text, empty headings.
3. **Structure:** 4–9 blocks per page. End every non-legal page with ONE `cta` block. Prefer `cards`/`list`/`steps` where the source has parallel items.
4. **German (`de`)**: professional, "Sie"-form, keep Danny Graf's first-person voice ("ich"). Correct German typography („…“, –).
5. **English (`en`)**: natural, idiomatic business English (not literal), first person, British/neutral spelling ok. Translate ALL blocks. Same block structure as `de`.
6. **Links:** internal links must use the routes table below (DE links in `de`, EN links in `en`). External links keep their URL.
7. Brand/legal names stay as-is: "Danny Graf, MBA", "Graf Interim®", "Lean Six Sigma Black Belt", "RoIM", "KVP" (EN: "continuous improvement (CI)").

## Routes table

| id | de | en |
|---|---|---|
| home | `/` | `/en/` |
| services | `/interim-leistungen/` | `/en/services/` |
| coo | `/interim-chief-operating-officer-coo/` | `/en/interim-coo/` |
| gf | `/interim-geschaeftsfuehrer/` | `/en/interim-managing-director/` |
| hoo | `/interim-head-of-operations/` | `/en/interim-head-of-operations/` |
| plant | `/interim-produktionsleitung/` | `/en/interim-plant-manager/` |
| consulting | `/interim-beratung/` | `/en/consulting/` |
| coaching | `/coaching/` | `/en/coaching/` |
| further | `/weitere-interim-leistungen/` | `/en/further-services/` |
| allinone | `/all-in-one-interim-management/` | `/en/all-in-one-interim-management/` |
| about | `/ueber-mich/` | `/en/about/` |
| faq | `/interim-faq/` | `/en/faq/` |
| contact | `/kontakt/` | `/en/contact/` |
| partner | `/partner-werden/` | `/en/become-a-partner/` |
| video | `/video/` | `/en/video/` |
| blog | `/blog/` | `/en/blog/` |
| imprint | `/impressum/` | `/en/legal-notice/` |
| privacy | `/datenschutzerklaerung/` | `/en/privacy-policy/` |

Source files in `_source/` (German, converted from the live WordPress site):
`interim-chief-operating-officer-coo.md`, `interim-geschaeftsfuehrer.md`, `interim-head-of-operations.md`, `interim-produktionsleitung.md`, `interim-beratung.md`, `coaching.md`, `weitere-interim-leistungen.md`, `all-in-one-interim-management.md`, `ueber-mich.md`, `interim-leistungen.md`, `partner-werden.md`, `kontakt.md`, `video.md`, `interim-faq.md`, `impressum.md`, `datenschutzerklaerung.md`.

After writing each file, validate it with:
`python -c "import json,sys; json.load(open(sys.argv[1],encoding='utf-8')); print('ok')" <file>`
