import React from 'react';
import type { Author, Book, Category } from '../lib/types';

type CartBook = {
    id: number;
    title: string;
    price: string | number;
    coverUrl?: string | null;
    authors?: Author[];
    category?: Category | null;
    stock?: number;
};

export type CartItem = {
    book: CartBook;
    qty: number;
};

type CartContextShape = {
    items: CartItem[];
    count: number;
    subtotal: number;
    addItem: (book: Book, qty?: number) => void;
    updateQty: (bookId: number, qty: number) => void;
    removeItem: (bookId: number) => void;
    clearCart: () => void;
};

const storageKey = 'edubook_cart';
const CartContext = React.createContext<CartContextShape | null>(null);

function normalizeBook(book: Book): CartBook {
    return {
        id: book.id,
        title: book.title,
        price: book.price,
        coverUrl: book.coverUrl,
        authors: book.authors,
        category: book.category,
        stock: book.stock,
    };
}

function readCart(): CartItem[] {
    try {
        const raw = localStorage.getItem(storageKey);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export const CartProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [items, setItems] = React.useState<CartItem[]>(readCart);

    React.useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify(items));
    }, [items]);

    const addItem = React.useCallback((book: Book, qty = 1) => {
        setItems((current) => {
            const nextQty = Math.max(1, qty);
            const existing = current.find((item) => item.book.id === book.id);
            if (!existing) return [...current, { book: normalizeBook(book), qty: nextQty }];
            return current.map((item) =>
                item.book.id === book.id
                    ? { ...item, book: normalizeBook(book), qty: item.qty + nextQty }
                    : item
            );
        });
    }, []);

    const updateQty = React.useCallback((bookId: number, qty: number) => {
        setItems((current) =>
            current
                .map((item) => item.book.id === bookId ? { ...item, qty: Math.max(1, qty) } : item)
                .filter((item) => item.qty > 0)
        );
    }, []);

    const removeItem = React.useCallback((bookId: number) => {
        setItems((current) => current.filter((item) => item.book.id !== bookId));
    }, []);

    const clearCart = React.useCallback(() => setItems([]), []);

    const value = React.useMemo<CartContextShape>(() => {
        const count = items.reduce((sum, item) => sum + item.qty, 0);
        const subtotal = items.reduce((sum, item) => sum + Number(item.book.price) * item.qty, 0);
        return { items, count, subtotal, addItem, updateQty, removeItem, clearCart };
    }, [items, addItem, updateQty, removeItem, clearCart]);

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
    const ctx = React.useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within <CartProvider>');
    return ctx;
}
