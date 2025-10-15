import newsData from "./data/news.json";

interface Strapi {
    db: {
        query: (entity: string) => {
            count: () => Promise<number>;
        };
    };
    entityService: {
        create: (entity: string, data: { data: Record<string, unknown> }) => Promise<unknown>;
    };
    log: {
        info: (message: string) => void;
    };
}

interface JsonNewsItem {
    title: string;
    alias: string;
    introtext: string;
    fulltext: string;
    created: string;
}

const bootstrapModule = {
    async bootstrap({ strapi }: { strapi: Strapi }) {
        const existing = await strapi.db.query("api::news.news").count();

        if (existing === 0) {
            const fullData = newsData as { items: JsonNewsItem[] };
            const items = fullData.items;

            for (const item of items) {
                await strapi.entityService.create("api::news.news", {
                    data: {
                        title: item.title,
                        alias: item.alias,
                        introtext: item.introtext,
                        fulltext: item.fulltext,
                        created: item.created,
                    } as Record<string, unknown>,
                });
            }
            strapi.log.info(`✅ Загружено ${items.length} новостей из JSON`);
        }
    },
};

export default bootstrapModule;