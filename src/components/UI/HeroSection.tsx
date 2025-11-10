import { type JSX, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, A11y } from 'swiper/modules';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import heroBook from '../../assets/hero-book.png';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface HeroSlide {
    title: string;
    paragraph: string;
    ctaText: string;
    ctaUrl: string;
    img: string;
}

const HERO_SLIDES: HeroSlide[] = [
    {
        title: 'Ipsum Dolor Si',
        paragraph:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed eu feugiat amet, libero ipsum enim pharetra hac. Urna commodo, lacus ut magna velit eleifend.',
        ctaText: 'READ MORE',
        ctaUrl: '/catalog',
        img: heroBook,
    },
    {
        title: 'The Assignment',
        paragraph: 'A bright, engaging novel to spark your imagination and curiosity every day.',
        ctaText: 'READ MORE',
        ctaUrl: '/catalog',
        img: heroBook,
    },
];

export default function HeroSection(): JSX.Element {
    const prevRef = useRef<HTMLButtonElement | null>(null);
    const nextRef = useRef<HTMLButtonElement | null>(null);

    return (
        <section className="w-full bg-gradient-to-tr from-secondary via-white to-white">
            <div className="relative">
                {/* Custom arrows */}
                <button
                    ref={prevRef}
                    aria-label="Previous slide"
                    title="Previous"
                    className={[
                        // position
                        'absolute left-3 top-1/2 -translate-y-1/2 z-10',
                        // shape
                        'grid h-12 w-12 place-items-center rounded-full border border-primary bg-white',
                        // visuals
                        'text-primary shadow/50 shadow-sm backdrop-blur',
                        // states
                        'transition transform hover:scale-[1.04] hover:shadow-md active:scale-95',
                        // accessibility focus
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
                        // small screens: slightly smaller
                        'md:h-12 md:w-12 h-10 w-10',
                    ].join(' ')}
                >
                    <ChevronLeft size={20} strokeWidth={2.25} />
                </button>

                <button
                    ref={nextRef}
                    aria-label="Next slide"
                    title="Next"
                    className={[
                        'absolute right-3 top-1/2 -translate-y-1/2 z-10',
                        'grid h-12 w-12 place-items-center rounded-full border border-primary bg-white',
                        'text-primary shadow/50 shadow-sm backdrop-blur',
                        'transition transform hover:scale-[1.04] hover:shadow-md active:scale-95',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
                        'md:h-12 md:w-12 h-10 w-10',
                    ].join(' ')}
                >
                    <ChevronRight size={20} strokeWidth={2.25} />
                </button>

                <Swiper
                    modules={[Navigation, Pagination, Autoplay, A11y]}
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 5000 }}
                    loop
                    onBeforeInit={(swiper) => {
                        // @ts-expect-error: swiper types allow these at runtime
                        swiper.params.navigation.prevEl = prevRef.current;
                        // @ts-expect-error
                        swiper.params.navigation.nextEl = nextRef.current;
                    }}
                    navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
                    className={[
                        // pagination styling
                        '[&_.swiper-pagination-bullet]:!h-3 [&_.swiper-pagination-bullet]:!w-3',
                        '[&_.swiper-pagination-bullet]:!bg-gray-300',
                        '[&_.swiper-pagination-bullet-active]:!bg-primary',
                        '[&_.swiper-pagination]:!bottom-6',
                    ].join(' ')}
                >
                    {HERO_SLIDES.map((s, idx) => (
                        <SwiperSlide key={idx}>
                            <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-6 py-16 md:grid-cols-2 md:px-12">
                                {/* text */}
                                <div className="order-2 md:order-1">
                                    <h1 className="mb-4 text-4xl font-extrabold leading-tight text-dark md:text-6xl">
                                        {s.title}
                                    </h1>
                                    <p className="mb-8 max-w-xl text-lg leading-8 text-text-muted">{s.paragraph}</p>
                                    <a
                                        href={s.ctaUrl}
                                        className="inline-flex items-center gap-3 rounded-xl border border-dark px-6 py-3 text-dark transition-colors hover:border-primary hover:text-primary"
                                    >
                                        <span className="text-sm font-semibold tracking-widest">{s.ctaText}</span>
                                        <ArrowRight size={16} />
                                    </a>
                                </div>

                                {/* image */}
                                <div className="order-1 flex justify-center md:order-2">
                                    <img
                                        src={s.img}
                                        alt={s.title}
                                        className="h-[320px] w-auto object-contain md:h-[500px]"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
}
