// apps/news/types/strapi.ts
export interface StrapiResponse<T> {
    data: T;
    meta: {
        pagination?: {
            page: number;
            pageSize: number;
            pageCount: number;
            total: number;
        };
    };
}

export interface Category {
    id: number;
    attributes: {
        name: string;
        alias: string;
        description: string;
        ordering: number;
        createdAt: string;
        updatedAt: string;
        publishedAt: string;
    };
}

export interface Author {
    id: number;
    attributes: {
        name: string;
        avatar: {
            data: {
                attributes: {
                    url: string;
                    formats: any;
                };
            };
        };
        createdAt: string;
        updatedAt: string;
    };
}

export interface NewsItem {
    id: number;
    attributes: {
        title: string;
        alias: string;
        introtext: string;
        fulltext: string;
        created: string;
        hits: number;
        featured: boolean;
        createdAt: string;
        updatedAt: string;
        publishedAt: string;
        image: {
            data: {
                attributes: {
                    url: string;
                    formats: any;
                };
            };
        };
        gallery: {
            data: Array<{
                attributes: {
                    url: string;
                    formats: any;
                };
            }>;
        };
        category: {
            data: Category;
        };
        author: {
            data: Author;
        };
        tags: {
            data: Array<{
                id: number;
                attributes: {
                    name: string;
                };
            }>;
        };
    };
}