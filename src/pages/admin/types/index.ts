import type { Author as BaseAuthor, BookType, Category as BaseCategory } from "../../../lib/types";

export type Author = BaseAuthor & { createdAt?: string };
export type Category = BaseCategory & { createdAt?: string };

export type BookRow = {
    id: number;
    title: string;
    price?: string | number;
    description?: string | null;
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
    stock?: number;
    createdAt?: string;
};

export type OrderStatus =
    | 'NEW' | 'CONFIRMED' | 'FULFILLING' | 'READY_FOR_PICKUP' | 'SHIPPED'
    | 'DELIVERED' | 'PICKED_UP' | 'COMPLETED'
    | 'CANCELLED_BY_USER' | 'CANCELLED_OUT_OF_STOCK' | 'RETURN_REQUESTED' | 'RETURNED';
export type PaymentStatus = 'UNPAID' | 'PAID' | 'REFUNDED';
export type OrderItem = { id?: number; bookId: number; title: string; qty: number; price: number; lineTotal?: number; imageUrl?: string | null };
export type OrderDTO = {
    id: number;
    orderNumber: string;
    number: string;
    publicAccessToken?: string;
    status: OrderStatus;
    paymentStatus?: PaymentStatus;
    paymentMethod?: 'CASH' | 'CARD' | 'TRANSFER';
    items: OrderItem[];
    totals: { subtotal: number; shipping: number; discount: number; total: number; currency: 'KGS' | 'USD' };
    customer: { fullName: string; email?: string; phone: string };
    delivery: { method: 'DELIVERY' | 'PICKUP'; address?: string };
    notes?: string;
    createdAt: string;
    updatedAt?: string;
};

export type HomeCMS = {
    heroSlides: Array<{ title: string; subtitle?: string; imageUrl: string; ctaLabel?: string; ctaHref?: string }>;
    featuredBookIds: number[];
    banners: Array<{ imageUrl: string; href?: string; alt?: string }>;
};

export type StoreSettings = {
    storeName?: string;
    pickupAddress?: string;
    phones?: string[];
    telegram?: { publicChannelId?: string; adminChatId?: string; botToken?: string };
};

export const ORDER_STATUSES = [
    'NEW', 'CONFIRMED', 'FULFILLING', 'READY_FOR_PICKUP', 'SHIPPED',
    'DELIVERED', 'PICKED_UP', 'COMPLETED',
    'CANCELLED_BY_USER', 'CANCELLED_OUT_OF_STOCK', 'RETURN_REQUESTED', 'RETURNED',
] as const;
