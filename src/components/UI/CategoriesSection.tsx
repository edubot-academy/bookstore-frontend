import { type JSX, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, A11y } from 'swiper/modules';
import category_1 from '../../assets/category_1.png';
import category_2 from '../../assets/category_2.png';
import category_3 from '../../assets/category_3.png';
import category_4 from '../../assets/category_1.png';
import 'swiper/css';
import 'swiper/css/navigation';

type Category = { id: number; title: string; image: string; url: string };

// expect CATEGORIES to be provided from parent/file scope

const CATEGORIES: Category[] = [
    { id: 1, title: 'Higher Education', image: category_1, url: '/catalog?category=higher-education' },
    { id: 2, title: 'Management Books', image: category_2, url: '/catalog?category=management' },
    { id: 3, title: 'Engineering Books', image: category_3, url: '/catalog?category=engineering' },
    { id: 4, title: 'Literature', image: category_4, url: '/catalog?category=literature' },
];

export default function CategoriesSection(): JSX.Element {
    const prevRef = useRef<HTMLButtonElement | null>(null);
    const nextRef = useRef<HTMLButtonElement | null>(null);

    return (
        <section className="bg-white">
            <div className="mx-auto max-w-6xl px-4 py-14">
                {/* Top row: label + heading + arrows */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <div className="mb-3 flex items-center gap-3">
                            <span className="h-[2px] w-10 bg-primary" />
                            <span className="text-sm font-semibold tracking-widest text-primary uppercase">
                                Categories
                            </span>
                        </div>
                        <h2 className="text-3xl font-extrabold leading-tight text-dark md:text-[40px]">
                            Explore our Top Categories
                        </h2>
                    </div>

                    <div className="hidden items-center gap-4 md:flex">
                        <button
                            ref={prevRef}
                            aria-label="Previous categories"
                            className="grid h-12 w-12 place-items-center rounded-full border border-border bg-white text-dark hover:text-primary hover:border-primary transition"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            ref={nextRef}
                            aria-label="Next categories"
                            className="grid h-12 w-12 place-items-center rounded-full border border-border bg-white text-white bg-primary hover:bg-primary-dark transition"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                {/* Carousel (1/2/3 per view) */}
                <Swiper
                    modules={[Navigation, A11y]}
                    spaceBetween={24}
                    breakpoints={{
                        0: { slidesPerView: 1 },
                        640: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                    onBeforeInit={(swiper) => {
                        // @ts-expect-error runtime ok
                        swiper.params.navigation.prevEl = prevRef.current;
                        // @ts-expect-error runtime ok
                        swiper.params.navigation.nextEl = nextRef.current;
                    }}
                    navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
                >
                    {CATEGORIES.map((c) => (
                        <SwiperSlide key={c.id}>
                            <a
                                href={c.url}
                                className="group block"
                            >
                                <div className="overflow-hidden rounded-2xl">
                                    <img
                                        src={c.image}
                                        alt={c.title}
                                        className="h-[260px] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="mt-5 text-center text-2xl font-semibold text-dark">
                                    {c.title}
                                </div>
                            </a>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* View more button */}
                <div className="mt-12 flex justify-center">
                    <a
                        href="/catalog"
                        className="inline-flex items-center gap-3 rounded-xl border border-dark px-8 py-3 text-dark hover:border-primary hover:text-primary transition"
                    >
                        <span className="text-sm font-semibold tracking-widest">VIEW MORE</span>
                        <ArrowRight size={16} />
                    </a>
                </div>
            </div>
        </section>
    );
}
