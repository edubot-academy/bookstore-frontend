const Field: React.FC<{ label: string; children: React.ReactNode; hint?: string }> = ({ label, children, hint }) => (
    <label className="flex flex-col gap-1 text-sm">
        <span className="text-dark font-medium">{label}</span>
        {children}
        {hint && <span className="text-[11px] text-text-muted">{hint}</span>}
    </label>
);

export default Field;
