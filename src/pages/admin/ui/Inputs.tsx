
export const TextInput = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} className={`dashboard-field ${props.className ?? ''}`} />
);
export const TextArea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea {...props} className={`dashboard-field min-h-[84px] ${props.className ?? ''}`} />
);
export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className, children, ...rest }) => (
    <button {...rest} className={`rounded-2xl px-3 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${className ?? ''}`}>{children}</button>
);
export const Chip: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({ children, onClick }) => (
    <button onClick={onClick} type="button" className="rounded-full border border-edubot-line px-2 py-0.5 text-xs text-edubot-ink hover:border-edubot-orange hover:bg-edubot-orange/10">{children}</button>
);
