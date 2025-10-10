// packages/ui/src/Sidebar/SidebarApi.ts
export async function getSidebarData() {
    const API_URL = process.env.STRAPI_API_URL || "http://127.0.0.1:1337";

    try {
        const response = await fetch(
            `${API_URL}/api/Sites?populate[Sidebar][populate][BurgerMenu][populate]=*`
        );

        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }

        const json = await response.json();

        console.log('📋 Полный ответ от Strapi для Sidebar:', JSON.stringify(json, null, 2));

        if (!json?.data?.length) {
            throw new Error("Нет данных сайта в ответе API");
        }

        const siteData = json.data[0];

        // Проверяем разные возможные структуры
        const sidebar = siteData.Sidebar;

        if (!sidebar) {
            console.log('❌ Sidebar не найден в ответе');
            return { burgerMenu: [] };
        }

        console.log('📁 Структура Sidebar:', sidebar);

        // Пробуем разные варианты получения BurgerMenu
        let burgerMenu = [];

        if (sidebar.BurgerMenu && Array.isArray(sidebar.BurgerMenu)) {
            burgerMenu = sidebar.BurgerMenu;
        } else if (sidebar.attributes?.BurgerMenu) {
            burgerMenu = sidebar.attributes.BurgerMenu;
        } else if (sidebar.data?.attributes?.BurgerMenu) {
            burgerMenu = sidebar.data.attributes.BurgerMenu;
        }

        console.log('🍔 BurgerMenu items:', burgerMenu);

        return {
            burgerMenu: burgerMenu || []
        };
    } catch (error) {
        console.error("Ошибка при получении данных сайдбара:", error);
        return { burgerMenu: [] };
    }
}