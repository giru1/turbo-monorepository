const { Strapi } = require('@strapi/strapi');

async function generateSchema() {
    try {
        console.log('🎯 Генерация структуры Strapi...');

        // Создаем контент-типы программно
        const componentSchemas = {
            // Компонент для изображений
            'shared.image': {
                category: 'shared',
                kind: 'component',
                collectionName: 'components_shared_images',
                info: {
                    displayName: 'Image',
                    icon: 'picture',
                },
                attributes: {
                    url: { type: 'string' },
                    caption: { type: 'string' },
                    width: { type: 'integer' },
                    height: { type: 'integer' },
                },
            },
        };

        const contentTypes = {
            // Категория
            'api::category.category': {
                kind: 'collectionType',
                collectionName: 'categories',
                info: {
                    singularName: 'category',
                    pluralName: 'categories',
                    displayName: 'Category',
                    description: 'Категории новостей',
                },
                options: { draftAndPublish: false },
                attributes: {
                    name: { type: 'string', required: true },
                    alias: { type: 'string', unique: true },
                    description: { type: 'text' },
                    image: { type: 'media', allowedTypes: ['images'], multiple: false },
                    ordering: { type: 'integer', default: 0 },
                    parent: {
                        type: 'relation',
                        relation: 'oneToOne',
                        target: 'api::category.category',
                    },
                },
            },

            // Автор
            'api::author.author': {
                kind: 'collectionType',
                collectionName: 'authors',
                info: {
                    singularName: 'author',
                    pluralName: 'authors',
                    displayName: 'Author',
                    description: 'Авторы новостей',
                },
                options: { draftAndPublish: false },
                attributes: {
                    name: { type: 'string', required: true },
                    avatar: { type: 'media', allowedTypes: ['images'], multiple: false },
                    profile: { type: 'json' },
                },
            },

            // Тег
            'api::tag.tag': {
                kind: 'collectionType',
                collectionName: 'tags',
                info: {
                    singularName: 'tag',
                    pluralName: 'tags',
                    displayName: 'Tag',
                    description: 'Теги новостей',
                },
                options: { draftAndPublish: false },
                attributes: {
                    name: { type: 'string', required: true, unique: true },
                },
            },

            // Новость (главный контент-тип)
            'api::news-item.news-item': {
                kind: 'collectionType',
                collectionName: 'news_items',
                info: {
                    singularName: 'news-item',
                    pluralName: 'news-items',
                    displayName: 'News Item',
                    description: 'Новости и события',
                },
                options: { draftAndPublish: true },
                attributes: {
                    title: { type: 'string', required: true },
                    alias: { type: 'string', unique: true },
                    introtext: { type: 'text' },
                    fulltext: { type: 'richtext' },
                    created: { type: 'datetime' },
                    hits: { type: 'integer', default: 0 },
                    featured: { type: 'boolean', default: false },

                    // Отношения
                    category: {
                        type: 'relation',
                        relation: 'manyToOne',
                        target: 'api::category.category',
                        inversedBy: 'news_items',
                    },
                    author: {
                        type: 'relation',
                        relation: 'manyToOne',
                        target: 'api::author.author',
                        inversedBy: 'news_items',
                    },
                    tags: {
                        type: 'relation',
                        relation: 'manyToMany',
                        target: 'api::tag.tag',
                        inversedBy: 'news_items',
                        mappedBy: 'news_items',
                    },

                    // Медиа
                    image: { type: 'media', allowedTypes: ['images'], multiple: false },
                    gallery: { type: 'media', allowedTypes: ['images'], multiple: true },
                },
            },
        };

        console.log('✅ Схемы созданы. Теперь создадим файлы...');
        return { components: componentSchemas, contentTypes };

    } catch (error) {
        console.error('❌ Ошибка генерации схем:', error);
        throw error;
    }
}

module.exports = generateSchema;