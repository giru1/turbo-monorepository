export async function getFooterData() {
    const API_URL = process.env.STRAPI_API_URL || "http://127.0.0.1:1337";

    try {
        const response = await fetch(`${API_URL}/api/Sites?populate=*`);
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        const json = await response.json();

        // Проверяем, что пришли данные
        if (!json?.data?.length) {
            throw new Error("Нет данных футера в ответе API");
        }

        const footer = json.data[0].Footer;

        return {
            address: footer.FooterAddress,
            phone: footer.FooterPhone,
            phonePK: footer.FooterPhonePK,
            email: footer.FooterEmail,
        };
    } catch (error) {
        console.error("Ошибка при получении данных футера:", error);
        return null;
    }
}
