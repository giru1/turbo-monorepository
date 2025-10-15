export interface Author {
    id: string;
    name: string;
    avatar?: string | null;
}

export interface Tag {
    id: string;
    name: string;
}

export interface Category {
    id: string;
    name: string;
    alias: string;
}

export interface NewsItem {
    title: string;
    alias: string;
    desc: string;
    date: string;
    tags: Tag[];
    image: string;
    gallery: string[];
    authors: Author[];
    category?: Category;
}

export interface NewsDetailProps {
    title: string;
    desc: string;
    date: string;
    tags: Tag[];
    image: string;
    gallery: string[];
    authors: Author[];
    category?: Category;
}

export interface NewsProps {
    title: string;
    descSmall: string;
    link?: string;
    date?: string;
    img?: string;
    tags?: string[];
    maxLength?: number;
}

export interface StrapiNewsItem {
    id: number;
    title: string;
    alias: string;
    introtext: string;
    fulltext: string;
    created: string;
    hits: number;
    featured: boolean;
    image: {
        url: string;
        alternativeText: string | null;
    } | null;
    gallery: Array<{
        url: string;
        alternativeText: string | null;
    }> | null;
    category: {
        id: number;
        name: string;
        alias: string;
    } | null;
    author: {
        id: number;
        name: string;
    } | null;
    tags: Array<{
        id: number;
        name: string;
    }>;
}