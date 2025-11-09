import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getBook } from '../lib/api';

export default function BookPage() {
    const { id } = useParams();
    const { data, isLoading } = useQuery({ queryKey: ['book', id], queryFn: () => getBook(Number(id)) });
    if (isLoading) return <div className="p-6">Жүктөлүүдө…</div>;
    const b = data;
    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-2">{b.title}</h1>
            <p className="text-2xl">{Number(b.price).toLocaleString()} KGS</p>
            <p className="text-gray-700">{b.description || 'Сыпаттама жок.'}</p>
        </div>
    );
}
