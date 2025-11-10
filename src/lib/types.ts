export type ID = number;

export interface Author {
    id: ID;
    name: string;
    bio?: string | null;
}

export interface Category {
    id: ID;
    slug: string;
    name: string;
}

export type Book = {
    id: number;
    title: string;
    author: string;
    price: number;
    image: string;
    url: string;
    isSale?: boolean;
    emphasize?: boolean;
};

export interface Paginated<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
