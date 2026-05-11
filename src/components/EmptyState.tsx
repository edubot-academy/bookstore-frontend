type Props = {
    title?: string;
    description?: string;
    action?: React.ReactNode; // e.g. a <Link> or <button>
    className?: string;
};

export default function EmptyState({
    title = 'Натыйжа табылган жок',
    description = 'Издөөнү кеңейтип, чыпканы алып салыңыз же каталогго кайтыңыз.',
    action,
    className = '',
}: Props) {
    return (
        <div className={`flex flex-col items-center justify-center rounded-2xl border border-edubot-line bg-white p-10 text-center shadow-edubot-soft ${className}`}>
            <div className="mb-3 rounded-full border border-edubot-orange/20 bg-edubot-orange/10 p-3 text-edubot-orange">
                <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
                    <path fill="currentColor" d="M21 21L16.65 16.65M19 11A8 8 0 1 1 3 11a8 8 0 0 1 16 0" />
                </svg>
            </div>
            <h3 className="text-lg font-semibold text-edubot-ink">{title}</h3>
            <p className="mt-1 max-w-md text-sm text-edubot-muted">{description}</p>
            {action ? <div className="mt-4">{action}</div> : null}
        </div>
    );
}
