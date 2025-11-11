
export const TextInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} className={`rounded border border-border px-3 py-2 text-sm ${props.className ?? ''}`} />
);
export const TextArea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea {...props} className={`min-h-[84px] rounded border border-border px-3 py-2 text-sm ${props.className ?? ''}`} />
);
export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className, children, ...rest }) => (
    <button {...rest} className={`rounded px-3 py-2 text-sm font-semibold disabled:opacity-50 ${className ?? ''}`}>{children}</button>
);
export const Chip: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({ children, onClick }) => (
    <button onClick={onClick} type="button" className="rounded-full border border-border px-2 py-0.5 text-xs text-dark hover:bg-neutral/50">{children}</button>
);
