export async function getFooterData() {
    const API_URL = process.env.STRAPI_API_URL || "http://localhost:1337";

    try {
        // Получаем все данные параллельно
        const [menuResponse, addressResponse, emailResponse, phoneResponse, phonePKResponse] = await Promise.all([
            fetch(`${API_URL}/api/footer-menu?populate=*`),
            fetch(`${API_URL}/api/footer-address`),
            fetch(`${API_URL}/api/footer-email`),
            fetch(`${API_URL}/api/footer-phone`),
            fetch(`${API_URL}/api/footer-phone-pk`)
        ]);

        // Проверяем все ответы
        const responses = [menuResponse, addressResponse, emailResponse, phoneResponse, phonePKResponse];
        for (const response of responses) {
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
        }

        // Парсим все данные
        const [menuData, addressData, emailData, phoneData, phonePKData] = await Promise.all([
            menuResponse.json(),
            addressResponse.json(),
            emailResponse.json(),
            phoneResponse.json(),
            phonePKResponse.json()
        ]);

        return {
            menuData,
            addressData,
            emailData,
            phoneData,
            phonePKData
        };

    } catch (error) {
        console.error('Ошибка при получении данных футера:', error);
        return null;
    }
}