import HeroSection from '../components/UI/HeroSection';
import CategoriesSection from '../components/UI/CategoriesSection';
import NewReleasesSection from '../components/UI/NewReleasesSection';
import FeaturedBookSection from '../components/UI/FeaturedBookSection';
import PromoBanner from '../components/UI/PromoBanner';
import Newsletter from '../components/UI/Newsletter';
import ArticlesSection from '../components/UI/ArticlesSection';


// ---------- Hardcoded demo data (replace later with API) ---------- 


// -------------------- Page --------------------
export default function Home() {
    return (
        <div className="flex min-h-screen flex-col">
            <main className="flex-1">
                <HeroSection />
                <CategoriesSection />
                <NewReleasesSection />
                <FeaturedBookSection />
                <PromoBanner />
                <Newsletter />
                <ArticlesSection />
            </main>
        </div>
    );
}
