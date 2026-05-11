import { api, type HomepagePayload } from "./api";
import type { Book, Category, Author, Paginated } from './types';

function unwrap<T>(res: { data: T }) {
    return res.data;
}

// ---- AUTH EXTRAS ----
export async function refresh() {
    return unwrap(await api.post('/auth/refresh', {}));
}
export async function requestPasswordReset(payload: { email: string }) {
    return unwrap(await api.post('/auth/password/reset-request', payload));
}
export async function confirmPasswordReset(payload: { token: string; newPassword: string }) {
    return unwrap(await api.post('/auth/password/reset-confirm', payload));
}
export async function updateProfile(payload: { fullName?: string; phone?: string; avatarUrl?: string }) {
    return unwrap(await api.put('/auth/profile', payload));
}
export async function changePassword(payload: { currentPassword: string; newPassword: string }) {
    return unwrap(await api.post('/auth/password/change', payload));
}

// ---- PUBLIC SEARCH / CATALOG EXTRAS ----
export async function searchSuggest(q: string) {
    return unwrap(await api.get<string[]>('/search/suggest', { params: { q } }));
}
export async function getRelatedBooks(id: number, limit = 8) {
    return unwrap(await api.get<Book[]>(`/books/${id}/related`, { params: { limit } }));
}
// Optional if you’ll show ratings on PDP/listing:
export async function listBookReviews(bookId: number, params?: { page?: number; limit?: number }) {
    return unwrap(await api.get<Paginated<{ id: number; user: string; rating: number; comment?: string; createdAt: string }>>(`/books/${bookId}/reviews`, { params }));
}
export async function createBookReview(bookId: number, payload: { rating: number; comment?: string }) {
    return unwrap(await api.post(`/books/${bookId}/reviews`, payload));
}

// ---- CHECKOUT / ORDERS EXTRAS ----
export async function quoteOrder(payload: {
    items: { bookId: number; qty: number }[];
    fulfillmentType: 'DELIVERY' | 'PICKUP';
    address?: { line1: string; city?: string };
}) {
    // returns totals, deliveryFee, discounts, etc.
    return unwrap(await api.post('/orders/quote', payload));
}
export async function listPickupLocations() {
    return unwrap(await api.get<{ id: string; name: string; address: string; phone?: string }[]>('/pickup-locations'));
}

// ---- STORE INFO & CMS EXTRAS ----
export async function updateStoreInfo(payload: {
    name?: string; address?: string; phone?: string; hours?: string; socials?: Record<string, string>;
}) {
    return unwrap(await api.put('/admin/store-info', payload));
}
export async function previewHomepage(payload: HomepagePayload) {
    // server returns the shaped homepage as it would render (without persisting)
    return unwrap(await api.post('/admin/homepage/preview', payload));
}

// ---- ADMIN LISTING (PAGINATED + FILTERS) ----
export async function listAdminBooks(params?: {
    page?: number; limit?: number; q?: string; categoryId?: number; authorId?: number; status?: 'draft' | 'published';
    sort?: 'created_desc' | 'created_asc' | 'price_asc' | 'price_desc';
}) {
    return unwrap(await api.get<Paginated<Book>>('/admin/books', { params }));
}
export async function listAdminCategories(params?: { page?: number; limit?: number; q?: string }) {
    return unwrap(await api.get<Paginated<Category>>('/admin/categories', { params }));
}
export async function listAdminAuthors(params?: { page?: number; limit?: number; q?: string }) {
    return unwrap(await api.get<Paginated<Author>>('/admin/authors', { params }));
}

// Dashboard tiles
export async function getAdminMetrics(params?: { dateFrom?: string; dateTo?: string }) {
    return unwrap(await api.get<{
        salesTotal: number; ordersCount: number; avgOrderValue: number; newCustomers: number;
        topBooks: { id: number; title: string; quantity: number }[];
    }>('/admin/metrics/overview', { params }));
}

// ---- UPLOADS (OPTIONAL S3 FLOW) ----
export async function getPresignedUpload(params: { filename: string; contentType: string; folder?: string }) {
    return unwrap(await api.post<{ url: string; fields?: Record<string, string> }>('/admin/upload/presign', params));
}
export async function deleteImage(payload: { url: string }) {
    return unwrap(await api.post('/admin/upload/delete', payload));
}

// ---- NOTIFICATION SETTINGS ----
export async function getNotificationSettings() {
    return unwrap(await api.get<{ booksChannelId?: string; ordersChannelId?: string; enabled: boolean }>('/admin/notifications/settings'));
}
export async function updateNotificationSettings(payload: { booksChannelId?: string; ordersChannelId?: string; enabled?: boolean }) {
    return unwrap(await api.put('/admin/notifications/settings', payload));
}
