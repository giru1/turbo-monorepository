export async function getSidebarData() {
    const API_URL = process.env.STRAPI_API_URL || "http://127.0.0.1:1337";

    try {
        const response = await fetch(
            `${API_URL}/api/Sites?populate[Menu][populate]=*`
        );

        if (!response.ok) {
            throw new Error(`Ошибка HTTP Sidebar: ${response.status}`);
        }

        const json = await response.json();

        console.log('📋 Полный ответ от Strapi для Sidebar:', JSON.stringify(json, null, 2));

        if (!json?.data?.length) {
            throw new Error("Нет данных сайта в ответе API");
        }

        const siteData = json.data[0];

        // Получаем меню из ответа - правильный путь
        const menuItems = siteData.Menu || [];

        console.log('🍔 Menu items с подменю:', menuItems);

        // Возвращаем данные в правильном формате
        return {
            burgerMenu: menuItems
        };
    } catch (error) {
        console.error("Ошибка при получении данных сайдбара:", error);
        return { burgerMenu: [] };
    }
}