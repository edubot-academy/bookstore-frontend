const Section: React.FC<React.PropsWithChildren<{ title: string; actions?: React.ReactNode }>> = ({ title, actions, children }) => (
    <section className="rounded-xl border border-border bg-white p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-dark">{title}</h2>
            {actions}
        </div>
        {children}
    </section>
);

export default Section;
