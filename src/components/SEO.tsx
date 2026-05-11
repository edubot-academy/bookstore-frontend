import React from "react";
import { useLocation } from "react-router-dom";
import { BUSINESS } from "../lib/business";

type SeoProps = {
    title: string;
    description: string;
    path?: string;
    image?: string;
    type?: "website" | "article" | "product";
    structuredData?: Record<string, unknown> | Record<string, unknown>[];
};

function upsertMeta(selector: string, attribute: "name" | "property", key: string, content: string) {
    let tag = document.head.querySelector<HTMLMetaElement>(selector);
    if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attribute, key);
        document.head.appendChild(tag);
    }
    tag.setAttribute("content", content);
}

function upsertCanonical(href: string) {
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
    }
    link.href = href;
}

function upsertJsonLd(id: string, data: SeoProps["structuredData"]) {
    let script = document.getElementById(id) as HTMLScriptElement | null;
    if (!data) {
        script?.remove();
        return;
    }
    if (!script) {
        script = document.createElement("script");
        script.id = id;
        script.type = "application/ld+json";
        document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
}

export default function SEO({ title, description, path, image = "/bookstore_logo.svg", type = "website", structuredData }: SeoProps) {
    const location = useLocation();

    React.useEffect(() => {
        const canonicalPath = path ?? location.pathname;
        const canonicalUrl = new URL(canonicalPath, BUSINESS.siteUrl).toString();
        const imageUrl = new URL(image, BUSINESS.siteUrl).toString();
        const fullTitle = title.includes(BUSINESS.name) ? title : `${title} | ${BUSINESS.name}`;

        document.documentElement.lang = "ky";
        document.title = fullTitle;
        upsertCanonical(canonicalUrl);

        upsertMeta('meta[name="description"]', "name", "description", description);
        upsertMeta('meta[name="robots"]', "name", "robots", "index, follow");
        upsertMeta('meta[property="og:title"]', "property", "og:title", fullTitle);
        upsertMeta('meta[property="og:description"]', "property", "og:description", description);
        upsertMeta('meta[property="og:type"]', "property", "og:type", type);
        upsertMeta('meta[property="og:url"]', "property", "og:url", canonicalUrl);
        upsertMeta('meta[property="og:image"]', "property", "og:image", imageUrl);
        upsertMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
        upsertMeta('meta[name="twitter:title"]', "name", "twitter:title", fullTitle);
        upsertMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
        upsertMeta('meta[name="twitter:image"]', "name", "twitter:image", imageUrl);
        upsertJsonLd("page-jsonld", structuredData);
    }, [description, image, location.pathname, path, structuredData, title, type]);

    return null;
}
