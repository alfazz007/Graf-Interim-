export type Lang = 'de' | 'en';

/** Page id → URL per language. German URLs are identical to the old WordPress site (SEO). */
export const routes: Record<string, { de: string; en: string }> = {
  home: { de: '/', en: '/en/' },
  services: { de: '/interim-leistungen/', en: '/en/services/' },
  coo: { de: '/interim-chief-operating-officer-coo/', en: '/en/interim-coo/' },
  gf: { de: '/interim-geschaeftsfuehrer/', en: '/en/interim-managing-director/' },
  hoo: { de: '/interim-head-of-operations/', en: '/en/interim-head-of-operations/' },
  plant: { de: '/interim-produktionsleitung/', en: '/en/interim-plant-manager/' },
  consulting: { de: '/interim-beratung/', en: '/en/consulting/' },
  coaching: { de: '/coaching/', en: '/en/coaching/' },
  further: { de: '/weitere-interim-leistungen/', en: '/en/further-services/' },
  allinone: { de: '/all-in-one-interim-management/', en: '/en/all-in-one-interim-management/' },
  about: { de: '/ueber-mich/', en: '/en/about/' },
  faq: { de: '/interim-faq/', en: '/en/faq/' },
  contact: { de: '/kontakt/', en: '/en/contact/' },
  partner: { de: '/partner-werden/', en: '/en/become-a-partner/' },
  video: { de: '/video/', en: '/en/video/' },
  blog: { de: '/blog/', en: '/en/blog/' },
  imprint: { de: '/impressum/', en: '/en/legal-notice/' },
  privacy: { de: '/datenschutzerklaerung/', en: '/en/privacy-policy/' },
};

export const r = (id: keyof typeof routes | string, lang: Lang) => routes[id]?.[lang] ?? (lang === 'en' ? '/en/' : '/');

export const serviceNav = [
  { id: 'coo', n: '01', de: ['Interim COO', 'Operative Verantwortung, Kennzahlen, Lieferperformance'], en: ['Interim COO', 'Operations, KPIs, delivery performance'] },
  { id: 'gf', n: '02', de: ['Interim Geschäftsführer', 'Stabilität und Strategie auf C-Level'], en: ['Interim Managing Director', 'Stability and strategy at C-level'] },
  { id: 'hoo', n: '03', de: ['Head of Operations', 'Produktion, Logistik, Supply Chain'], en: ['Head of Operations', 'Production, logistics, supply chain'] },
  { id: 'plant', n: '04', de: ['Produktionsleitung', 'Werksleitung, Shopfloor, KVP'], en: ['Plant Management', 'Plant leadership, shopfloor, CI'] },
  { id: 'consulting', n: '05', de: ['Beratung', 'Analyse, Potenziale, Umsetzungsplan'], en: ['Consulting', 'Analysis, potential, roadmap'] },
  { id: 'coaching', n: '06', de: ['Coaching', 'Führungskräfte & Karriere'], en: ['Coaching', 'Leaders & careers'] },
  { id: 'further', n: '07', de: ['Weitere Leistungen', 'Projekte, Restrukturierung, Lean'], en: ['Further services', 'Projects, restructuring, lean'] },
  { id: 'allinone', n: '08', de: ['All-in-One', 'Interim-Team aus einer Hand'], en: ['All-in-One', 'Interim team from one source'] },
] as const;

