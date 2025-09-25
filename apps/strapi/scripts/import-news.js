const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Конфигурация Strapi
const STRAPI_URL = 'http://localhost:1337';
const API_TOKEN = '60a334a0ae40f583372a5e96c76568a7362296d2758b82139fbe285c2339c239655e90715671dfe84e8769dcef8971747a1cb59dba72e926fe453495e785fea8b66bd4633e41453a92f2320db0eba32394cd4fb48ddf6fcb7a52f3c3a0038d48c91671fe1944a51bd343a4c2005e3e22539b367fce366f7a1f6e4b56308ea431';

async function importNews() {
    try {
        // 1. Чтение JSON файла
        const jsonData = JSON.parse(fs.readFileSync('./data/data.json', 'utf8'));

        // 2. Сначала создаем категории
        const categoryMap = new Map();

        for (const cat of [jsonData.category, ...jsonData.category.chidlren]) {
            const categoryData = {
                data: {
                    name: cat.name,
                    alias: cat.alias,
                    description: cat.description || '',
                    ordering: parseInt(cat.ordering) || 0,
                }
            };

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
            console.log(`Создана категория: ${cat.name}`);
        }

        // 3. Создаем авторов
        const authorMap = new Map();
        const uniqueAuthors = new Set();

        for (const item of jsonData.items) {
            uniqueAuthors.add(item.author.name);
        }

        for (const authorName of uniqueAuthors) {
            const authorData = {
                data: {
                    name: authorName,
                }
            };

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
            console.log(`Создан автор: ${authorName}`);
        }

        // 4. Импортируем новости
        for (const item of jsonData.items) {
            const newsData = {
                data: {
                    title: item.title,
                    alias: item.alias,
                    introtext: item.introtext,
                    fulltext: item.fulltext || '',
                    created: item.created,
                    hits: parseInt(item.hits) || 0,
                    featured: parseInt(item.featured) === 1,
                    category: categoryMap.get(item.catid),
                    author: authorMap.get(item.author.name),
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

            console.log(`Импортирована новость: ${item.title}`);
        }

        console.log('Импорт завершен успешно!');
    } catch (error) {
        console.error('Ошибка импорта:', error.response?.data || error.message);
    }
}

importNews();