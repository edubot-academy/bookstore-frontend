import { Link } from "react-router-dom";
import bookstore_logo from "../assets/bookstore_logo.svg";

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="relative bg-primary-dark text-white">
            {/* decorative corner squares */}
            <DotsDecor />

            <div className="mx-auto max-w-6xl grid gap-12 px-6 py-16 md:grid-cols-3">
                {/* left: logo + blurb + socials */}
                <div className="space-y-8">
                    <div className="flex items-center gap-3">
                        {/* simple book/logo mark */}
                        <img src={bookstore_logo} alt="Bookstore Logo" className="shrink-0" />
                        <span className="sr-only">EduBook</span>
                    </div>

                    <p className="max-w-sm text-white/90">
                        Nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>

                    <div className="flex items-center gap-6 text-white">
                        <IconFacebook />
                        <IconLinkedIn />
                        <IconTwitter />
                        <IconYouTube />
                    </div>
                </div>

                {/* middle: COMPANY */}
                <nav aria-label="Company" className="space-y-6">
                    <h4 className="text-lg font-semibold tracking-wide">COMPANY</h4>
                    <ul className="space-y-4">
                        <li><Link to="/" className="hover:underline text-white hover:text-secondary">HOME</Link></li>
                        <li><Link to="/about" className="hover:underline text-white hover:text-secondary">ABOUT US</Link></li>
                        <li><Link to="/books" className="hover:underline text-white hover:text-secondary">BOOKS</Link></li>
                        <li><Link to="/new" className="hover:underline text-white hover:text-secondary">NEW RELEASE</Link></li>
                        <li><Link to="/contact" className="hover:underline text-white hover:text-secondary">CONTACT US</Link></li>
                        <li><Link to="/blog" className="hover:underline text-white hover:text-secondary">BLOG</Link></li>
                    </ul>
                </nav>

                {/* right: IMPORTANT LINKS */}
                <nav aria-label="Important links" className="space-y-6">
                    <h4 className="text-lg font-semibold tracking-wide">IMPORTANT LINKS</h4>
                    <ul className="space-y-4">
                        <li><Link to="/privacy" className="hover:underline text-white hover:text-secondary">Privacy Policy</Link></li>
                        <li><Link to="/faqs" className="hover:underline text-white hover:text-secondary">FAQs</Link></li>
                        <li><Link to="/terms" className="hover:underline text-white hover:text-secondary">Terms of Service</Link></li>
                    </ul>
                </nav>
            </div>

            {/* bottom row */}
            <div className="mx-auto max-w-6xl border-t border-white/20 px-6 py-6 text-sm">
                <div className="flex items-center justify-between">
                    <div className="text-white/90">© {year} EduBook. All Rights Reserved.</div>
                    <div className="space-x-3">
                        <Link to="/privacy" className="hover:underline text-white hover:text-secondary">Privacy</Link>
                        <span className="opacity-80">|</span>
                        <Link to="/terms" className="hover:underline text-white hover:text-secondary">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

/* ---------------- icons ---------------- */
function IconFacebook() {
    return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-label="Facebook">
            <path d="M13 22v-8h3l.5-3H13V9.5c0-.9.3-1.5 1.6-1.5H17V5.2C16.4 5.1 15.4 5 14.3 5 11.9 5 10 6.5 10 9.2V11H7v3h3v8h3z" />
        </svg>
    );
}
function IconLinkedIn() {
    return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-label="LinkedIn">
            <path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5zM4 9h3v12H4zM10 9h3v1.7c.5-.9 1.7-1.9 3.5-1.9 3 0 3.5 1.9 3.5 4.4V21h-3v-6.1c0-1.5 0-3.4-2.1-3.4s-2.4 1.6-2.4 3.3V21h-3V9z" />
        </svg>
    );
}
function IconTwitter() {
    return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-label="Twitter">
            <path d="M22 5.8c-.7.3-1.5.6-2.3.7.8-.5 1.4-1.2 1.7-2.1-.7.4-1.6.8-2.5 1-1.4-1.5-3.8-1.4-5.1.1-1 1.1-1.2 2.7-.6 4-3.2-.2-6.1-1.7-8-4.1-1 1.8-.5 4.1 1.2 5.3-.6 0-1.2-.2-1.7-.5 0 2 1.4 3.8 3.4 4.2-.6.2-1.2.2-1.9.1.5 1.7 2.1 2.9 3.9 3-1.6 1.2-3.6 1.8-5.6 1.8H2c2 1.2 4.4 1.9 6.9 1.9 8.3 0 12.9-6.9 12.6-12.9.9-.6 1.6-1.3 2.2-2.1z" />
        </svg>
    );
}
function IconYouTube() {
    return (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" aria-label="YouTube">
            <path d="M23 12s0-3.3-.4-4.9c-.2-.8-.9-1.5-1.7-1.7C18.9 4.9 12 4.9 12 4.9s-6.9 0-8.9.5c-.8.2-1.5.9-1.7 1.7C1 8.7 1 12 1 12s0 3.3.4 4.9c.2.8.9 1.5 1.7 1.7 2 0 8.9.5 8.9.5s6.9 0 8.9-.5c.8-.2 1.5-.9 1.7-1.7.4-1.6.4-4.9.4-4.9zM9.8 8.8l5.9 3.2-5.9 3.2V8.8z" />
        </svg>
    );
}

/* ------------- background decorative dots ------------- */
function DotsDecor() {
    const Sq = ({ className }: { className: string }) => (
        <span className={`inline-block h-[12px] w-[12px] rounded-[2px] ${className}`} />
    );
    return (
        <div aria-hidden className="pointer-events-none absolute inset-0 select-none">
            {/* top-left cluster */}
            <div className="absolute left-4 top-3 flex flex-col gap-3 opacity-80">
                <Sq className="bg-white/40" />
                <Sq className="bg-white/30" />
                <Sq className="bg-white/40" />
                <Sq className="bg-accent/60" />
            </div>
            {/* left column further down */}
            <div className="absolute left-16 top-8 flex flex-col gap-4 opacity-80">
                <Sq className="bg-white/35" />
                <Sq className="bg-white/35" />
                <Sq className="bg-accent/70" />
            </div>
            {/* right-side scattered */}
            <div className="absolute right-5 top-16 grid grid-cols-3 gap-4 opacity-80">
                {Array.from({ length: 9 }).map((_, i) => (
                    <Sq key={i} className={i % 4 === 0 ? "bg-accent/70" : "bg-white/35"} />
                ))}
            </div>
        </div>
    );
}
