const SITE_URL = "https://edubook.edubot.it.com";
const DEFAULT_IMAGE = `${SITE_URL}/bookstore_logo.svg`;

const articles = {
    "choose-english-workbook": {
        title: "Англис тили үчүн туура жумушчу китепти кантип тандоо керек | EduBook",
        description: "Деңгээлди, көнүгүү форматын жана үйдө окуу тартибин салыштырган ата-энелер үчүн практикалык жолдомо.",
        image: DEFAULT_IMAGE,
    },
    "beginner-programming-books": {
        title: "Жаңы баштагандар үчүн программалоо китептери | EduBook",
        description: "HTML, CSS, JavaScript же Python боюнча биринчи окуу китебин алардан мурун эмнеге көңүл буруу керек.",
        image: DEFAULT_IMAGE,
    },
    "exam-prep-materials": {
        title: "Кайталоого жардам берген экзамен материалдары | EduBook",
        description: "Практикалык суроолор, жооп ачкычтары жана кайталоо планы окуучуга кантип тынч даярданууга жардам берет.",
        image: DEFAULT_IMAGE,
    },
    "ielts-prep-books-bishkek": {
        title: "IELTS даярдык китептерин Бишкекте кантип тандоо керек | EduBook",
        description: "IELTSке даярданууда практика тесттери, сөз байлыгы жана writing/speaking материалдарын туура айкалыштыруу боюнча жолдомо.",
        image: DEFAULT_IMAGE,
    },
    "books-for-learning-centers": {
        title: "Окуу борбору үчүн китеп топтомдорун кантип пландоо керек | EduBook",
        description: "Курс деңгээлдери, мугалим ресурстары жана окуучулар үчүн бирдей материал тандоо боюнча практикалык чеклист.",
        image: DEFAULT_IMAGE,
    },
};

export default function handler(request, response) {
    const slug = String(request.query.slug || "");
    const article = articles[slug] || {
        title: "EduBook окуу жолдомолору",
        description: "Окуучулар, ата-энелер жана окуу борборлору үчүн китеп тандоо боюнча пайдалуу макалалар.",
        image: DEFAULT_IMAGE,
    };
    const url = `${SITE_URL}/articles/${encodeURIComponent(slug)}`;

    response.setHeader("Content-Type", "text/html; charset=utf-8");
    response.status(200).send(renderMetaPage({
        ...article,
        url,
        type: "article",
    }));
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
