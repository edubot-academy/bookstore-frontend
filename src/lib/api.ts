import axios from 'axios';
import type { Book, Category, Author, Paginated } from './types';

// Base API instance
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api',
    withCredentials: false,
    headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((cfg) => {
    const token = localStorage.getItem('token');
    if (token) cfg.headers.Authorization = `Bearer ${token}`;
    return cfg;
});

// --- Utility ---
function unwrap<T>(res: { data: T }) {
    return res.data;
}

// --- AUTH ---
export async function login(payload: { email: string; password: string }) {
    return unwrap(await api.post('/auth/login', payload));
}

export async function register(payload: { fullName: string; email: string; password: string; phone?: string }) {
    return unwrap(await api.post('/auth/register', payload));
}

export async function logout() {
    return unwrap(await api.post('/auth/logout'));
}

export async function getMe() {
    return unwrap(await api.get('/auth/me'));
}

// --- PUBLIC: Books & Catalog ---
export async function listBooks(params?: {
    q?: string;
    category?: string;
    author?: string;
    minPrice?: number;
    maxPrice?: number;
    page?: number;
    limit?: number;
    sort?: 'new' | 'price_asc' | 'price_desc';
}) {
    return unwrap(await api.get<Paginated<Book>>('/books', { params }));
}

export async function getBook(id: number) {
    return unwrap(await api.get<Book>(`/books/${id}`));
}

export async function listCategories() {
    return unwrap(await api.get<Category[]>('/categories'));
}

export async function listAuthors() {
    return unwrap(await api.get<Author[]>('/authors'));
}

// --- ADMIN: Books, Categories, Authors ---
export async function createBook(payload: any) {
    return unwrap(await api.post('/admin/books', payload));
}

export async function updateBook(id: number, payload: any) {
    return unwrap(await api.put(`/admin/books/${id}`, payload));
}

export async function deleteBook(id: number) {
    return unwrap(await api.delete(`/admin/books/${id}`));
}

export async function createCategory(payload: { name: string; slug: string }) {
    return unwrap(await api.post('/admin/categories', payload));
}

export async function updateCategory(id: number, payload: { name?: string; slug?: string }) {
    return unwrap(await api.put(`/admin/categories/${id}`, payload));
}

export async function deleteCategory(id: number) {
    return unwrap(await api.delete(`/admin/categories/${id}`));
}

export async function createAuthor(payload: { name: string; bio?: string }) {
    return unwrap(await api.post('/admin/authors', payload));
}

export async function updateAuthor(id: number, payload: { name?: string; bio?: string }) {
    return unwrap(await api.put(`/admin/authors/${id}`, payload));
}

export async function deleteAuthor(id: number) {
    return unwrap(await api.delete(`/admin/authors/${id}`));
}

// --- ADMIN: Uploads ---
export async function uploadImage(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post('/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
}

// --- PUBLIC: Orders ---
export async function createOrder(payload: {
    items: { bookId: number; qty: number }[];
    customerName: string;
    phone: string;
    email?: string;
    fulfillmentType: 'DELIVERY' | 'PICKUP';
    address?: { line1: string; city?: string };
    paymentMethod: 'CASH' | 'CARD' | 'TRANSFER';
}) {
    return unwrap(await api.post('/orders', payload));
}

export async function getOrder(orderNumber: string) {
    return unwrap(await api.get(`/orders/${orderNumber}`));
}

export async function getStoreInfo() {
    return unwrap(await api.get('/store-info'));
}

// --- ADMIN: Orders ---
export async function listOrders(params?: {
    page?: number;
    limit?: number;
    status?: string;
    fulfillmentType?: string;
    paymentStatus?: string;
    dateFrom?: string;
    dateTo?: string;
}) {
    return unwrap(await api.get('/admin/orders', { params }));
}

export async function getOrderAdmin(id: number) {
    return unwrap(await api.get(`/admin/orders/${id}`));
}

export async function updateOrderAdmin(id: number, payload: any) {
    return unwrap(await api.put(`/admin/orders/${id}`, payload));
}

// --- HOMEPAGE CMS ---
export async function getHomepage(locale = 'kg') {
    return unwrap(await api.get(`/homepage?locale=${locale}`));
}

export async function updateHomepage(payload: any) {
    return unwrap(await api.put('/admin/homepage', payload));
}

// --- NOTIFICATIONS (Admin Test) ---
export async function testBooksNotification() {
    return unwrap(await api.post('/admin/notifications/test/books', {}));
}

export async function testOrdersNotification() {
    return unwrap(await api.post('/admin/notifications/test/orders', {}));
}
