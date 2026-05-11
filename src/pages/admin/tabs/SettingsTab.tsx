import { Settings } from "lucide-react";
import Section from "../ui/Section";
import Field from "../ui/Field";
import { TextInput, TextArea } from "../ui/Inputs";
import type { StoreSettings } from "./../types";

function SettingsTab() {
    const data: StoreSettings = {
        storeName: 'EduBook',
        pickupAddress: 'Киев көчөсү 115, Бишкек',
        phones: ['+996 700 123 456'],
        telegram: {},
    };

    return (
        <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2 rounded-2xl border border-edubot-line bg-edubot-surfaceAlt p-4 text-sm leading-6 text-edubot-muted">
                Дүкөн жөндөөлөрү азырынча базага сакталбайт. Операциялык маалыматтарды азырынча чөйрө жөндөөлөрүндө калтырыңыз; EduBot, EduPro, CRM жана билдирүү интеграциялары кийинки этапка калтырылган.
            </div>
            <Section title="Дүкөн профили">
                <div className="grid gap-3">
                    <Field label="Дүкөндүн аталышы"><TextInput value={data.storeName || ''} readOnly /></Field>
                    <Field label="Өзү алып кетүү дареги"><TextArea value={data.pickupAddress || ''} readOnly /></Field>
                    <Field label="Телефон номерлери" hint="Үтүр менен бөлүп жазыңыз">
                        <TextInput value={(data.phones || []).join(', ')} readOnly />
                    </Field>
                </div>
            </Section>

            <Section title="Telegram">
                <div className="grid gap-3">
                    <div className="rounded-2xl border border-edubot-line bg-edubot-surfaceAlt p-4 text-sm leading-6 text-edubot-muted">
                            Telegram билдирүү жөндөөлөрү милдеттүү эмес жана кийинки этапка калтырылган EduBot/EduPro/CRM интеграцияларынан өзүнчө.
                    </div>
                    <Field label="Бот токени"><TextInput value={data.telegram?.botToken || ''} readOnly placeholder="Жөндөлгөн эмес" /></Field>
                    <Field label="Коомдук канал ID"><TextInput value={data.telegram?.publicChannelId || ''} readOnly placeholder="Жөндөлгөн эмес" /></Field>
                    <Field label="Башкаруучу чат ID"><TextInput value={data.telegram?.adminChatId || ''} readOnly placeholder="Жөндөлгөн эмес" /></Field>
                    <div className="text-xs text-edubot-muted">Бул жөндөөнү дүкөн билдирүүлөрү иштетилгенде гана колдонуңуз.</div>
                </div>
            </Section>

            <div className="md:col-span-2 flex items-center gap-2 rounded-2xl border border-edubot-line bg-white p-4 text-sm text-edubot-muted">
                <Settings className="h-4 w-4 text-edubot-orange" aria-hidden="true" />
                Сервер аркылуу сакталган жөндөөлөр операциялык талаптар такталганда кийинки жаңыртууда кошулат.
            </div>
        </div>
    );
}

export default SettingsTab;
