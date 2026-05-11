import * as React from 'react';

type Props = {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    debounceMs?: number;
};

export default function SearchBar({ value, onChange, placeholder = 'Китеп издөө', debounceMs = 300 }: Props) {
    const [internal, setInternal] = React.useState(value);

    // keep internal synced when parent resets search
    React.useEffect(() => { setInternal(value); }, [value]);

    // debounce propagate
    React.useEffect(() => {
        const id = setTimeout(() => onChange(internal.trim()), debounceMs);
        return () => clearTimeout(id);
    }, [internal, debounceMs, onChange]);

    return (
        <div className="flex items-center gap-2 rounded-2xl border border-edubot-line bg-white px-3 py-2 shadow-edubot-soft">
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden className="opacity-60">
                <path fill="currentColor" d="M21 21L16.65 16.65M19 11A8 8 0 1 1 3 11a8 8 0 0 1 16 0" />
            </svg>
            <input
                aria-label="Китеп издөө"
                value={internal}
                onChange={(e) => setInternal(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-transparent text-edubot-ink outline-none placeholder:text-edubot-muted"
            />
            {internal && (
                <button
                    type="button"
                    onClick={() => setInternal('')}
                    className="rounded-full px-2 py-1 text-xs font-semibold text-edubot-muted hover:bg-edubot-surfaceAlt hover:text-edubot-orange"
                >
                    Тазалоо
                </button>
            )}
        </div>
    );
}
