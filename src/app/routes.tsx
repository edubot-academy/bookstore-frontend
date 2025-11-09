import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';
import Catalog from '../pages/Catalog';
import BookPage from '../pages/BookPage';
import AdminBooks from '../pages/admin/AdminBooks';

export const router = createBrowserRouter([
    { path: '/', element: <Home /> },
    { path: '/catalog', element: <Catalog /> },
    { path: '/books/:id', element: <BookPage /> },
    { path: '/admin/books', element: <AdminBooks /> },
]);
