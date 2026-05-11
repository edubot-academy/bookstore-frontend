import axios from 'axios';
import type { Book, BookType, Category, Author, Paginated } from './types';
import type { OrderDTO, OrderStatus, PaymentStatus } from '../pages/admin/types';

export type AuthUser = {
    id: number;
    fullName: string;
    email: string;
    avatarUrl?: string | null;
    phone?: string | null;
    role?: string;
};

export type AuthResponse = {
    accessToken?: string;
    user?: AuthUser;
};

export type HomepagePayload = {
    locale?: string;
    sections: unknown[];
    publish?: boolean;
};

export type BookPayload = {
    title: string;
    description?: string;
    price?: number;
    stock?: number;
    coverUrl?: string;
    isbn?: string;
    language?: string;
    publisher?: string;
    gradeLevel?: string;
    subject?: string;
    bookType?: BookType;
    edition?: string;
    targetAudience?: string;
    categoryId?: number;
    authorIds?: number[];
};

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
    return unwrap(await api.post<AuthResponse>('/auth/login', payload));
}

export async function register(payload: { fullName: string; email: string; password: string; phone?: string }) {
    return unwrap(await api.post<AuthResponse>('/auth/register', payload));
}

export async function logout() {
    return unwrap(await api.post('/auth/logout'));
}

export async function getMe() {
    return unwrap(await api.get<AuthUser>('/auth/me'));
}

// --- PUBLIC: Books & Catalog ---
export async function listBooks(params?: {
    q?: string;
    category?: string;
    author?: string;
    language?: string;
    subject?: string;
    gradeLevel?: string;
    bookType?: string;
    minPrice?: number;
    maxPrice?: number;
    availability?: 'available' | 'low' | 'out';
    page?: number;
    limit?: number;
    sort?: 'new' | 'price_asc' | 'price_desc';
}) {
    return unwrap(await api.get<Paginated<Book>>('/books', { params }));
}

export async function getBook(id: number) {
    return unwrap(await api.get<Book>(`/books/${id}`));
}

export type BundleItemDTO = {
    id: number;
    book: Book;
    quantity: number;
};

export type BundleDTO = {
    id: number;
    title: string;
    description?: string | null;
    image?: string | null;
    price: string;
    discountPrice?: string | null;
    isActive: boolean;
    items: BundleItemDTO[];
    createdAt: string;
    updatedAt: string;
};

export type CourseRecommendationDTO = {
    id: number;
    externalCourseId: string;
    courseTitle?: string | null;
    book?: Book | null;
    bundle?: BundleDTO | null;
    recommendationReason?: string | null;
    priority: number;
    isActive: boolean;
};

export async function listBundles() {
    return unwrap(await api.get<BundleDTO[]>('/bundles'));
}

export async function getBundle(id: number) {
    return unwrap(await api.get<BundleDTO>(`/bundles/${id}`));
}

export async function listCourseRecommendations(params?: { courseId?: string; bookId?: number }) {
    return unwrap(await api.get<CourseRecommendationDTO[]>('/course-recommendations', { params }));
}

export async function listCategories() {
    return unwrap(await api.get<Category[]>('/categories'));
}

export async function listAuthors() {
    return unwrap(await api.get<Author[]>('/authors'));
}

// --- ADMIN: Books, Categories, Authors ---
export async function createBook(payload: BookPayload) {
    return unwrap(await api.post('/admin/books', payload));
}

export async function updateBook(id: number, payload: Partial<BookPayload>) {
    return unwrap(await api.put(`/admin/books/${id}`, payload));
}

export async function deleteBook(id: number) {
    return unwrap(await api.delete(`/admin/books/${id}`));
}

