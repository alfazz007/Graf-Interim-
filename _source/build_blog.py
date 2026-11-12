"""Convert scraped WordPress posts into Astro Markdown files + local optimised images.

Usage:  python -I _source/build_blog.py   (run from project root)
"""
import json, os, re, sys, urllib.request, io, hashlib
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, '_source')
OUT_MD = os.path.join(ROOT, 'src', 'content', 'blog')
OUT_IMG = os.path.join(ROOT, 'public', 'images', 'blog')
os.makedirs(OUT_MD, exist_ok=True); os.makedirs(OUT_IMG, exist_ok=True)
UA = {'User-Agent': 'Mozilla/5.0'}

JUNK_IMG = re.compile(r'(Bildschirmfoto-2022-01-20-um-08\.44\.46|Bildschirmfoto-2023-11-19-um-18\.40\.20|grafinterim-logo|phoneicon|borlabs)', re.I)
JUNK_LINE = [
    re.compile(r'^\s*Lesen Sie hier.*BLOG', re.I),
    re.compile(r'mailto:graf@graf-interim\.de\?subject', re.I),
    re.compile(r'^\s*\[?\s*Vereinbaren Sie jetzt', re.I),
    re.compile(r'#awb-oc__'),
]

def fetch(url):
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()

def full_size(url):
    # strip WordPress size suffix  -400x136.png -> .png
    return re.sub(r'-\d{2,4}x\d{2,4}(?=\.(png|jpe?g|webp|gif)$)', '', url, flags=re.I)

cache = {}
def localise(url, name_hint, max_w):
    if url in cache: return cache[url]
    for candidate in (full_size(url), url):
        try:
            data = fetch(candidate); break
        except Exception:
            data = None
    if not data:
        print('  ! could not fetch', url); cache[url] = None; return None
    im = Image.open(io.BytesIO(data))
    im = im.convert('RGBA') if im.mode in ('P', 'LA', 'RGBA') else im.convert('RGB')
    if im.width > max_w:
        im = im.resize((max_w, int(im.height * max_w / im.width)), Image.LANCZOS)
    fn = '%s.webp' % name_hint
    im.save(os.path.join(OUT_IMG, fn), 'WEBP', quality=80, method=6)
    cache[url] = ('/images/blog/' + fn, im.width, im.height)
    return cache[url]

def clean(md, slug):
    out = []
    for line in md.split('\n'):
        if any(p.search(line) for p in JUNK_LINE):
            continue
        out.append(line)
    md = '\n'.join(out)
    # images
    n = [0]
    def img(m):
        alt, url = m.group(1), m.group(2)
        if JUNK_IMG.search(url): return ''
        n[0] += 1
        res = localise(url, '%s-%d' % (slug[:60], n[0]), 1400)
        if not res: return ''
        a = alt if alt and alt.lower() != 'none' else ''
        return '![%s](%s)' % (a, res[0])
    md = re.sub(r'!\[([^\]]*)\]\(([^)]+)\)', img, md)
    # internal links -> relative
    md = re.sub(r'\]\(\s*https?://(?:www\.)?graf-interim\.de(/[^)\s]*)\s*\)', r'](\1)', md)
    md = re.sub(r'\]\(\s*([^)]+?)\s*\)', r'](\1)', md)
    # heading lines fully wrapped in bold: "## **text**" -> "## text"
    md = re.sub(r'^(#{1,6})\s*\*\*(.+?)\*\*\s*$', r'\1 \2', md, flags=re.M)
    # h1 inside content -> h2
    md = re.sub(r'^# ', '## ', md, flags=re.M)
    md = re.sub(r'\n{3,}', '\n\n', md)
    return md.strip() + '\n'

def yq(s):
    return '"' + s.replace('\\', '\\\\').replace('"', '\\"').replace('\n', ' ').strip() + '"'

meta = json.load(open(os.path.join(SRC, 'posts_meta.json'), encoding='utf-8'))
cats = {1: 'Allgemein', 6: 'Interim', 68: 'Videobeiträge'}
for p in meta:
    slug = p['slug']
    raw = open(os.path.join(SRC, 'posts', slug + '.md'), encoding='utf-8').read()
    body = clean(raw, slug)
    cover = localise(p['og_image'], slug[:70] + '-cover', 1600) if p['og_image'] else None
    desc = (p['seo_desc'] or re.sub(r'[*\[\]#]|\(.*?\)', '', p['excerpt']).strip())[:200]
    desc = re.sub(r'\s+', ' ', desc).replace(' [&hellip;]', '…').replace('[…]', '…').strip()
    cat = next((cats[c] for c in p['categories'] if c in cats and c != 1), 'Allgemein')
    words = len(re.findall(r'\w+', body))
    fm = ['---',
          'title: ' + yq(p['title']),
          'description: ' + yq(desc),
          'date: ' + p['date'][:10],
          'updated: ' + p['modified'][:10],
          'category: ' + yq(cat),
          'readingTime: %d' % max(1, round(words / 220)),
          'cover: ' + yq(cover[0] if cover else ''),
          'coverWidth: %d' % (cover[1] if cover else 0),
          'coverHeight: %d' % (cover[2] if cover else 0),
          '---', '']
    open(os.path.join(OUT_MD, slug + '.md'), 'w', encoding='utf-8').write('\n'.join(fm) + '\n' + body)
    print('ok', slug[:60], words, 'words')
print('images:', len([c for c in cache.values() if c]))
