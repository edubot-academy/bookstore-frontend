export const BUSINESS = {
    name: "EduBook",
    siteUrl: "https://edubook.edubot.it.com",
    phoneDisplay: "+996 222 089 5285",
    phoneHref: "+9962220895285",
    whatsappNumber: "9962220895285",
    address: "Akhunbaev 129B, Бишкек",
    addressLatin: "Akhunbaev 129B, Bishkek, Kyrgyzstan",
    workingHours: "Күн сайын 09:00-20:00",
    mapUrl: "https://2gis.kg/bishkek/search/Akhunbaev%20129B",
    description:
        "Бишкекте окуу китептери, англис тили материалдары, программалоо жана экзаменге даярдык китептери.",
};

export function whatsappUrl(message?: string) {
    const base = `https://wa.me/${BUSINESS.whatsappNumber}`;
    return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
