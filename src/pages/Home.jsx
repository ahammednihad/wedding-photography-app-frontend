import { useState } from "react";
import { Link } from "react-router-dom";
import {
    Camera, Shield, Heart, Search, Calendar, Star,
    ArrowRight, MapPin, ChevronDown, ChevronUp
} from "lucide-react";
import { ROUTES } from "../utils/constants";

export default function Home() {
    const [openFaq, setOpenFaq] = useState(null);

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const categories = [
        { title: "Candid", image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=400" },
        { title: "Traditional", image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=400" },
        { title: "Pre-Wedding", image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=400" },
        { title: "Drone", image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&q=80&w=400" },
    ];

    return (
        <div className="bg-white min-h-screen font-sans text-gray-800">

            {/* --- HERO SECTION --- */}
            <div className="relative h-[700px] flex items-center justify-center overflow-hidden">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=2000"
                        alt="Hero Background"
                        className="w-full h-full object-cover animate-fade-in"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80 backdrop-blur-[1px]"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 text-center max-w-5xl px-4 text-white animate-fade-up">
                    <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight leading-tight">
                        Capture Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">Forever</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-blue-50/90 mb-12 font-medium max-w-3xl mx-auto leading-relaxed">
                        Connect with India's finest wedding storytellers. Verified professionals, transparent pricing, and timeless memories.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-5 justify-center">
                        <Link to={ROUTES.LOGIN} className="bg-white text-blue-900 px-10 py-4 rounded-full font-bold hover:bg-blue-50 transition-all hover:scale-105 flex items-center justify-center gap-2 shadow-xl shadow-blue-900/20 text-lg">
                            <Search size={22} className="text-blue-600" /> Find Photographers
                        </Link>
                        <Link to={ROUTES.REGISTER} className="bg-white/10 border-2 border-white/30 backdrop-blur-md text-white px-10 py-4 rounded-full font-bold hover:bg-white/20 transition-colors text-lg flex items-center justify-center gap-2">
                            Join as Photographer <ArrowRight size={22} />
                        </Link>
                    </div>
                </div>
            </div>

            {/* --- SIMPLE STATS --- */}
            <div className="bg-white py-16 border-b border-gray-100 relative -mt-20 z-20 mx-4 md:mx-auto max-w-7xl rounded-3xl shadow-xl">
                <div className="px-8 grid grid-cols-2 md:grid-cols-4 gap-12 text-center divide-x divide-gray-100">
                    {[
                        { label: "Cities", value: "50+", icon: MapPin },
                        { label: "Photographers", value: "2,000+", icon: Camera },
                        { label: "Bookings", value: "15k+", icon: Calendar },
                        { label: "Rating", value: "4.9/5", icon: Star },
                    ].map((stat, idx) => (
                        <div key={idx} className="group hover:-translate-y-1 transition-transform duration-300">
                            <div className="flex justify-center mb-3 text-blue-600 opacity-80 group-hover:scale-110 transition-transform">
                                <stat.icon size={28} />
                            </div>
                            <div className="text-4xl font-black text-gray-900 mb-2 tracking-tight">{stat.value}</div>
                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- CATEGORIES (Clean Cards) --- */}
            <div className="py-24 max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div>
                        <h2 className="text-4xl font-bold text-gray-900 tracking-tight mb-3">Explore by Style</h2>
                        <p className="text-gray-500 text-lg">Find the perfect match for your vision.</p>
                    </div>
                    <Link to={ROUTES.LOGIN} className="group text-blue-600 font-bold flex items-center gap-2 px-6 py-3 bg-blue-50 rounded-full hover:bg-blue-100 transition-all">
                        View All Categories <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {categories.map((cat, idx) => (
                        <Link to={ROUTES.LOGIN} key={idx} className="group relative rounded-2xl overflow-hidden aspect-[3/4] cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                            <img src={cat.image} alt={cat.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                            <div className="absolute bottom-6 left-6 text-white transform group-hover:-translate-y-1 transition-transform">
                                <h3 className="font-bold text-2xl tracking-tight mb-1">{cat.title}</h3>
                                <p className="text-white/80 text-sm font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                                    Explore <ArrowRight size={14} />
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* --- WHY US (Cards) --- */}
            <div className="bg-gray-50 py-24">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16 max-w-2xl mx-auto">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Why Choose WedLens?</h2>
                        <p className="text-gray-500">We don't just capture photos; we preserve emotions for a lifetime.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: Shield, title: "Verified Professionals", desc: "Every photographer is manually vetted for quality, reliability, and professionalism." },
                            { icon: Calendar, title: "Seamless Booking", desc: "Check real-time availability and secure your date in just a few clicks with secure payments." },
                            { icon: Heart, title: "Curated for Love", desc: "We match you with artists who understand your unique story and vision." },
                        ].map((item, idx) => (
                            <div key={idx} className="premium-card p-10 text-center hover:border-blue-200 group">
                                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm mb-6 mx-auto group-hover:rotate-6 transition-transform duration-300">
                                    <item.icon size={32} />
                                </div>
                                <h3 className="font-bold text-xl text-gray-900 mb-3">{item.title}</h3>
                                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- TESTIMONIALS (Cards) --- */}
            <div className="py-24 bg-white">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
                        <div>
                            <h2 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">Happy Couples</h2>
                            <p className="text-gray-500">Read what others are saying about their WedLens experience.</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-3 rounded-xl border border-gray-100 hover:bg-gray-50 hover:border-gray-300 transition-colors"><ChevronDown className="rotate-90" /></button>
                            <button className="p-3 rounded-xl border border-gray-100 hover:bg-gray-50 hover:border-gray-300 transition-colors"><ChevronUp className="rotate-90" /></button>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {[
                            { name: "Priya & Rahul", loc: "Mumbai", text: "We found our photographer in 2 days! The process was so simple and stress-free. The team was incredibly helpful throughout." },
                            { name: "Anjali & Vikram", loc: "Delhi", text: "The verified badge gave us total peace of mind. Our photos turned out magical and the photographer was so professional." },
                        ].map((t, idx) => (
                            <div key={idx} className="bg-gray-50 p-10 rounded-3xl border border-gray-100 flex gap-6 hover:shadow-lg transition-shadow duration-300">
                                <div className="text-blue-200 shrink-0">
                                    <div className="bg-white p-3 rounded-full shadow-sm text-yellow-500">
                                        <Star size={24} fill="currentColor" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-gray-700 italic mb-6 leading-relaxed text-lg">"{t.text}"</p>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-lg">{t.name}</h4>
                                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1 font-medium">
                                            <MapPin size={14} className="text-blue-500" /> {t.loc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- FAQ Accordion (Optional but good for SEO) --- */}
            <div className="py-20 border-t border-gray-100">
                <div className="max-w-2xl mx-auto px-4">
                    <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Common Questions</h2>
                    <div className="space-y-4">
                        {[
                            { q: "Is WedLens free for couples?", a: "Yes! Creating an account and contacting photographers is completely free." },
                            { q: "How do I pay?", a: "We offer a secure payment gateway to handle your advance booking payments safely." },
                        ].map((faq, idx) => (
                            <div key={idx} className="border-b border-gray-100">
                                <button
                                    onClick={() => toggleFaq(idx)}
                                    className="w-full flex justify-between items-center py-4 text-left hover:text-blue-600 transition-colors"
                                >
                                    <span className="font-medium text-gray-700">{faq.q}</span>
                                    {openFaq === idx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </button>
                                <div className={`overflow-hidden transition-all duration-300 ${openFaq === idx ? 'max-h-20 pb-4' : 'max-h-0'}`}>
                                    <p className="text-gray-500 text-sm">{faq.a}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- FOOTER --- */}
            <footer className="bg-white border-t border-gray-100 py-12 text-center">
                <div className="flex items-center justify-center gap-2 mb-6 text-gray-900">
                    <Camera size={20} className="text-blue-600" />
                    <span className="font-bold text-xl tracking-tight">WedLens</span>
                </div>
                <p className="text-gray-400 text-sm mb-8">
                    &copy; 2026 WedLens Inc. Capturing moments, creating memories.
                </p>
                <div className="flex justify-center gap-6 text-sm text-gray-500">
                    <Link to="/privacy" className="hover:text-blue-600">Privacy</Link>
                    <Link to="/terms" className="hover:text-blue-600">Terms</Link>
                    <Link to="/contact" className="hover:text-blue-600">Contact</Link>
                </div>
            </footer>
        </div>
    );
}
