const axios = require('axios');
const fs = require('fs');

// Конфигурация Strapi
const STRAPI_URL = 'http://localhost:1337';
const API_TOKEN = '50d5040f74c057b6d5b8ae58c53b81b43feea4736f9e557403b3a5f4554aff7053c89ce5a1f0dcd8652dbd3a86461a7ab20aca9d34bd3a2eb3ceefbabc257a10033ebc159733dff681b4b8715d2157df20a79e17fda6f86e9b33b9a2e50646643bf8d95b1c0bba90890a94960f01588cc10a26ef10e2f41d5ecf45a7b8708bbf';

// Функция для проверки существования автора
async function checkAuthorExists(authorName) {
    try {
        const response = await axios.get(
            `${STRAPI_URL}/api/authors?filters[name][$eq]=${encodeURIComponent(authorName)}`,
            {
                headers: {
                    'Authorization': `Bearer ${API_TOKEN}`
                }
            }
        );
        return response.data.data.length > 0 ? response.data.data[0].id : null;
    } catch (error) {
        console.log(`❌ Ошибка проверки автора ${authorName}:`, error.message);
        return null;
    }
}

// Функция для проверки существования категории
async function checkCategoryExists(alias) {
    try {
        const response = await axios.get(
            `${STRAPI_URL}/api/categories?filters[alias][$eq]=${alias}`,
            {
                headers: {
                    'Authorization': `Bearer ${API_TOKEN}`
                }
            }
        );
        return response.data.data.length > 0 ? response.data.data[0].id : null;
    } catch (error) {
        console.log(`❌ Ошибка проверки категории ${alias}:`, error.message);
        return null;
    }
}

// Функция для извлечения ссылок на изображения из HTML галереи
function extractGalleryUrls(galleryHtml) {
    if (!galleryHtml) return [];

    // Регулярное выражение для извлечения ссылок из атрибута href
    const regex = /href="(\/media\/k2\/galleries\/[^"]+\.(jpg|jpeg|png|gif|webp))"/gi;

    const matches = [];
    let match;

    while ((match = regex.exec(galleryHtml)) !== null) {
        // Добавляем полный URL с базовым доменом
        const fullUrl = 'https://www.orgma.ru' + match[1];
        matches.push(fullUrl);
    }

    // Убираем дубликаты
    return [...new Set(matches)];
}

// Функция для загрузки изображений в Strapi и получения их ID
async function uploadGalleryImages(imageUrls) {
    const uploadedImageIds = [];

    for (const imageUrl of imageUrls) {
        try {
            console.log(`🖼️ Загрузка изображения галереи: ${imageUrl}`);

            // Скачиваем изображение
            const imageResponse = await axios.get(imageUrl, {
                responseType: 'arraybuffer',
                timeout: 30000
            });

            // Создаем FormData для загрузки
            const FormData = require('form-data');
            const form = new FormData();

            // Получаем имя файла из URL
            const fileName = imageUrl.split('/').pop() || 'gallery-image.jpg';

            form.append('files', Buffer.from(imageResponse.data), {
                filename: fileName,
                contentType: imageResponse.headers['content-type'] || 'image/jpeg'
            });

            // Загружаем в Strapi
            const uploadResponse = await axios.post(
                `${STRAPI_URL}/api/upload`,
                form,
                {
                    headers: {
                        'Authorization': `Bearer ${API_TOKEN}`,
                        ...form.getHeaders()
                    },
                    timeout: 30000
                }
            );

            if (uploadResponse.data && uploadResponse.data.length > 0) {
                uploadedImageIds.push(uploadResponse.data[0].id);
                console.log(`✅ Изображение загружено в галерею: ${uploadResponse.data[0].id}`);
            }

            // Пауза между загрузками
            await new Promise(resolve => setTimeout(resolve, 500));

        } catch (error) {
            console.log(`❌ Ошибка загрузки изображения галереи ${imageUrl}:`, error.message);
        }
    }

    return uploadedImageIds;
}

