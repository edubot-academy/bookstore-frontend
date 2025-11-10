import React from "react";

export default function Newsletter() {
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // TODO: integrate your email provider (Mailchimp/Resend/etc.)
        alert("Subscribed!");
    };

    return (
        <section className="bg-white">
            <div className="mx-auto w-full py-14">
                <div className="relative bg-secondary md:px-10 md:pb-20">
                    {/* decorative corner squares */}
                    <DecorativeDots />

                    {/* primary banner */}
                    <div className="bg-primary px-6 py-10 text-center text-white md:px-10 md:py-14">
                        <h3 className="text-3xl font-extrabold md:text-[40px]">
                            Subscribe to Our Newsletter
                        </h3>
                        <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-white/90">
                            Sed eu feugiat amet, libero ipsum enim pharetra hac dolor sit amet,
                            consectetur. Elit adipiscing enim pharetra hac.
                        </p>
                    </div>

                    {/* floating form */}
                    <form
                        onSubmit={onSubmit}
                        className="mx-auto -mt-6 flex max-w-2xl items-center gap-0 overflow-hidden bg-white shadow-[0_12px_30px_rgba(0,0,0,0.08)] ring-1 ring-border md:-mt-8"
                    >
                        <span className="grid h-12 w-12 place-items-center border-r border-border bg-neutral/40">
                            {/* mail icon */}
                            <svg width="22" height="22" viewBox="0 0 24 24" className="text-dark">
                                <path
                                    d="M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1zm0 0l8 6 8-6"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </span>
                        <input
                            type="email"
                            required
                            placeholder="youremail123@gmail.com"
                            className="w-full px-4 py-3 text-[15px] text-text-main placeholder:text-text-muted focus:outline-none"
                        />
                        <button
                            type="submit"
                            className="h-12 shrink-0 rounded-none bg-primary px-6 text-sm font-bold tracking-[0.18em] text-white transition hover:bg-primary-dark md:px-8"
                        >
                            SUBSCRIBE
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}

/* tiny background squares; purely decorative */
function DecorativeDots() {
    const Dot = ({ className = "" }: { className?: string }) => (
        <span className={`inline-block h-3 w-3 rounded-sm ${className}`} />
    );
    return (
        <div
            aria-hidden
            className="pointer-events-none absolute inset-0 select-none"
        >
            <div className="absolute left-4 top-4 flex gap-2">
                <Dot className="bg-accent" />
                <Dot className="bg-primary" />
                <Dot className="bg-white/60 ring-1 ring-border" />
            </div>
            <div className="absolute right-6 top-1/2 hidden translate-y-[-50%] gap-3 md:flex">
                <Dot className="bg-white/60 ring-1 ring-border" />
                <Dot className="bg-primary/80" />
                <Dot className="bg-accent/80" />
            </div>
            <div className="absolute bottom-6 left-6 hidden gap-3 md:flex">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Dot key={i} className="bg-white/60 ring-1 ring-border" />
                ))}
            </div>
        </div>
    );
}
