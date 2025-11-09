import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { listBooks, deleteBook } from '../../lib/api';

export default function AdminBooks() {
    const qc = useQueryClient();
    const { data } = useQuery({ queryKey: ['books', { page: 1 }], queryFn: () => listBooks({ page: 1, limit: 50 }) });
    const del = useMutation({ mutationFn: (id: number) => deleteBook(id), onSuccess: () => qc.invalidateQueries({ queryKey: ['books'] }) });
    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Админ: Китептер</h1>
            <table className="w-full border rounded-xl overflow-hidden">
                <thead className="bg-gray-50"><tr>
                    <th className="p-3 text-left">Аталышы</th><th className="p-3">Баасы</th><th className="p-3">Запас</th><th className="p-3">Аракеттер</th>
                </tr></thead>
                <tbody>
                    {data?.items?.map((b: any) => (
                        <tr key={b.id} className="border-t">
                            <td className="p-3">{b.title}</td>
                            <td className="p-3">{Number(b.price).toLocaleString()} KGS</td>
                            <td className="p-3">{b.stock}</td>
                            <td className="p-3 text-right">
                                <button className="border px-3 py-1 rounded" onClick={() => del.mutate(b.id)}>Өчүрүү</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
