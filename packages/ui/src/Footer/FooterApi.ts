export async function getFooterData() {
    const API_URL = process.env.STRAPI_API_URL || "http://localhost:1337";

    try {
        const [menuResponse, addressResponse, emailResponse, phoneResponse, phonePKResponse] = await Promise.all([
            fetch(`${API_URL}/api/menu-footers?populate=*`),
            fetch(`${API_URL}/api/footer-address`),
            fetch(`${API_URL}/api/footer-email`),
            fetch(`${API_URL}/api/footer-phone`),
            fetch(`${API_URL}/api/footer-phone-pk`)
        ]);

        const responses = [menuResponse, addressResponse, emailResponse, phoneResponse, phonePKResponse];
        for (const response of responses) {
            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }
        }

        const [menuData, addressData, emailData, phoneData, phonePKData] = await Promise.all([
            menuResponse.json(),
            addressResponse.json(),
            emailResponse.json(),
            phoneResponse.json(),
            phonePKResponse.json()
        ]);

        return { menuData, addressData, emailData, phoneData, phonePKData };
    } catch (error) {
        console.error("Ошибка при получении данных футера:", error);
        return null;
    }
}
