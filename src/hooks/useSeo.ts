import { useEffect } from "react";

interface SeoOptions {
  title: string;
  description?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogUrl?: string;
  noindex?: boolean;
}

function setMeta(selector: string, attr: string, name: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function useSeo(opts: SeoOptions) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = opts.title;

    if (opts.description) {
      setMeta('meta[name="description"]', "name", "description", opts.description);
    }
    if (opts.canonical) {
      setLink("canonical", opts.canonical);
    }

    setMeta('meta[property="og:title"]', "property", "og:title", opts.ogTitle ?? opts.title);
    if (opts.ogDescription ?? opts.description) {
      setMeta(
        'meta[property="og:description"]',
        "property",
        "og:description",
        (opts.ogDescription ?? opts.description) as string,
      );
    }
    if (opts.ogUrl ?? opts.canonical) {
      setMeta('meta[property="og:url"]', "property", "og:url", (opts.ogUrl ?? opts.canonical) as string);
    }

    if (opts.noindex) {
      setMeta('meta[name="robots"]', "name", "robots", "noindex, nofollow");
    }

    return () => {
      document.title = prevTitle;
      if (opts.noindex) {
        const el = document.head.querySelector('meta[name="robots"]');
        el?.remove();
      }
    };
  }, [opts.title, opts.description, opts.canonical, opts.ogTitle, opts.ogDescription, opts.ogUrl, opts.noindex]);
}
