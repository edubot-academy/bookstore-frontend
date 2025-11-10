import { Phone, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

interface TopBarProps {
    phone: string;
}

function TopBar({ phone }: TopBarProps) {
    return (
        <div className="w-full bg-[#37327A] text-white text-sm">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                {/* Left side: phone */}
                <div className="flex items-center gap-2">
                    <Phone size={16} className="text-white" />
                    <span className="font-medium">{phone}</span>
                </div>

                {/* Right side: social icons */}
                <div className="flex items-center gap-4">
                    <a href="#" className="hover:text-primary transition">
                        <Facebook size={16} className="text-white" />
                    </a>
                    <a href="#" className="hover:text-primary transition">
                        <Instagram size={16} className="text-white" />
                    </a>
                    <a href="#" className="hover:text-primary transition">
                        <Linkedin size={16} className="text-white" />
                    </a>
                    <a href="#" className="hover:text-primary transition">
                        <Twitter size={16} className="text-white" />
                    </a>
                </div>
            </div>
        </div>
    );
}

export default TopBar;
