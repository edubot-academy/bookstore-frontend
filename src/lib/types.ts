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

export interface BackendBook {
    id: ID;
    title: string;
    description?: string | null;
    price: string | number;
    stock: number;
    coverUrl?: string | null;
    isbn?: string | null;
    language?: string | null;
    publisher?: string | null;
    gradeLevel?: string | null;
    subject?: string | null;
    bookType?: BookType | null;
    edition?: string | null;
    targetAudience?: string | null;
    authors: Author[];
    category?: Category | null;
    createdAt?: string;
    updatedAt?: string;
}

export type Book = {
    id: number;
    title: string;
    description?: string | null;
    price: string | number;
    stock?: number;
    coverUrl?: string | null;
    isbn?: string | null;
    language?: string | null;
    publisher?: string | null;
    gradeLevel?: string | null;
    subject?: string | null;
    bookType?: BookType | null;
    edition?: string | null;
    targetAudience?: string | null;
    authors?: Author[];
    category?: Category | null;
    url?: string;
    isSale?: boolean;
    emphasize?: boolean;
};

export type BookType =
    | 'TEXTBOOK' | 'WORKBOOK' | 'READING_BOOK' | 'EXAM_PREP'
    | 'LANGUAGE_LEARNING' | 'PROGRAMMING' | 'AI_DIGITAL_SKILLS'
    | 'TEACHER_RESOURCE' | 'COURSE_MATERIAL' | 'CHILDREN_EDUCATION'
    | 'PERSONAL_DEVELOPMENT';

export interface Paginated<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}
