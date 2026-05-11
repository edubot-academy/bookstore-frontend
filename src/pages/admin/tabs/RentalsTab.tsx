import React from 'react';
import { AlertTriangle, BookCopy, Eye, PackageCheck, Plus, RefreshCw } from 'lucide-react';
import {
    addRentalFee,
    createBookCopy,
    createRental,
    getRental,
    listAdminBooks,
    listBookCopies,
    listRentals,
    markRentalLost,
    returnRental,
    type BookCopyCondition,
    type BookCopyDTO,
    type RentalDTO,
    type RentalStatus,
} from '../../../lib/api';
import type { Book } from '../../../lib/types';
import Section from '../ui/Section';
import Field from '../ui/Field';
import { Button, TextArea, TextInput } from '../ui/Inputs';
import { bookCopyConditionLabel, bookCopyStatusLabel, rentalStatusLabel } from '../../../lib/labels';

const today = () => new Date().toISOString().slice(0, 10);

function addDays(days: number) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().slice(0, 10);
}

type RentalAction =
    | { type: 'return'; rental: RentalDTO; condition: BookCopyCondition; notes: string }
    | { type: 'fee'; rental: RentalDTO; lateFeeAmount: number | ''; notes: string }
    | { type: 'lost'; rental: RentalDTO; notes: string };

