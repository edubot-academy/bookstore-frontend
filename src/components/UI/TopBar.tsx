import { MapPin, MessageCircle, Phone } from 'lucide-react';
import { BUSINESS, whatsappUrl } from '../../lib/business';

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
                    <a href={BUSINESS.mapUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-white/80 hover:text-edubot-soft"><MapPin size={14} /> {BUSINESS.address}</a>
                    <a href={whatsappUrl("Саламатсызбы, EduBook боюнча суроом бар.")} className="inline-flex items-center gap-1.5 text-white/80 hover:text-edubot-soft">
                        <MessageCircle size={14} /> WhatsApp аркылуу ырастоо
                    </a>
                </div>
            </div>
        </div>
    );
}

export default TopBar;
