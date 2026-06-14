export interface PageMeta {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const SITE_URL = 'https://mydigitalarchitect.com';
const DEFAULT_IMAGE = `${SITE_URL}/public/assets/og-image.jpg`;

function upsertMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;

  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }

  el.content = content;
}

function upsertLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;

  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    document.head.appendChild(el);
  }

  el.href = href;
}

function upsertJsonLd(id: string, data: Record<string, unknown> | Record<string, unknown>[]) {
  let el = document.getElementById(id) as HTMLScriptElement | null;

  if (!el) {
    el = document.createElement('script');
    el.id = id;
    el.type = 'application/ld+json';
    document.head.appendChild(el);
  }

  el.textContent = JSON.stringify(data);
}

export function updatePageMeta(meta: PageMeta) {
  const url = `${SITE_URL}${meta.path === '/' ? '' : meta.path}`;
  const image = meta.image || DEFAULT_IMAGE;

  document.title = meta.title;

  upsertMeta('name', 'description', meta.description);
  upsertMeta('name', 'robots', 'index, follow');

  upsertMeta('property', 'og:type', meta.type || 'website');
  upsertMeta('property', 'og:url', url);
  upsertMeta('property', 'og:title', meta.title);
  upsertMeta('property', 'og:description', meta.description);
  upsertMeta('property', 'og:image', image);

  upsertMeta('property', 'twitter:card', 'summary_large_image');
  upsertMeta('property', 'twitter:url', url);
  upsertMeta('property', 'twitter:title', meta.title);
  upsertMeta('property', 'twitter:description', meta.description);
  upsertMeta('property', 'twitter:image', image);

  upsertLink('canonical', url);

  if (meta.jsonLd) {
    upsertJsonLd('page-json-ld', meta.jsonLd);
  }
}

export { SITE_URL, DEFAULT_IMAGE };