export const ui = {
  de: {
    skip: 'Zum Inhalt springen',
    nav: { services: 'Leistungen', about: 'Über mich', blog: 'Insights', faq: 'FAQ', contact: 'Kontakt', allServices: 'Alle Leistungen' },
    cta: 'Erstgespräch',
    ctaLong: 'Erstgespräch vereinbaren',
    menu: 'Menü',
    close: 'Schließen',
    langLabel: 'Sprache',
    learnMore: 'Mehr erfahren',
    readMore: 'Weiterlesen',
    home: 'Startseite',
    phone: 'Telefon',
    email: 'E-Mail',
    address: 'Adresse',
    footerClaim: 'Interim Management für produzierende Unternehmen.',
    footer: { services: 'Leistungen', more: 'Mehr', contact: 'Kontakt', imprint: 'Impressum', privacy: 'Datenschutz', top: 'Nach oben ↑' },
    stats: [
      ['30+', 'Jahre Führungserfahrung'],
      ['35 Mio €', 'Einsparungen'],
      ['Welt­markt­führer', 'Einsätze bei'],
      ['DACH', 'aktiv vor Ort'],
    ],
    ctaBand: { button: 'Erstgespräch vereinbaren', call: 'Oder direkt anrufen' },
    form: {
      title: 'Ihre Anfrage',
      name: 'Name', company: 'Unternehmen', email: 'E-Mail', phone: 'Telefon',
      message: 'Ihre Situation in wenigen Sätzen',
      consent: 'Ich habe die <a href="/datenschutzerklaerung/">Datenschutzerklärung</a> gelesen und stimme der Verarbeitung meiner Daten zur Bearbeitung der Anfrage zu.',
      submit: 'Anfrage senden', sending: 'Wird gesendet …',
      ok: 'Vielen Dank! Ihre Anfrage ist eingegangen. Ich melde mich in der Regel innerhalb von 24 Stunden.',
      err: 'Das hat leider nicht geklappt. Bitte schreiben Sie direkt an graf@graf-interim.de oder rufen Sie an: +49 160 400 6600.',
      invalid: 'Bitte füllen Sie Name, eine gültige E-Mail-Adresse und Ihre Nachricht aus und bestätigen Sie den Datenschutzhinweis.',
      required: 'Pflichtfeld',
    },
    blog: {
      eyebrow: 'Insights', title: 'Gedanken aus', accent: 'der Praxis.',
      intro: 'Einblicke in meine Arbeit für Führungskräfte produzierender Unternehmen – zu Kennzahlen, Lean, Führung und Restrukturierung.',
      min: 'Min. Lesezeit', all: 'Alle Beiträge', back: '← Alle Beiträge', related: 'Weitere Beiträge', published: 'Veröffentlicht',
      seoTitle: 'Blog & Insights – Interim Management in der Praxis | Graf Interim',
      seoDescription: 'Fachbeiträge von Interim Manager Danny Graf zu Kennzahlen, Lean, Shopfloor Management, Führung und Restrukturierung in produzierenden Unternehmen.',
      enNote: '',
    },
    notFound: { title: 'Seite nicht gefunden', text: 'Die gesuchte Seite existiert nicht (mehr). Vielleicht hilft Ihnen einer dieser Links weiter.' },
    video: { play: 'Video abspielen' },
  },
  en: {
    skip: 'Skip to content',
    nav: { services: 'Services', about: 'About', blog: 'Insights', faq: 'FAQ', contact: 'Contact', allServices: 'All services' },
    cta: 'First call',
    ctaLong: 'Book a first call',
    menu: 'Menu',
    close: 'Close',
    langLabel: 'Language',
    learnMore: 'Learn more',
    readMore: 'Read more',
    home: 'Home',
    phone: 'Phone',
    email: 'Email',
    address: 'Address',
    footerClaim: 'Interim management for manufacturing companies.',
    footer: { services: 'Services', more: 'More', contact: 'Contact', imprint: 'Legal notice', privacy: 'Privacy', top: 'Back to top ↑' },
    stats: [
      ['30+', 'Years of leadership'],
      ['€35M', 'Savings delivered'],
      ['Market leaders', 'Assignments at'],
      ['DACH', 'Active on site'],
    ],
    ctaBand: { button: 'Book a first call', call: 'Or call directly' },
    form: {
      title: 'Your enquiry',
      name: 'Name', company: 'Company', email: 'Email', phone: 'Phone',
      message: 'Your situation in a few sentences',
      consent: 'I have read the <a href="/en/privacy-policy/">privacy policy</a> and agree to my data being processed to handle this enquiry.',
      submit: 'Send enquiry', sending: 'Sending …',
      ok: 'Thank you! Your enquiry has arrived. I usually reply within 24 hours.',
      err: 'Sorry, that did not work. Please email graf@graf-interim.de directly or call +49 160 400 6600.',
      invalid: 'Please enter your name, a valid email address and your message, and confirm the privacy notice.',
      required: 'Required',
    },
    blog: {
      eyebrow: 'Insights', title: 'Thinking from', accent: 'the shop floor.',
      intro: 'Articles for leaders of manufacturing companies – on KPIs, lean, leadership and restructuring.',
      min: 'min read', all: 'All articles', back: '← All articles', related: 'More articles', published: 'Published',
      seoTitle: 'Insights – Interim Management in Practice | Graf Interim',
      seoDescription: 'Articles by interim manager Danny Graf on KPIs, lean, shopfloor management, leadership and restructuring in manufacturing (in German).',
      enNote: 'The articles are written in German.',
    },
    notFound: { title: 'Page not found', text: 'The page you are looking for does not exist (anymore). One of these links may help.' },
    video: { play: 'Play video' },
  },
} as const;

export const contact = {
  name: 'Danny Graf',
  company: 'Graf Interim',
  phone: '+49 160 400 6600',
  phoneHref: 'tel:+491604006600',
  email: 'graf@graf-interim.de',
  street: 'Philipp-Reis-Weg 21',
  zip: '23556',
  city: 'Lübeck',
  linkedin: 'https://www.linkedin.com/in/danny-graf-mba-a35a221a3/',
  book: 'https://www.amazon.com/-/de/dp/B0H4W7FT56/',
};

/** Tiny, safe inline-Markdown renderer for JSON content: **bold**, *italic*, [text](url). */
export function inlineMd(s: string): string {
  const esc = s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  return esc
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, t, u) => {
      const ext = /^https?:\/\//.test(u) && !u.includes('graf-interim.de');
      return `<a href="${u}"${ext ? ' target="_blank" rel="noopener"' : ''}>${t}</a>`;
    })
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[^*])\*([^*\s][^*]*?)\*/g, '$1<em>$2</em>');
}
