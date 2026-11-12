# Graf Interim — Website

Static, bilingual (DE/EN) website for **Graf Interim – Danny Graf, MBA**, built with [Astro](https://astro.build) and deployed on [Vercel](https://vercel.com).

- German pages keep the **exact URLs of the old WordPress site** (`/interim-chief-operating-officer-coo/`, `/kontakt/`, all 40 blog posts …) so existing Google rankings are preserved.
- English pages live under `/en/…`.
- Only the contact form runs server-side (`/api/contact/`, a Vercel function). Everything else is pre-rendered HTML.
- No cookies, no tracking, fonts and videos are self-hosted, so no cookie banner is needed.

## Quick start

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # production build -> .vercel/output
```

Node.js 20 or newer (Vercel uses Node 24).

## Deploy to Vercel

1. Push this folder to a new GitHub repository:
   ```bash
   git add .
   git commit -m "Initial website"
   git branch -M main
   git remote add origin https://github.com/<your-account>/graf-interim-site.git
   git push -u origin main
   ```
2. In Vercel, select **Add New → Project**, import the repository, keep the detected framework **Astro**, then select **Deploy**.
3. **Contact form:** go to **Project → Settings → Environment Variables** and add the variables from `.env.example`:
   | Variable | Value |
   |---|---|
   | `RESEND_API_KEY` | API key from [resend.com](https://resend.com) (free tier is enough) |
   | `CONTACT_FROM_EMAIL` | e.g. `Graf Interim Website <website@graf-interim.de>` (domain must be verified in Resend) |
   | `CONTACT_TO_EMAIL` | `graf@graf-interim.de` |

   Redeploy after adding them. Without these variables the form shows a friendly error that tells visitors to email or call instead.
4. **Domain:** go to **Project → Settings → Domains** and add `graf-interim.de` and `www.graf-interim.de` (redirect www → apex), then update the DNS records at the domain registrar as Vercel instructs.

## Project structure

```
src/
  content/pages/*.json   page content, DE + EN (see _source/CONTENT_SCHEMA.md)
  content/blog/*.md      40 blog posts (German), frontmatter = title, date, cover …
  components/            Home, PageHero, Blocks (content renderer), ContactForm, BlogCard …
  layouts/Base.astro     <head>/SEO/hreflang/JSON-LD, header, menu, footer
  lib/i18n.ts            routes (DE/EN URLs), navigation, UI strings, contact data
  pages/                 index (DE), en/index (EN), [...slug] (all sub-pages + posts), blog, api/contact
  scripts/               main.ts (smooth scroll, reveals, cursor, pinned scenes), viz.ts (canvas visuals)
  styles/                global.css (design system), pages.css (sub-pages)
public/
  images/ videos/        optimised WebP images, self-hosted MP4 videos + posters
vercel.json              security headers (CSP, HSTS …), caching, redirects for old WordPress URLs
```

### Editing content

- **Page text:** edit `src/content/pages/<id>.json`. Each file has a `de` and an `en` block with the same structure. Block types are documented in `_source/CONTENT_SCHEMA.md`.
- **New blog post:** add `src/content/blog/<url-slug>.md` with the same frontmatter as the existing posts, and put the cover image in `public/images/blog/`.
- **Phone, email, address, LinkedIn:** edit `src/lib/i18n.ts` → `contact`.
- **Home page:** `src/components/Home.astro` (DE and EN text side by side).

## Before go-live: content to check with the client

- **Privacy policy (`datenschutzerklaerung.json`)** was copied word for word from the old site. It still describes Borlabs Cookie, Google Analytics/Ads/Tag Manager, reCAPTCHA, WordPress Stats and the old hosting, none of which this site uses. It does **not** yet cover Vercel (hosting), Resend (contact-form email) or the self-hosted videos. **It must be updated by the client's legal adviser.**
- **Impressum** cites § 5 TMG. Since May 2024 the correct reference is § 5 DDG. Please confirm with the client.
- **Inconsistent figures in the old copy:** experience is given as "25+", "almost 30" and "30+" years, savings as €35M (homepage) and about €40M (All-in-One page), and typical duration as 6–18 or 8–12 months. Unverifiable guarantee claims ("Erfolg garantiert") were removed.
- **Coaching page:** the old page used "du". This site uses "Sie" for consistency.
- `/interim-manager-seminar/` was linked in the old menu but returned 404, so it now redirects to `/interim-leistungen/`.
- There are no testimonials yet. Real client quotes would add a lot of trust.

## Re-importing blog posts (optional)

`_source/build_blog.py` converts the WordPress export in `_source/` into `src/content/blog/*.md` and downloads and optimises all images (`pip install pillow`, then `python _source/build_blog.py`). The raw export files are git-ignored.
