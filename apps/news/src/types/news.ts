export interface NewsItem {
    title: string;
    desc: string;
    date: string;
    img: string;
}

export interface NewsMetadata {
    title: string;
    description: string;
}

export type NewsSlug = 'portal-gosuslug' | 'cifrovaya-transformaciya' | 'centr-cifrovogo-razvitiya';