export type Author = { id: number; name: string; bio?: string | null; createdAt?: string };
export type Category = { id: number; name: string; slug: string; createdAt?: string };
export type BookRow = {
    id: number;
    title: string;
    price?: number;
    description?: string;
    imageUrl?: string;          // primary/cover
    images?: string[];          // gallery
    status?: 'draft' | 'published';
    isPublished?: boolean;
    authorId?: number | null;
    authorName?: string;
    categoryId?: number | null;
    categoryName?: string;
    stock?: number;
    sku?: string;
    createdAt?: string;
};

export type OrderStatus = 'NEW' | 'PAID' | 'PACKING' | 'READY_FOR_PICKUP' | 'SHIPPED' | 'COMPLETED' | 'CANCELLED';
export type OrderItem = { bookId: number; title: string; qty: number; price: number; imageUrl?: string };
export type OrderDTO = {
    id: number;
    number: string;
    status: OrderStatus;
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
    'NEW', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED',
] as const;