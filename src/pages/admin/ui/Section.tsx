const Section: React.FC<React.PropsWithChildren<{ title: string; actions?: React.ReactNode }>> = ({ title, actions, children }) => (
    <section className="dashboard-panel p-4">
        <div className="relative z-[1] mb-3 flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-edubot-ink">{title}</h2>
            {actions}
        </div>
        <div className="relative z-[1]">{children}</div>
    </section>
);

export default Section;
