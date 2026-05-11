const Field: React.FC<{ label: string; children: React.ReactNode; hint?: string }> = ({ label, children, hint }) => (
    <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium text-edubot-ink">{label}</span>
        {children}
        {hint && <span className="text-[11px] text-edubot-muted">{hint}</span>}
    </label>
);

export default Field;
