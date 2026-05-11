const SITE_URL = "https://edubook.edubot.it.com";
const DEFAULT_IMAGE = `${SITE_URL}/bookstore_logo.svg`;
const API_BASE_URL = process.env.VITE_API_BASE_URL || process.env.API_BASE_URL || "https://bookstore-backend-vv22.onrender.com/api";

export default async function handler(request, response) {
    const id = String(request.query.id || "");
    const fallback = {
        title: "EduBook окуу китеби",
        description: "EduBook каталогунда окуу китептерин, англис тили материалдарын жана экзаменге даярдык китептерин караңыз.",
        image: DEFAULT_IMAGE,
        url: `${SITE_URL}/books/${encodeURIComponent(id)}`,
        type: "product",
    };

    try {
        if (!/^\d+$/.test(id)) throw new Error("Invalid book id");
        const apiResponse = await fetch(`${API_BASE_URL}/books/${encodeURIComponent(id)}`);
        if (!apiResponse.ok) throw new Error("Book request failed");
        const book = await apiResponse.json();
        const title = `${book.title || "EduBook окуу китеби"} | EduBook`;
        const description = book.description || `${book.title || "Бул китеп"} боюнча баа, деңгээл жана кампада болушу тууралуу маалымат.`;

        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.status(200).send(renderMetaPage({
            title,
            description,
            image: book.coverUrl || DEFAULT_IMAGE,
            url: `${SITE_URL}/books/${encodeURIComponent(id)}`,
            type: "product",
        }));
    } catch {
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.status(200).send(renderMetaPage(fallback));
    }
}

function renderMetaPage({ title, description, image, url, type }) {
    return `<!doctype html>
<html lang="ky">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <link rel="canonical" href="${escapeHtml(url)}" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:type" content="${escapeHtml(type)}" />
  <meta property="og:url" content="${escapeHtml(url)}" />
  <meta property="og:image" content="${escapeHtml(image)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${escapeHtml(image)}" />
</head>
<body>
  <a href="${escapeHtml(url)}">EduBook барагына өтүү</a>
</body>
</html>`;
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;");
}
