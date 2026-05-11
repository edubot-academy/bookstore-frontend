import { type JSX, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, A11y } from 'swiper/modules';
import programmingIt from '../../assets/programming_it.png';
import englishLearning from '../../assets/english_learning.png';
import examPrep from '../../assets/exam_prep.png';
import childrensEdu from '../../assets/childrens_edu.png';
import 'swiper/css';
import 'swiper/css/navigation';

type Category = { id: number; title: string; image: string; url: string };

// expect CATEGORIES to be provided from parent/file scope

const CATEGORIES: Category[] = [
    { id: 1, title: 'Программалоо жана IT', image: programmingIt, url: '/catalog?bookType=PROGRAMMING' },
    { id: 2, title: 'Англис тили', image: englishLearning, url: '/catalog?bookType=LANGUAGE_LEARNING' },
    { id: 3, title: 'Экзаменге даярдык', image: examPrep, url: '/catalog?bookType=EXAM_PREP' },
    { id: 4, title: 'Балдар билими', image: childrensEdu, url: '/catalog?bookType=CHILDREN_EDUCATION' },
];

export default function CategoriesSection(): JSX.Element | null {
    const prevRef = useRef<HTMLButtonElement | null>(null);
    const nextRef = useRef<HTMLButtonElement | null>(null);

    if (CATEGORIES.length === 0) return null;

    return (
        <section className="bg-white">
            <div className="mx-auto max-w-6xl px-4 py-14">
                {/* Top row: label + heading + arrows */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <div className="mb-3 flex items-center gap-3">
                            <span className="h-[2px] w-10 bg-primary" />
                            <span className="text-sm font-semibold tracking-widest text-primary uppercase">
                                Категориялар
                            </span>
                        </div>
                        <h2 className="text-3xl font-semibold leading-tight text-edubot-ink md:text-[40px]">
                            Окуу максаты боюнча тандаңыз
                        </h2>
                    </div>

                    <div className="hidden items-center gap-4 md:flex">
                        <button
                            ref={prevRef}
                            aria-label="Мурунку категориялар"
                            className="grid h-12 w-12 place-items-center rounded-full border border-edubot-line bg-white text-edubot-ink transition hover:border-primary hover:text-primary"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            ref={nextRef}
                            aria-label="Кийинки категориялар"
                            className="grid h-12 w-12 place-items-center rounded-full bg-primary text-white shadow-edubot-soft transition hover:bg-primary-dark"
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
                                <div className="mt-5 text-center text-2xl font-semibold text-edubot-ink">
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
                        className="dashboard-button-secondary inline-flex items-center gap-3"
                    >
                        <span className="text-sm font-semibold tracking-widest">КӨБҮРӨӨК КӨРҮҮ</span>
                        <ArrowRight size={16} />
                    </a>
                </div>
            </div>
        </section>
    );
}
