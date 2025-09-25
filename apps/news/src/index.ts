import newsData from "./data/news.json";

export default {
    async bootstrap({ strapi }) {
        // Проверим, есть ли уже записи
        const existing = await strapi.db.query("api::news.news").count();

        if (existing === 0) {
            for (const item of newsData) {
                await strapi.entityService.create("api::news.news", {
                    data: item,
                });
            }
            strapi.log.info(`✅ Загружено ${newsData.length} новостей из JSON`);
        }
    },
};
