import { MapPin, MessageCircle, Phone } from 'lucide-react';

interface TopBarProps {
    phone: string;
}

function TopBar({ phone }: TopBarProps) {
    return (
        <div className="w-full bg-edubot-dark text-sm text-white">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-2.5">
                <a href={`tel:${phone.replace(/\s/g, '')}`} className="flex items-center gap-2 text-white hover:text-edubot-soft">
                    <Phone size={16} className="text-white" />
                    <span className="font-medium">{phone}</span>
                </a>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-white/80">
                    <span className="inline-flex items-center gap-1.5"><MapPin size={14} /> Бишкектен өзү алып кетүү</span>
                    <a href="https://wa.me/996700123456" className="inline-flex items-center gap-1.5 text-white/80 hover:text-edubot-soft">
                        <MessageCircle size={14} /> WhatsApp аркылуу ырастоо
                    </a>
                </div>
            </div>
        </div>
    );
}

export default TopBar;
