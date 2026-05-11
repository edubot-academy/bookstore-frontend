import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import BookCard from "../BookCard";
import { listBooks } from "../../lib/api";

export default function NewReleasesSection() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["home-new-books"],
        queryFn: () => listBooks({ page: 1, limit: 4, sort: "new" }),
    });
    const books = data?.items ?? [];

    if (!isLoading && (isError || books.length === 0)) return null;

    return (
        <section className="bg-white">
            <div className="mx-auto max-w-6xl px-4 py-16">
                <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <div className="mb-3 flex items-center gap-3">
                            <span className="h-[2px] w-10 bg-primary" />
                            <span className="text-sm font-semibold uppercase tracking-widest text-primary">
                                Жаңы каталог
                            </span>
                        </div>
                        <h2 className="text-3xl font-semibold tracking-tight text-edubot-ink md:text-[40px]">
                            Жаңы кошулган окуу китептери
                        </h2>
                        <p className="mt-2 max-w-2xl text-sm text-edubot-muted">
                            EduBook каталогуна жаңы кошулган китептер. Алып кетүү же жеткирүү командабыз менен такталат.
                        </p>
                    </div>
                    <Link to="/catalog?sort=new" className="dashboard-button-secondary inline-flex">
                        Каталогду көрүү
                    </Link>
                </div>

                {isLoading ? (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <div key={index} className="h-[420px] animate-pulse rounded-2xl bg-edubot-surfaceAlt" />
                        ))}
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {books.map((book) => (
                            <BookCard key={book.id} b={book} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