export async function listAdminBooks(params?: { q?: string; page?: number; limit?: number }) {
    return unwrap(await api.get<Paginated<Book>>('/admin/books', { params }));
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

export async function listAdminCategories() {
    return unwrap(await api.get<Category[]>('/admin/categories'));
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

export async function listAdminAuthors(params?: { page?: number; limit?: number; q?: string }) {
    return unwrap(await api.get<Author[] | Paginated<Author>>('/admin/authors', { params }));
}

export async function listAdminBundles() {
    return unwrap(await api.get<BundleDTO[]>('/admin/bundles'));
}

export async function createBundle(payload: {
    title: string;
    description?: string;
    image?: string;
    price: number;
    discountPrice?: number;
    isActive: boolean;
    items: { bookId: number; quantity: number }[];
}) {
    return unwrap(await api.post<BundleDTO>('/admin/bundles', payload));
}

export async function updateBundle(id: number, payload: Partial<{
    title: string;
    description: string;
    image: string;
    price: number;
    discountPrice: number;
    isActive: boolean;
    items: { bookId: number; quantity: number }[];
}>) {
    return unwrap(await api.put<BundleDTO>(`/admin/bundles/${id}`, payload));
}

export async function deleteBundle(id: number) {
    return unwrap(await api.delete(`/admin/bundles/${id}`));
}

export async function listAdminCourseRecommendations(params?: { courseId?: string; bookId?: number }) {
    return unwrap(await api.get<CourseRecommendationDTO[]>('/admin/course-recommendations', { params }));
}

export async function createCourseRecommendation(payload: {
    externalCourseId: string;
    courseTitle?: string;
    bookId?: number | null;
    bundleId?: number | null;
    recommendationReason?: string;
    priority?: number;
    isActive: boolean;
}) {
    return unwrap(await api.post<CourseRecommendationDTO>('/admin/course-recommendations', payload));
}

export async function updateCourseRecommendation(id: number, payload: Partial<{
    externalCourseId: string;
    courseTitle: string;
    bookId: number | null;
    bundleId: number | null;
    recommendationReason: string;
    priority: number;
    isActive: boolean;
}>) {
    return unwrap(await api.put<CourseRecommendationDTO>(`/admin/course-recommendations/${id}`, payload));
}

export async function deleteCourseRecommendation(id: number) {
    return unwrap(await api.delete(`/admin/course-recommendations/${id}`));
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
    fulfillmentType: 'DELIVERY' | 'PICKUP';
    contact: {
        fullName: string;
        phone: string;
        email?: string;
    };
    deliveryAddress?: {
        line1: string;
        line2?: string;
        city?: string;
        region?: string;
        postalCode?: string;
        country?: string;
    };
    paymentMethod: 'CASH' | 'CARD' | 'TRANSFER';
}) {
    return unwrap(await api.post<OrderDTO>('/orders', payload));
}

export async function getOrder(orderNumber: string, token?: string | null) {
    return unwrap(await api.get(`/orders/${orderNumber}`, { params: token ? { token } : undefined }));
}

export async function getStoreInfo() {
    return unwrap(await api.get('/store-info'));
}

// --- ADMIN: Orders ---
// add/adjust this helper
export async function listOrders(params?: {
    q?: string;
    status?: OrderStatus | '';
    dateFrom?: string; // ISO
    dateTo?: string;   // ISO
    page?: number;
    limit?: number;
}) {
    const { data } = await api.get<Paginated<OrderDTO>>('/admin/orders', {
        params: Object.fromEntries(
            Object.entries(params ?? {}).filter(([, v]) => v !== '' && v !== undefined && v !== null)
        ),
    });
    return data;
}


export async function getOrderAdmin(id: number) {
    return unwrap(await api.get(`/admin/orders/${id}`));
}

export async function updateOrderAdmin(id: number, payload: { status: OrderStatus; paymentStatus?: PaymentStatus; notes?: string }) {
    return unwrap(await api.put(`/admin/orders/${id}`, payload));
}

export type DashboardStats = {
    todayOrders: number;
    todayRevenue: number;
    topBooks: Array<{ id: number; title: string; sold: number }>;
    lowStock: Array<{ id: number; title: string; stock: number }>;
};

export async function getDashboardStats() {
    return unwrap(await api.get<DashboardStats>('/admin/reports/dashboard'));
}

export type BookCopyStatus = 'AVAILABLE' | 'RESERVED' | 'RENTED' | 'DAMAGED' | 'LOST' | 'RETIRED';
export type BookCopyCondition = 'NEW' | 'GOOD' | 'FAIR' | 'WORN' | 'DAMAGED';
export type RentalStatus = 'DRAFT' | 'ACTIVE' | 'OVERDUE' | 'RETURNED' | 'CANCELLED' | 'LOST' | 'DAMAGED';

export type BookCopyDTO = {
    id: number;
    copyCode: string;
    condition: BookCopyCondition;
    status: BookCopyStatus;
    location?: string | null;
    purchaseCost?: string | null;
    notes?: string | null;
    book: Book;
    createdAt: string;
    updatedAt: string;
};

export type RentalDTO = {
    id: number;
    customer: { id: number; fullName: string; phone: string; email?: string | null };
    bookCopy: BookCopyDTO;
    startDate: string;
    dueDate: string;
    returnedAt?: string | null;
    status: RentalStatus;
    computedStatus?: RentalStatus;
    rentalPrice: string;
    depositAmount: string;
    lateFeeAmount: string;
    notes?: string | null;
    createdAt: string;
    updatedAt: string;
    events?: RentalEventDTO[];
};

export type RentalEventDTO = {
    id: number;
    eventType: string;
    description: string;
    createdBy?: string | null;
    createdAt: string;
};

export async function listBookCopies(params?: { bookId?: number; status?: BookCopyStatus; copyCode?: string }) {
    return unwrap(await api.get<BookCopyDTO[]>('/admin/book-copies', { params }));
}

export async function createBookCopy(payload: {
    bookId: number;
    copyCode: string;
    condition?: BookCopyCondition;
    status?: BookCopyStatus;
    location?: string;
    purchaseCost?: number;
    notes?: string;
}) {
    return unwrap(await api.post<BookCopyDTO>('/admin/book-copies', payload));
}

export async function updateBookCopy(id: number, payload: Partial<{
    bookId: number;
    copyCode: string;
    condition: BookCopyCondition;
    status: BookCopyStatus;
    location: string;
    purchaseCost: number;
    notes: string;
}>) {
    return unwrap(await api.put<BookCopyDTO>(`/admin/book-copies/${id}`, payload));
}

export async function listRentals(params?: { status?: RentalStatus | ''; overdue?: boolean; dueSoonDays?: number; q?: string }) {
    return unwrap(await api.get<RentalDTO[]>('/admin/rentals', {
        params: Object.fromEntries(Object.entries(params ?? {}).filter(([, value]) => value !== '' && value !== undefined)),
    }));
}

export async function getRental(id: number) {
    return unwrap(await api.get<RentalDTO>(`/admin/rentals/${id}`));
}

export async function createRental(payload: {
    bookCopyId: number;
    contact: { fullName: string; phone: string; email?: string };
    startDate: string;
    dueDate: string;
    rentalPrice: number;
    depositAmount: number;
    notes?: string;
}) {
    return unwrap(await api.post<RentalDTO>('/admin/rentals', payload));
}

export async function returnRental(id: number, payload: { condition: BookCopyCondition; notes?: string }) {
    return unwrap(await api.put<RentalDTO>(`/admin/rentals/${id}/return`, payload));
}

export async function markRentalLost(id: number, notes?: string) {
    return unwrap(await api.put<RentalDTO>(`/admin/rentals/${id}/mark-lost`, { notes }));
}

export async function addRentalFee(id: number, payload: { lateFeeAmount: number; notes?: string }) {
    return unwrap(await api.put<RentalDTO>(`/admin/rentals/${id}/add-fee`, payload));
}

// --- HOMEPAGE CMS ---
export async function getHomepage(locale = 'kg') {
    return unwrap(await api.get(`/homepage?locale=${locale}`));
}

export async function updateHomepage(payload: HomepagePayload) {
    return unwrap(await api.put('/admin/homepage', payload));
}

// --- NOTIFICATIONS (Admin Test) ---
export async function testBooksNotification() {
    return unwrap(await api.post('/admin/notifications/test/books', {}));
}

export async function testOrdersNotification() {
    return unwrap(await api.post('/admin/notifications/test/orders', {}));
}
