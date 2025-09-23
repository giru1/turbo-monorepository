export type NewsSlug = 'portal-gosuslug' | 'cifrovaya-transformaciya' | 'centr-cifrovogo-razvitiya';

export interface Participant {
    id: string;
    name: string;
    role: string;
    link: string;
}

export interface NewsItem {
    title: string;
    desc: string;
    date: string;
    tags: string[];
    images: string[];
    participants: Participant[];
}