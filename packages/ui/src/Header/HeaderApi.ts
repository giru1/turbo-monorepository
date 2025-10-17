export async function getHeaderData() {
    const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

    try {
        const response = await fetch(
            `${API_URL}/api/Sites?populate[HeaderLeft][populate]=*`
        );

        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        const json = await response.json();

        // Проверяем, что пришли данные
        if (!json?.data?.length) {
            throw new Error("Нет данных хедера в ответе API");
        }

        const headerLeft = json.data[0].HeaderLeft;

        return {
            logoTitle: headerLeft.LogoTitle,
            logo: {
                url: headerLeft.Logo?.url,
                alternativeText: headerLeft.Logo?.alternativeText || "Логотип университета"
            },
            background: {
                url: headerLeft.MainFone?.url,
                alternativeText: headerLeft.MainFone?.alternativeText || "Оренбургский государственный медицинский университет"
            }
        };
    } catch (error) {
        console.error("Ошибка при получении данных хедера:", error);
        return null;
    }
}