import axios from 'axios';
export const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL });

export async function listBooks(params: any) {
    const { data } = await api.get('/books', { params });
    return data;
}
export async function getBook(id: number) {
    const { data } = await api.get(`/books/${id}`);
    return data;
}
export async function deleteBook(id: number) {
    const { data } = await api.delete(`/admin/books/${id}`);
    return data;
}
