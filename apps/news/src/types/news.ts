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
}

export interface NewsItem {
    title: string;
    desc: string;
    date: string;
    tags: Tag[];
    image: string;
    imageurl: string;
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
    imageurl: string;
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