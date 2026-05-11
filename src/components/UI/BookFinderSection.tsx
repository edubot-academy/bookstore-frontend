import React from "react";
import { ArrowRight, BookOpenCheck, GraduationCap, Languages, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { trackEvent } from "../../lib/analytics";
import type { BookType } from "../../lib/types";

type Option<T extends string> = {
    label: string;
    value: T;
    description?: string;
};

type GoalValue = "english" | "exam" | "programming" | "children";
type AudienceValue = "parent" | "student" | "teacher" | "center";
type LevelValue = "beginner" | "intermediate" | "advanced";
type LanguageValue = "" | "Kyrgyz" | "Russian" | "English";

const audiences: Option<AudienceValue>[] = [
    { label: "Ата-эне", value: "parent" },
    { label: "Окуучу", value: "student" },
    { label: "Мугалим", value: "teacher" },
    { label: "Окуу борбору", value: "center" },
];

const goals: Array<Option<GoalValue> & { bookType: BookType; subject: string }> = [
    { label: "Англис тили", value: "english", bookType: "LANGUAGE_LEARNING", subject: "Англис тили", description: "Грамматика, сөз байлыгы, сүйлөө практикасы" },
    { label: "Экзаменге даярдык", value: "exam", bookType: "EXAM_PREP", subject: "Экзамен", description: "Тесттер, кайталоо, жооп ачкычтары" },
    { label: "Программалоо", value: "programming", bookType: "PROGRAMMING", subject: "Программалоо", description: "Python, веб, IT негиздери" },
    { label: "Балдар билими", value: "children", bookType: "CHILDREN_EDUCATION", subject: "Балдар", description: "Окуу, жазуу, кызыктыруучу материалдар" },
];

const levels: Option<LevelValue>[] = [
    { label: "Баштапкы", value: "beginner" },
    { label: "Орто", value: "intermediate" },
    { label: "Жогорку", value: "advanced" },
];

const languages: Option<LanguageValue>[] = [
    { label: "Баары", value: "" },
    { label: "Кыргызча", value: "Kyrgyz" },
    { label: "Орусча", value: "Russian" },
    { label: "Англисче", value: "English" },
];

export default function BookFinderSection() {
    const navigate = useNavigate();
    const [audience, setAudience] = React.useState<AudienceValue>("parent");
    const [goal, setGoal] = React.useState<GoalValue>("english");
    const [level, setLevel] = React.useState<LevelValue>("beginner");
    const [language, setLanguage] = React.useState<LanguageValue>("");

    const selectedGoal = goals.find((item) => item.value === goal) ?? goals[0];

    const submit = () => {
        const params = new URLSearchParams();
        params.set("bookType", selectedGoal.bookType);
        if (language) params.set("language", language);
        trackEvent("guided_finder_submit", { audience, goal, level, language: language || "all" });
        navigate(`/catalog?${params.toString()}`);
    };

    return (
        <section className="bg-white">
            <div className="mx-auto max-w-6xl px-4 py-12">
                <div className="grid gap-6 rounded-2xl border border-edubot-line bg-edubot-surfaceAlt p-5 shadow-edubot-card lg:grid-cols-[0.9fr_1.1fr] lg:p-7">
                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-edubot-orange">
                            <BookOpenCheck className="h-4 w-4" aria-hidden="true" />
                            Китеп тандоо жардамчысы
                        </div>
                        <h2 className="mt-4 text-3xl font-semibold leading-tight text-edubot-ink">
                            Максатыңызды тандаңыз, биз ылайыктуу каталогду ачабыз
                        </h2>
                        <p className="mt-3 text-sm leading-6 text-edubot-muted">
                            Ата-энелер, окуучулар жана окуу борборлору китепти предмет, деңгээл жана тил боюнча тез тандай алышы үчүн кыска жол.
                        </p>
                    </div>

                    <div className="grid gap-4">
                        <ChoiceGroup icon={<GraduationCap className="h-4 w-4" />} label="Ким үчүн?" options={audiences} value={audience} onChange={setAudience} />
                        <ChoiceGroup icon={<Target className="h-4 w-4" />} label="Окуу максаты" options={goals} value={goal} onChange={setGoal} />
                        <div className="grid gap-4 md:grid-cols-2">
                            <ChoiceGroup label="Деңгээл" options={levels} value={level} onChange={setLevel} compact />
                            <ChoiceGroup icon={<Languages className="h-4 w-4" />} label="Тил" options={languages} value={language} onChange={setLanguage} compact />
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4">
                            <p className="max-w-xl text-sm leading-6 text-edubot-muted">
                                {selectedGoal.description}. Каталог багыт жана тил боюнча ачылат, деңгээлди китеп карточкасынан же WhatsApp аркылуу тактай аласыз.
                            </p>
                            <button type="button" onClick={submit} className="dashboard-button-primary">
                                Сунуштарды көрүү
                                <ArrowRight className="h-4 w-4" aria-hidden="true" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function ChoiceGroup<T extends string>({
    icon,
    label,
    options,
    value,
    onChange,
    compact = false,
}: {
    icon?: React.ReactNode;
    label: string;
    options: Option<T>[];
    value: T;
    onChange: (value: T) => void;
    compact?: boolean;
}) {
    return (
        <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-edubot-ink">
                {icon}
                {label}
            </div>
            <div className={`grid gap-2 ${compact ? "grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-4"}`}>
                {options.map((option) => (
                    <button
                        key={option.value || "all"}
                        type="button"
                        onClick={() => onChange(option.value)}
                        className={`rounded-2xl border px-3 py-2 text-left text-sm font-semibold transition ${value === option.value
                            ? "border-edubot-orange bg-edubot-orange/10 text-edubot-orange"
                            : "border-edubot-line bg-white text-edubot-ink hover:border-edubot-orange/60"
                            }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
