import Navbar from '../components/Navbar';
export default function Home() {
    return (
        <div className="min-h-screen">
            <Navbar />
            <main className="max-w-6xl mx-auto p-6">
                <h1 className="text-3xl md:text-5xl font-bold mb-3">EduBook — Китеп дүкөнү</h1>
                <p className="text-lg text-gray-600">Жаңы китептер, классиктер жана окуу тизмелери.</p>
            </main>
        </div>
    );
}
