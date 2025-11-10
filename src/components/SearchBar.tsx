import * as React from 'react';

type Props = {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    debounceMs?: number;
};

export default function SearchBar({ value, onChange, placeholder = 'Издөө', debounceMs = 300 }: Props) {
    const [internal, setInternal] = React.useState(value);

    // keep internal synced when parent resets search
    React.useEffect(() => { setInternal(value); }, [value]);

    // debounce propagate
    React.useEffect(() => {
        const id = setTimeout(() => onChange(internal.trim()), debounceMs);
        return () => clearTimeout(id);
    }, [internal, debounceMs, onChange]);

    return (
        <div className="flex items-center gap-2 rounded-2xl border bg-white px-3 py-2 shadow-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden className="opacity-60">
                <path fill="currentColor" d="M21 21L16.65 16.65M19 11A8 8 0 1 1 3 11a8 8 0 0 1 16 0" />
            </svg>
            <input
                aria-label="Search books"
                value={internal}
                onChange={(e) => setInternal(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-transparent outline-none placeholder:text-gray-400"
            />
            {internal && (
                <button
                    type="button"
                    onClick={() => setInternal('')}
                    className="rounded-full px-2 py-1 text-xs text-gray-500 hover:bg-gray-100"
                >
                    тазалоо
                </button>
            )}
        </div>
    );
}
