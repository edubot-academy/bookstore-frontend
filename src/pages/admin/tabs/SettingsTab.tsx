import React from "react";
import Section from "../ui/Section";
import Field from "../ui/Field";
import { TextInput, Button, TextArea } from "../ui/Inputs";
import { api } from "../../../lib/api";
import type { StoreSettings } from "./../types";

async function getSettings() {
    const { data } = await api.get('/admin/settings');
    return data as StoreSettings;
}
async function saveSettings(body: StoreSettings) {
    const { data } = await api.put('/admin/settings', body);
    return data as StoreSettings;
}

function SettingsTab() {
    const [data, setData] = React.useState<StoreSettings>({ telegram: {} });
    const [loading, setLoading] = React.useState(true);
    const [saving, setSaving] = React.useState(false);

    React.useEffect(() => { (async () => { try { setData(await getSettings()); } finally { setLoading(false); } })(); }, []);

    const update = (patch: Partial<StoreSettings>) => setData(prev => ({ ...(prev || {}), ...patch }));

    const save = async () => { setSaving(true); try { await saveSettings(data); } finally { setSaving(false); } };

    if (loading) return <div className="text-text-muted">Loading…</div>;

    return (
        <div className="grid gap-4 md:grid-cols-2">
            <Section title="Store Profile">
                <div className="grid gap-3">
                    <Field label="Store Name"><TextInput value={data.storeName || ''} onChange={(e) => update({ storeName: e.target.value })} /></Field>
                    <Field label="Pickup Address"><TextArea value={data.pickupAddress || ''} onChange={(e) => update({ pickupAddress: e.target.value })} /></Field>
                    <Field label="Phone(s)" hint="Comma-separated">
                        <TextInput value={(data.phones || []).join(', ')} onChange={(e) => update({ phones: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
                    </Field>
                </div>
            </Section>

            <Section title="Telegram">
                <div className="grid gap-3">
                    <Field label="Bot Token"><TextInput value={data.telegram?.botToken || ''} onChange={(e) => update({ telegram: { ...(data.telegram || {}), botToken: e.target.value } })} /></Field>
                    <Field label="Public Channel ID"><TextInput value={data.telegram?.publicChannelId || ''} onChange={(e) => update({ telegram: { ...(data.telegram || {}), publicChannelId: e.target.value } })} /></Field>
                    <Field label="Admin Chat ID"><TextInput value={data.telegram?.adminChatId || ''} onChange={(e) => update({ telegram: { ...(data.telegram || {}), adminChatId: e.target.value } })} /></Field>
                    <div className="text-xs text-text-muted">Use this to publish new books & notify order events.</div>
                </div>
            </Section>

            <div className="md:col-span-2 flex justify-end">
                <Button onClick={save} disabled={saving} className="bg-dark text-white">{saving ? 'Saving…' : 'Save Settings'}</Button>
            </div>
        </div>
    );
}

export default SettingsTab;
