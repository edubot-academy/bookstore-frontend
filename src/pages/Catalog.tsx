import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { listBooks } from '../lib/api';
import { Link } from 'react-router-dom';

export default function Catalog() {
    const [page, setPage] = React.useState(1);
    const [q, setQ] = React.useState('');
    const { data, isLoading } = useQuery({ queryKey: ['books', { page, q }], queryFn: () => listBooks({ page, q }) });

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-4">
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Издөө…" className="border px-3 py-2 rounded-xl w-full" />
            {isLoading ? 'Жүктөлүүдө…' : (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {data?.items?.map((b: any) => (
                            <Link key={b.id} to={`/books/${b.id}`} className="border rounded-xl p-3 hover:shadow">
                                <div className="font-semibold">{b.title}</div>
                                <div className="text-sm text-gray-600">{Number(b.price).toLocaleString()} KGS</div>
                            </Link>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <button className="border px-3 py-1 rounded" onClick={() => setPage(p => Math.max(1, p - 1))}>←</button>
                        <span>Барак: {data?.page}</span>
                        <button className="border px-3 py-1 rounded" onClick={() => setPage(p => p + 1)} disabled={data?.page >= data?.totalPages}>→</button>
                    </div>
                </>
            )}
        </div>
    );
}
