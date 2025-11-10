type Props = {
    title?: string;
    description?: string;
    action?: React.ReactNode; // e.g. a <Link> or <button>
    className?: string;
};

export default function EmptyState({
    title = 'Эч нерсе табылган жок',
    description = 'Кийинкисин издеп көрүңүз же фильтрлерди өзгөртүңүз.',
    action,
    className = '',
}: Props) {
    return (
        <div className={`flex flex-col items-center justify-center rounded-2xl border bg-white p-10 text-center ${className}`}>
            <div className="mb-3 rounded-full border p-3">
                <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
                    <path fill="currentColor" d="M21 21L16.65 16.65M19 11A8 8 0 1 1 3 11a8 8 0 0 1 16 0" />
                </svg>
            </div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="mt-1 max-w-md text-sm text-gray-600">{description}</p>
            {action ? <div className="mt-4">{action}</div> : null}
        </div>
    );
}