async function importNews() {
    try {
        console.log('🚀 Запуск импорта данных...\n');

        // Проверка подключения к Strapi
        try {
            await axios.get(`${STRAPI_URL}/api/categories`, {
                headers: { 'Authorization': `Bearer ${API_TOKEN}` }
            });
            console.log('✅ Подключение к Strapi успешно');
        } catch (error) {
            console.log('❌ Ошибка подключения к Strapi:', error.response?.data?.error?.message || error.message);
            return;
        }

        // Чтение данных
        console.log('📖 Чтение файла данных...');
        const jsonData = JSON.parse(fs.readFileSync('./data/data.json', 'utf8'));

        // 1. Создаем категории
        console.log('\n📁 Создание категорий...');
        const categoryMap = new Map();
        const allCategories = [jsonData.category, ...(jsonData.category.children || jsonData.category.chidlren || [])];

        for (const cat of allCategories) {
            const existingCategoryId = await checkCategoryExists(cat.alias);
            if (existingCategoryId) {
                categoryMap.set(cat.id, existingCategoryId);
                console.log(`✅ Найдена существующая категория: ${cat.name} (ID: ${existingCategoryId})`);
                continue;
            }

            const categoryData = {
                data: {
                    name: cat.name,
                    alias: cat.alias,
                    description: cat.description || '',
                    ordering: parseInt(cat.ordering) || 0,
                }
            };

            try {
                console.log(`🔄 Создание категории: ${cat.name}`);
                const response = await axios.post(
                    `${STRAPI_URL}/api/categories`,
                    categoryData,
                    {
                        headers: {
                            'Authorization': `Bearer ${API_TOKEN}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                categoryMap.set(cat.id, response.data.data.id);
                console.log(`✅ Создана: ${cat.name} (ID: ${response.data.data.id})`);
            } catch (error) {
                console.log(`❌ Ошибка создания категории ${cat.name}:`, error.response?.data?.error?.message || error.message);
            }
        }

        // 2. Теперь обновляем parent связи (если нужно)
        console.log('\n🔗 Настройка родительских связей...');
        for (const cat of allCategories) {
            if (cat.parent && cat.parent !== "0" && categoryMap.has(cat.id) && categoryMap.has(cat.parent)) {
                try {
                    const updateData = {
                        data: {
                            parent: categoryMap.get(cat.parent)
                        }
                    };

                    await axios.put(
                        `${STRAPI_URL}/api/categories/${categoryMap.get(cat.id)}`,
                        updateData,
                        {
                            headers: {
                                'Authorization': `Bearer ${API_TOKEN}`,
                                'Content-Type': 'application/json'
                            }
                        }
                    );
                    console.log(`✅ Связь: ${cat.name} → родитель ${cat.parent}`);
                } catch (error) {
                    console.log(`❌ Ошибка установки связи для ${cat.name}:`, error.response?.data?.error?.message || error.message);
                }
            }
        }

        // 3. Создаем авторов
        console.log('\n👥 Создание авторов...');
        const authorMap = new Map();
        const uniqueAuthors = new Set();

        for (const item of jsonData.items) {
            if (item.author && item.author.name) {
                uniqueAuthors.add(item.author.name);
            }
        }

        console.log(`📊 Найдено уникальных авторов: ${uniqueAuthors.size}`);

        for (const authorName of uniqueAuthors) {
            const existingAuthorId = await checkAuthorExists(authorName);
            if (existingAuthorId) {
                authorMap.set(authorName, existingAuthorId);
                console.log(`✅ Найден существующий автор: ${authorName} (ID: ${existingAuthorId})`);
                continue;
            }

            const authorData = {
                data: {
                    name: authorName,
                }
            };

            try {
                console.log(`🔄 Создание автора: ${authorName}`);
                const response = await axios.post(
                    `${STRAPI_URL}/api/authors`,
                    authorData,
                    {
                        headers: {
                            'Authorization': `Bearer ${API_TOKEN}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                authorMap.set(authorName, response.data.data.id);
                console.log(`✅ Создан автор: ${authorName} (ID: ${response.data.data.id})`);
            } catch (error) {
                console.log(`❌ Ошибка создания автора ${authorName}:`, error.response?.data?.error?.message || error.message);
            }
        }

        // 4. Импортируем новости с галереей
        console.log('\n📰 Импорт новостей с галереей...');
        let successCount = 0;
        let errorCount = 0;
        let skipCount = 0;

        // Проверка существующих новостей
        console.log('🔍 Проверка существующих новостей...');
        const existingNewsAliases = new Set();
        try {
            const existingNews = await axios.get(
                `${STRAPI_URL}/api/news-items?fields=alias&pagination[pageSize]=1000`,
                {
                    headers: {
                        'Authorization': `Bearer ${API_TOKEN}`
                    }
                }
            );
            existingNews.data.data.forEach(news => {
                if (news.alias) existingNewsAliases.add(news.alias);
            });
            console.log(`📊 Найдено существующих новостей: ${existingNewsAliases.size}`);
        } catch (error) {
            console.log('⚠️ Не удалось проверить существующие новости:', error.message);
        }

        for (const [index, item] of jsonData.items.entries()) {
            // Проверяем, существует ли новость с таким alias
            if (existingNewsAliases.has(item.alias)) {
                console.log(`⏭️ [${index + 1}/${jsonData.items.length}] Пропущена (дубликат): ${item.title}`);
                skipCount++;
                continue;
            }

            const categoryId = categoryMap.get(item.catid);
            const authorId = authorMap.get(item.author?.name);

            if (!categoryId) {
                console.log(`⚠️ [${index + 1}/${jsonData.items.length}] Пропущена: ${item.title} (категория ${item.catid} не найдена)`);
                errorCount++;
                continue;
            }

            if (!authorId) {
                console.log(`⚠️ [${index + 1}/${jsonData.items.length}] Пропущена: ${item.title} (автор ${item.author?.name} не найден)`);
                errorCount++;
                continue;
            }

            try {
                // Извлекаем ссылки на изображения галереи
                const galleryUrls = extractGalleryUrls(item.gallery);
                console.log(`🖼️ [${index + 1}] Найдено изображений в галерее: ${galleryUrls.length}`);

                // Загружаем изображения галереи в Strapi
                let galleryImageIds = [];
                if (galleryUrls.length > 0) {
                    galleryImageIds = await uploadGalleryImages(galleryUrls);
                    console.log(`✅ Загружено изображений в медиатеку: ${galleryImageIds.length}`);
                }

                const newsData = {
                    data: {
                        title: item.title,
                        alias: item.alias,
                        introtext: item.introtext || '',
                        fulltext: item.fulltext || '',
                        created: item.created,
                        imageurl: `https://www.orgma.ru${item.imageLarge}`,
                        category: categoryId,
                        author: authorId,
                        gallery: galleryImageIds // Привязываем загруженные изображения
                    }
                };

                await axios.post(
                    `${STRAPI_URL}/api/news-items`,
                    newsData,
                    {
                        headers: {
                            'Authorization': `Bearer ${API_TOKEN}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );
                console.log(`✅ [${index + 1}/${jsonData.items.length}] ${item.title} (галерея: ${galleryImageIds.length} изображений)`);
                successCount++;

                // Добавляем в множество существующих
                existingNewsAliases.add(item.alias);
            } catch (error) {
                console.log(`❌ [${index + 1}/${jsonData.items.length}] Ошибка: ${item.title} - ${error.response?.data?.error?.message || error.message}`);
                errorCount++;
            }

            // Увеличиваем задержку из-за загрузки изображений
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        console.log('\n🎉 Импорт завершен!');
        console.log(`📊 Результаты:`);
        console.log(`   ✅ Успешно создано: ${successCount}`);
        console.log(`   ⏭️ Пропущено дубликатов: ${skipCount}`);
        console.log(`   ❌ Ошибки: ${errorCount}`);
        console.log(`   📝 Всего обработано: ${jsonData.items.length}`);

        // Сводка по авторам и категориям
        console.log(`\n📋 Сводка:`);
        console.log(`   📁 Категорий: ${categoryMap.size}`);
        console.log(`   👥 Авторов: ${authorMap.size}`);

    } catch (error) {
        console.error('💥 Критическая ошибка:', error.message);
    }
}

// Запуск импорта
importNews();