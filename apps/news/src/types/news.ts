export interface Participant {
    id: string;
    name: string;
    role: string;
    link: string;
    avatar?: string | null;
}

export interface NewsItem {
    title: string;
    desc: string;
    date: string;
    tags: string[];
    images: string[];
    participants: Participant[];
    category?: string;
    hits?: number;
}