import React from "react";
import { Mail, Send } from "lucide-react";

export default function Newsletter() {
    const [email, setEmail] = React.useState("");
    const [submitted, setSubmitted] = React.useState(false);

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitted(true);
        setEmail("");
    };

    return (
        <section className="bg-white">
            <div className="mx-auto max-w-6xl px-4 py-14">
                <div className="overflow-hidden rounded-2xl border border-edubot-line bg-edubot-surfaceAlt shadow-edubot-card">
                    <div className="grid gap-0 lg:grid-cols-[1fr_460px]">
                        <div className="bg-edubot-hero p-8 text-white md:p-10">
                            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/75">Ата-энелер жана окуучулар үчүн жаңылыктар</p>
                            <h3 className="mt-4 max-w-2xl text-3xl font-semibold leading-tight md:text-[40px]">
                                Пайдалуу китеп тизмелерин жана окуу материалдары тууралуу жаңылыктарды алыңыз.
                            </h3>
                            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/78">
                                Бул бөлүк келечектеги email провайдерине даяр. Аны мектепке даярдык, жаңы китептер жана курс окуу тизмелери үчүн колдонуңуз.
                            </p>
                        </div>

                        <form onSubmit={onSubmit} className="flex flex-col justify-center gap-4 bg-white p-6 md:p-8">
                            <label className="grid gap-2 text-sm">
                                <span className="font-semibold text-edubot-ink">Email дареги</span>
                                <span className="relative">
                                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-edubot-muted" aria-hidden="true" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(event) => {
                                            setEmail(event.target.value);
                                            setSubmitted(false);
                                        }}
                                        placeholder="parent@example.com"
                                        className="dashboard-field dashboard-field-icon"
                                    />
                                </span>
                            </label>
                            <button type="submit" className="dashboard-button-primary-lg">
                                <Send className="h-4 w-4" aria-hidden="true" />
                                Жаңылыктарды алуу
                            </button>
                            <p className="text-xs leading-5 text-edubot-muted">
                                Email кызматы азырынча туташкан эмес. Маркетинг процесси даяр болгондо бул форманы тандалган провайдерге туташтырыңыз.
                            </p>
                            {submitted ? (
                                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                                    Email азырынча локалдуу кабыл алынды. Провайдер интеграциясы кийинкиге калтырылган.
                                </div>
                            ) : null}
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}