export default function RentalsTab() {
    const [books, setBooks] = React.useState<Book[]>([]);
    const [copies, setCopies] = React.useState<BookCopyDTO[]>([]);
    const [rentals, setRentals] = React.useState<RentalDTO[]>([]);
    const [status, setStatus] = React.useState<RentalStatus | ''>('');
    const [overdueOnly, setOverdueOnly] = React.useState(false);
    const [dueSoonOnly, setDueSoonOnly] = React.useState(false);
    const [query, setQuery] = React.useState('');
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [selectedRental, setSelectedRental] = React.useState<RentalDTO | null>(null);
    const [detailLoading, setDetailLoading] = React.useState(false);
    const [action, setAction] = React.useState<RentalAction | null>(null);
    const [actionSaving, setActionSaving] = React.useState(false);

    const [copyBookId, setCopyBookId] = React.useState<number | ''>('');
    const [copyCode, setCopyCode] = React.useState('');
    const [copyCondition, setCopyCondition] = React.useState<BookCopyCondition>('GOOD');
    const [copyLocation, setCopyLocation] = React.useState('');

    const [rentalCopyId, setRentalCopyId] = React.useState<number | ''>('');
    const [fullName, setFullName] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [startDate, setStartDate] = React.useState(today());
    const [dueDate, setDueDate] = React.useState(addDays(14));
    const [rentalPrice, setRentalPrice] = React.useState<number | ''>('');
    const [depositAmount, setDepositAmount] = React.useState<number | ''>('');
    const [notes, setNotes] = React.useState('');

    const load = React.useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [bookData, copyData, rentalData] = await Promise.all([
                listAdminBooks({ limit: 200 }),
                listBookCopies(),
                listRentals({ status, overdue: overdueOnly, dueSoonDays: dueSoonOnly ? 7 : undefined, q: query.trim() || undefined }),
            ]);
            setBooks(bookData.items);
            setCopies(copyData);
            setRentals(rentalData);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Ижаралар жүктөлгөн жок');
        } finally {
            setLoading(false);
        }
    }, [status, overdueOnly, dueSoonOnly, query]);

    React.useEffect(() => { load(); }, [load]);

    const availableCopies = copies.filter((copy) => copy.status === 'AVAILABLE');

    const submitCopy = async (event: React.FormEvent) => {
        event.preventDefault();
        if (copyBookId === '') return;
        await createBookCopy({
            bookId: Number(copyBookId),
            copyCode: copyCode.trim(),
            condition: copyCondition,
            status: 'AVAILABLE',
            location: copyLocation.trim() || undefined,
        });
        setCopyCode('');
        setCopyLocation('');
        await load();
    };

    const submitRental = async (event: React.FormEvent) => {
        event.preventDefault();
        if (rentalCopyId === '') return;
        await createRental({
            bookCopyId: Number(rentalCopyId),
            contact: { fullName: fullName.trim(), phone: phone.trim(), email: email.trim() || undefined },
            startDate,
            dueDate,
            rentalPrice: rentalPrice === '' ? 0 : Number(rentalPrice),
            depositAmount: depositAmount === '' ? 0 : Number(depositAmount),
            notes: notes.trim() || undefined,
        });
        setRentalCopyId('');
        setFullName('');
        setPhone('');
        setEmail('');
        setNotes('');
        await load();
    };

    const onReturn = async (rental: RentalDTO) => {
        setAction({ type: 'return', rental, condition: 'GOOD', notes: 'Башкаруучу тарабынан кайтарылды' });
    };

    const onFee = async (rental: RentalDTO) => {
        setAction({ type: 'fee', rental, lateFeeAmount: Number(rental.lateFeeAmount || 0), notes: 'Кечиктирүү айып акысы башкаруучу тарабынан жаңыртылды' });
    };

    const onLost = async (rental: RentalDTO) => {
        setAction({ type: 'lost', rental, notes: 'Башкаруучу тарабынан жоголду деп белгиленди' });
    };

    const submitAction = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!action) return;
        setActionSaving(true);
        setError(null);
        try {
            if (action.type === 'return') {
                await returnRental(action.rental.id, { condition: action.condition, notes: action.notes.trim() || undefined });
            }
            if (action.type === 'fee') {
                await addRentalFee(action.rental.id, {
                    lateFeeAmount: action.lateFeeAmount === '' ? 0 : Number(action.lateFeeAmount),
                    notes: action.notes.trim() || undefined,
                });
            }
            if (action.type === 'lost') {
                await markRentalLost(action.rental.id, action.notes.trim() || undefined);
            }
            setAction(null);
            await load();
            if (selectedRental?.id === action.rental.id) setSelectedRental(await getRental(action.rental.id));
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Ижараны жаңыртуу ишке ашкан жок');
        } finally {
            setActionSaving(false);
        }
    };

    const openRental = async (rental: RentalDTO) => {
        setSelectedRental(rental);
        setDetailLoading(true);
        try {
            setSelectedRental(await getRental(rental.id));
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Ижара маалыматы жүктөлгөн жок');
        } finally {
            setDetailLoading(false);
        }
    };

    const refreshSelectedRental = async () => {
        if (!selectedRental) return;
        setSelectedRental(await getRental(selectedRental.id));
    };

    return (
        <div className="grid gap-4">
            {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
                Ижара EduBook үчүн кийинки этаптагы мүмкүнчүлүк. Бул экран азырынча фундаменттик башкаруу куралы катары гана сакталат; азыркы биринчи этаптагы кардар буйрутма агымына кирбейт.
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <Section title="Физикалык нуска кошуу">
                    <form onSubmit={submitCopy} className="grid gap-3">
                        <Field label="Китеп">
                            <select value={copyBookId} onChange={(e) => setCopyBookId(e.target.value === '' ? '' : Number(e.target.value))} required className="dashboard-select">
                                <option value="">Китеп тандаңыз</option>
                                {books.map((book) => <option key={book.id} value={book.id}>{book.title}</option>)}
                            </select>
                        </Field>
                        <Field label="Нуска коду"><TextInput value={copyCode} onChange={(e) => setCopyCode(e.target.value)} required placeholder="JS-001" /></Field>
                        <Field label="Абалы">
                            <select value={copyCondition} onChange={(e) => setCopyCondition(e.target.value as BookCopyCondition)} className="dashboard-select">
                                {['NEW', 'GOOD', 'FAIR', 'WORN', 'DAMAGED'].map((value) => <option key={value} value={value}>{bookCopyConditionLabel(value)}</option>)}
                            </select>
                        </Field>
                        <Field label="Жайгашкан жери"><TextInput value={copyLocation} onChange={(e) => setCopyLocation(e.target.value)} placeholder="Бишкек, текче A" /></Field>
                        <Button type="submit" className="dashboard-button-primary inline-flex items-center justify-center gap-2">
                            <BookCopy className="h-4 w-4" aria-hidden="true" />
                            Нуска түзүү
                        </Button>
                    </form>
                </Section>

                <Section title="Ижара түзүү">
                    <form onSubmit={submitRental} className="grid gap-3">
                        <Field label="Жеткиликтүү нуска">
                            <select value={rentalCopyId} onChange={(e) => setRentalCopyId(e.target.value === '' ? '' : Number(e.target.value))} required className="dashboard-select">
                                <option value="">Нуска тандаңыз</option>
                                {availableCopies.map((copy) => <option key={copy.id} value={copy.id}>{copy.copyCode} - {copy.book.title}</option>)}
                            </select>
                        </Field>
                        <div className="grid gap-3 md:grid-cols-2">
                            <Field label="Кардар"><TextInput value={fullName} onChange={(e) => setFullName(e.target.value)} required /></Field>
                            <Field label="Телефон"><TextInput value={phone} onChange={(e) => setPhone(e.target.value)} required /></Field>
                        </div>
                        <Field label="Email (милдеттүү эмес)"><TextInput type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
                        <div className="grid gap-3 md:grid-cols-2">
                            <Field label="Башталган күн"><TextInput type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required /></Field>
                            <Field label="Кайтаруу күнү"><TextInput type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required /></Field>
                            <Field label="Ижара баасы"><TextInput type="number" value={rentalPrice} onChange={(e) => setRentalPrice(e.target.value === '' ? '' : Number(e.target.value))} /></Field>
                            <Field label="Депозит"><TextInput type="number" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value === '' ? '' : Number(e.target.value))} /></Field>
                        </div>
                        <Field label="Эскертүү"><TextArea value={notes} onChange={(e) => setNotes(e.target.value)} /></Field>
                        <Button type="submit" className="dashboard-button-primary inline-flex items-center justify-center gap-2">
                            <Plus className="h-4 w-4" aria-hidden="true" />
                            Ижара түзүү
                        </Button>
                    </form>
                </Section>
            </div>

            <Section title="Ижаралар" actions={(
                <div className="flex flex-wrap items-center gap-2">
                    <TextInput value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Кардар, телефон, нуска же китеп издөө" className="w-64" />
                    <select value={status} onChange={(e) => setStatus(e.target.value as RentalStatus | '')} className="dashboard-select min-w-[160px]">
                        <option value="">Бардык статустар</option>
                        {['ACTIVE', 'OVERDUE', 'RETURNED', 'LOST', 'DAMAGED', 'CANCELLED'].map((value) => <option key={value} value={value}>{rentalStatusLabel(value)}</option>)}
                    </select>
                    <label className="flex items-center gap-2 rounded-2xl border border-edubot-line bg-white px-3 py-2 text-sm text-edubot-ink">
                        <input type="checkbox" checked={overdueOnly} onChange={(e) => setOverdueOnly(e.target.checked)} className="accent-primary" />
                        Кечиккендер гана
                    </label>
                    <label className="flex items-center gap-2 rounded-2xl border border-edubot-line bg-white px-3 py-2 text-sm text-edubot-ink">
                        <input type="checkbox" checked={dueSoonOnly} onChange={(e) => setDueSoonOnly(e.target.checked)} className="accent-primary" />
                        7 күндө кайтарылат
                    </label>
                </div>
            )}>
                {loading ? <RentalRowsSkeleton /> : rentals.length === 0 ? (
                    <RentalEmptyState title="Ижаралар табылган жок" description="Ижара операциялары кийинки этапта башталганда жазуулар ушул жерде көрүнөт." />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead className="border-b border-edubot-line bg-edubot-surfaceAlt text-left text-xs uppercase tracking-[0.12em] text-edubot-muted">
                                <tr>
                                    <th className="px-4 py-3">Нуска</th>
                                    <th className="px-4 py-3">Кардар</th>
                                    <th className="px-4 py-3">Кайтаруу күнү</th>
                                    <th className="px-4 py-3">Төлөмдөр</th>
                                    <th className="px-4 py-3">Статус</th>
                                    <th className="px-4 py-3 text-right">Аракеттер</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-edubot-line">
                                {rentals.map((rental) => (
                                    <tr key={rental.id} className="bg-white/70 transition hover:bg-edubot-orange/5">
                                        <td className="px-4 py-3"><div className="font-medium text-edubot-ink">{rental.bookCopy.copyCode}</div><div className="text-xs text-edubot-muted">{rental.bookCopy.book.title}</div></td>
                                        <td className="px-4 py-3"><div className="font-medium text-edubot-ink">{rental.customer.fullName}</div><div className="text-xs text-edubot-muted">{rental.customer.phone}</div></td>
                                        <td className="px-4 py-3 text-edubot-muted">{rental.dueDate}</td>
                                        <td className="px-4 py-3 text-edubot-muted">Ижара {Number(rental.rentalPrice).toFixed(2)} / Депозит {Number(rental.depositAmount).toFixed(2)} / Кечиктирүү {Number(rental.lateFeeAmount).toFixed(2)}</td>
                                        <td className="px-4 py-3"><RentalStatusBadge status={rental.computedStatus || rental.status} /></td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-2">
                                                <Button onClick={() => openRental(rental)} className="dashboard-button-secondary inline-flex items-center gap-2"><Eye className="h-4 w-4" aria-hidden="true" />Маалымат</Button>
                                                <Button onClick={() => onFee(rental)} className="dashboard-button-secondary">Айып акы</Button>
                                                <Button onClick={() => onReturn(rental)} disabled={['RETURNED', 'LOST', 'CANCELLED'].includes(rental.status)} className="dashboard-button-secondary">Кайтаруу</Button>
                                                <Button onClick={() => onLost(rental)} disabled={['RETURNED', 'LOST', 'CANCELLED'].includes(rental.status)} className="border border-red-200 bg-white text-red-600 hover:bg-red-50">Жоголду</Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Section>

            {selectedRental && (
                <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
                    <div className="h-full w-full max-w-2xl overflow-y-auto border-l border-edubot-line bg-edubot-surfaceAlt shadow-xl">
                        <div className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-edubot-line bg-white/95 p-5 backdrop-blur">
                            <div>
                                <h3 className="text-lg font-semibold text-edubot-ink">Ижара #{selectedRental.id}</h3>
                                <p className="text-sm text-edubot-muted">{selectedRental.bookCopy.copyCode} - {selectedRental.bookCopy.book.title}</p>
                            </div>
                            <Button onClick={() => setSelectedRental(null)} className="dashboard-button-secondary">Жабуу</Button>
                        </div>

                        {detailLoading ? <div className="p-5 text-sm text-edubot-muted">Маалымат жүктөлүүдө...</div> : (
                            <div className="grid gap-5 p-5">
                                <div className="grid gap-3 rounded-2xl border border-edubot-line bg-white p-4 text-sm shadow-edubot-soft">
                                    <DetailRow label="Кардар" value={selectedRental.customer.fullName} strong />
                                    <DetailRow label="Телефон" value={selectedRental.customer.phone} />
                                    <DetailRow label="Email" value={selectedRental.customer.email || 'Көрсөтүлгөн эмес'} />
                                    <DetailRow label="Мөөнөт" value={`${selectedRental.startDate} - ${selectedRental.dueDate}`} />
                                    <DetailRow label="Кайтарылды" value={selectedRental.returnedAt ? new Date(selectedRental.returnedAt).toLocaleString() : 'Кайтарыла элек'} />
                                    <DetailRow label="Статус" value={rentalStatusLabel(selectedRental.computedStatus || selectedRental.status)} />
                                    <DetailRow label="Нуска абалы" value={bookCopyConditionLabel(selectedRental.bookCopy.condition)} />
                                    <DetailRow label="Нуска статусу" value={bookCopyStatusLabel(selectedRental.bookCopy.status)} />
                                    <DetailRow label="Төлөмдөр" value={`Ижара ${Number(selectedRental.rentalPrice).toFixed(2)} / Депозит ${Number(selectedRental.depositAmount).toFixed(2)} / Кечиктирүү ${Number(selectedRental.lateFeeAmount).toFixed(2)}`} />
                                    {selectedRental.notes && <div><div className="mb-1 text-edubot-muted">Эскертүү</div><div className="whitespace-pre-wrap rounded-2xl bg-edubot-surfaceAlt p-3 text-edubot-ink">{selectedRental.notes}</div></div>}
                                </div>

                                <div>
                                    <div className="mb-2 flex items-center justify-between">
                                        <h4 className="font-semibold text-edubot-ink">Тарыхы</h4>
                                        <Button onClick={refreshSelectedRental} className="dashboard-button-secondary inline-flex items-center gap-2"><RefreshCw className="h-4 w-4" aria-hidden="true" />Жаңыртуу</Button>
                                    </div>
                                    <div className="grid gap-2">
                                        {(selectedRental.events ?? []).length === 0 ? (
                                            <div className="rounded-2xl border border-edubot-line bg-white p-3 text-sm text-edubot-muted">Ижара окуялары азырынча жазылган жок.</div>
                                        ) : selectedRental.events?.map((event) => (
                                            <div key={event.id} className="rounded-2xl border border-edubot-line bg-white p-3 text-sm shadow-edubot-soft">
                                                <div className="flex justify-between gap-3">
                                                    <span className="font-medium text-edubot-ink">{event.eventType}</span>
                                                    <span className="text-xs text-edubot-muted">{new Date(event.createdAt).toLocaleString()}</span>
                                                </div>
                                                <div className="mt-1 text-edubot-muted">{event.description}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {action && (
                <RentalActionModal
                    action={action}
                    saving={actionSaving}
                    onChange={setAction}
                    onClose={() => setAction(null)}
                    onSubmit={submitAction}
                />
            )}

            <Section title="Физикалык нускалар">
                {loading ? <RentalRowsSkeleton /> : copies.length === 0 ? (
                    <RentalEmptyState title="Физикалык нускалар азырынча жок" description="Нуска жазуулары келечектеги ижара операцияларын колдойт." />
                ) : <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="border-b border-edubot-line bg-edubot-surfaceAlt text-left text-xs uppercase tracking-[0.12em] text-edubot-muted">
                            <tr>
                                <th className="px-4 py-3">Код</th>
                                <th className="px-4 py-3">Китеп</th>
                                <th className="px-4 py-3">Абалы</th>
                                <th className="px-4 py-3">Статус</th>
                                <th className="px-4 py-3">Жайгашкан жери</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-edubot-line">
                            {copies.map((copy) => (
                                <tr key={copy.id} className="bg-white/70 transition hover:bg-edubot-orange/5">
                                    <td className="px-4 py-3 font-medium text-edubot-ink">{copy.copyCode}</td>
                                    <td className="px-4 py-3 text-edubot-muted">{copy.book.title}</td>
                                    <td className="px-4 py-3 text-edubot-muted">{bookCopyConditionLabel(copy.condition)}</td>
                                    <td className="px-4 py-3"><RentalStatusBadge status={copy.status} /></td>
                                    <td className="px-4 py-3 text-edubot-muted">{copy.location || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>}
            </Section>
        </div>
    );
}

function RentalActionModal({
    action,
    saving,
    onChange,
    onClose,
    onSubmit,
}: {
    action: RentalAction;
    saving: boolean;
    onChange: (action: RentalAction) => void;
    onClose: () => void;
    onSubmit: (event: React.FormEvent) => void;
}) {
    const title = action.type === 'return'
        ? 'Ижараны кайтаруу'
        : action.type === 'fee'
            ? 'Кечиктирүү айып акысын жаңыртуу'
            : 'Ижараны жоголду деп белгилөө';

    return (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-black/40 p-4">
            <form onSubmit={onSubmit} className="w-full max-w-lg rounded-2xl border border-edubot-line bg-white p-5 shadow-xl">
                <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                        <h3 className="text-lg font-semibold text-edubot-ink">{title}</h3>
                        <p className="mt-1 text-sm text-edubot-muted">
                            {action.rental.bookCopy.copyCode} - {action.rental.bookCopy.book.title}
                        </p>
                    </div>
                    <Button type="button" onClick={onClose} className="dashboard-button-secondary">Жабуу</Button>
                </div>

                <div className="grid gap-4">
                    {action.type === 'return' && (
                        <Field label="Кайтарылгандагы абалы">
                            <select
                                value={action.condition}
                                onChange={(e) => onChange({ ...action, condition: e.target.value as BookCopyCondition })}
                                className="dashboard-select"
                            >
                                {['NEW', 'GOOD', 'FAIR', 'WORN', 'DAMAGED'].map((value) => <option key={value} value={value}>{bookCopyConditionLabel(value)}</option>)}
                            </select>
                        </Field>
                    )}

                    {action.type === 'fee' && (
                        <Field label="Кечиктирүү айып акысы">
                            <TextInput
                                type="number"
                                min={0}
                                value={action.lateFeeAmount}
                                onChange={(e) => onChange({ ...action, lateFeeAmount: e.target.value === '' ? '' : Number(e.target.value) })}
                            />
                        </Field>
                    )}

                    {action.type === 'lost' && (
                        <div className="flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                            Бул аракет ижараны жана физикалык нусканы жоголду деп белгилейт. Муну кызматкер ырастагандан кийин гана колдонуңуз.
                        </div>
                    )}

                    <Field label="Ички эскертүү">
                        <TextArea
                            value={action.notes}
                            onChange={(e) => onChange({ ...action, notes: e.target.value } as RentalAction)}
                            placeholder="Ижара тарыхы үчүн ички эскертүү кошуңуз"
                        />
                    </Field>
                </div>

                <div className="mt-5 flex justify-end gap-2">
                    <Button type="button" onClick={onClose} className="dashboard-button-secondary">Жокко чыгаруу</Button>
                    <Button type="submit" disabled={saving} className={action.type === 'lost' ? 'rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700' : 'dashboard-button-primary'}>
                        {saving ? 'Сакталып жатат...' : title}
                    </Button>
                </div>
            </form>
        </div>
    );
}

function RentalStatusBadge({ status }: { status: string }) {
    const className = status === 'OVERDUE' || status === 'LOST' || status === 'DAMAGED'
        ? 'border-red-200 bg-red-50 text-red-700'
        : status === 'AVAILABLE' || status === 'RETURNED'
            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
            : 'border-amber-200 bg-amber-50 text-amber-700';
    const label = ['AVAILABLE', 'RESERVED', 'RENTED', 'RETIRED'].includes(status)
        ? bookCopyStatusLabel(status)
        : rentalStatusLabel(status);
    return <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${className}`}>{label}</span>;
}

function RentalRowsSkeleton() {
    return (
        <div className="space-y-3" aria-label="Ижара тизмеси жүктөлүүдө">
            {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="grid gap-3 rounded-2xl border border-edubot-line bg-white p-4 md:grid-cols-[1fr_1fr_1fr]">
                    <div className="h-5 animate-pulse rounded bg-slate-100" />
                    <div className="h-5 animate-pulse rounded bg-slate-100" />
                    <div className="h-5 animate-pulse rounded bg-slate-100" />
                </div>
            ))}
        </div>
    );
}

function RentalEmptyState({ title, description }: { title: string; description: string }) {
    return (
        <div className="rounded-2xl border border-edubot-line bg-white/75 p-8 text-center">
            <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-edubot-orange/10 text-edubot-orange">
                <PackageCheck className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="font-semibold text-edubot-ink">{title}</div>
            <p className="mt-1 text-sm text-edubot-muted">{description}</p>
        </div>
    );
}

function DetailRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
    return (
        <div className="flex justify-between gap-3">
            <span className="text-edubot-muted">{label}</span>
            <span className={`text-right ${strong ? 'font-semibold text-edubot-ink' : 'text-edubot-ink'}`}>{value}</span>
        </div>
    );
}
