class StrapiClient {
    constructor() {
        this.baseURL = process.env.NEXT_PUBLIC_STRAPI_URL;
        this.token = process.env.NEXT_PUBLIC_STRAPI_TOKEN;
        console.log('🔧 StrapiClient инициализирован с URL:', this.baseURL);
        console.log(111111111111111111111111111);
        console.log(111111111111111111111111111);
        console.log(111111111111111111111111111);
        console.log(111111111111111111111111111);
        console.log(111111111111111111111111111);
        console.log(111111111111111111111111111);
        console.log(111111111111111111111111111);
        console.log(process.env.NEXT_PUBLIC_STRAPI_TOKEN);
        console.log(process.env.NEXT_PUBLIC_STRAPI_URL);
    }



    async fetchAPI(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        console.log('🌐 Запрос к Strapi:', url);

        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers,
                next: { revalidate: 60 }
            });

            console.log('📡 Статус ответа:', response.status, response.statusText);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Ошибка HTTP:', response.status, errorText);

                if (response.status === 400) {
                    throw new Error(`Bad Request (400): Неправильный синтаксис запроса. Ответ: ${errorText}`);
                }
                throw new Error(`HTTP error ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            console.log('✅ Успешный ответ от Strapi, данных:', data.data?.length || 0);
            return data;
        } catch (error) {
            console.error('❌ Ошибка запроса к Strapi:', error.message);
            throw error;
        }
    }

    // ПРОСТОЙ запрос для тестирования - БЕЗ сложного populate
    async getNewsItemsSimple() {
        const query = new URLSearchParams({
            'populate': '*', // Простой populate
            'sort': 'created:desc',
            'pagination[pageSize]': '100'
        }).toString();

        return this.fetchAPI(`/api/news-items?${query}`);
    }

    // Постепенно усложняем populate
    async getNewsItemsWithCategory() {
        const query = new URLSearchParams({
            'populate[0]': 'category',
            'populate[1]': 'image',
            'sort': 'created:desc',
            'pagination[pageSize]': '100'
        }).toString();

        return this.fetchAPI(`/api/news-items?${query}`);
    }

    // Полный populate (правильный синтаксис для Strapi v4)
    async getNewsItemsFull() {
        const query = new URLSearchParams({
            'populate[0]': 'category',
            'populate[1]': 'author',
            'populate[2]': 'tags',
            'populate[3]': 'image',
            'populate[4]': 'gallery',
            'sort': 'created:desc',
            'pagination[pageSize]': '100'
        }).toString();

        return this.fetchAPI(`/api/news-items?${query}`);
    }

    // Получить категории
    async getCategories() {
        return this.fetchAPI('/api/categories?populate=*');
    }

    // Тестируем разные варианты populate
    async testPopulate() {
        console.log('🧪 Тестирование разных вариантов populate...');

        try {
            // 1. Простой populate
            console.log('1. Тестируем простой populate...');
            const simple = await this.getNewsItemsSimple();
            console.log('✅ Простой populate работает:', simple.data?.length || 0, 'новостей');

            // 2. С категориями
            console.log('2. Тестируем populate с категориями...');
            const withCategory = await this.getNewsItemsWithCategory();
            console.log('✅ Populate с категориями работает:', withCategory.data?.length || 0, 'новостей');

            // 3. Полный populate
            console.log('3. Тестируем полный populate...');
            const full = await this.getNewsItemsFull();
            console.log('✅ Полный populate работает:', full.data?.length || 0, 'новостей');

            return full;
        } catch (error) {
            console.error('❌ Ошибка при тестировании populate:', error.message);
            throw error;
        }
    }

    // Метод для получения новости по slug
    async getNewsBySlug(slug) {
        try {
            const response = await fetch(`${this.baseURL}/api/news-items?filters[alias][$eq]=${slug}&populate=*`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching news by slug:', error);
            throw error;
        }
    }

}

export const strapiClient = new StrapiClient();