import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiService as api } from "../../services/api";
import { useAuth } from "../../store/contexts/AuthContext";
import { useToast } from "../../store/contexts/ToastContext";
import { MapPin, Star, Calendar, ArrowRight, Camera, Search, Heart, User } from "lucide-react";
import Loading from "../../components/common/Loading";

export default function ClientPhotographers() {
    const [photographers, setPhotographers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const { showToast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        fetchPhotographers();
    }, []);

    const fetchPhotographers = async () => {
        try {
            setLoading(true);
            const response = await api.getVerifiedPhotographers();
            setPhotographers(response.data || []);
        } catch (err) {
            console.error("Failed to fetch photographers", err);
            // Fallback or empty state if API fails
            setPhotographers([]);
            // Optionally show a toast but keep it subtle if it's just empty
        } finally {
            setLoading(false);
        }
    };

    const filteredPhotographers = photographers.filter(p =>
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <Loading fullScreen />;

    return (
        <div className="space-y-8 pb-20 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight italic">Find <span className="not-italic text-slate-400">/</span> Talent</h1>
                    <p className="text-slate-500 font-medium mt-1">Discover the perfect artist for your special day.</p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-80 group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search size={18} className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-[20px] text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none placeholder:text-slate-300"
                    />
                </div>
            </div>

            {/* Photographers Grid */}
            {filteredPhotographers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPhotographers.map((photographer) => (
                        <div key={photographer._id} className="bg-white rounded-[40px] border border-slate-100 overflow-hidden group hover:shadow-xl hover:-translate-y-2 transition-all duration-500">
                            {/* Cover/Avatar Area */}
                            <div className="h-48 bg-slate-100 relative overflow-hidden">
                                {photographer.coverImage ? (
                                    <img src={photographer.coverImage} alt="Cover" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-indigo-50 to-slate-100 flex items-center justify-center">
                                        <Camera size={48} className="text-indigo-200" />
                                    </div>
                                )}

                                {/* Avatar Overlay */}
                                <div className="absolute -bottom-10 left-8">
                                    <div className="w-20 h-20 rounded-full border-4 border-white bg-slate-200 overflow-hidden shadow-md">
                                        {photographer.avatar ? (
                                            <img src={photographer.avatar} alt={photographer.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-slate-300 text-slate-500 font-bold text-xl">
                                                {photographer.name?.charAt(0) || 'P'}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Badge */}
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-600 shadow-sm flex items-center gap-1">
                                    <Star size={12} className="fill-indigo-600" />
                                    Top Rated
                                </div>
                            </div>

                            {/* Content */}
                            <div className="pt-12 pb-8 px-8">
                                <div className="mb-6">
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-1">{photographer.name}</h3>
                                    <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                                        <span className="flex items-center gap-1">
                                            <MapPin size={12} /> {photographer.location || 'Remote Available'}
                                        </span>
                                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                        <span>{photographer.specialty || 'Wedding Specialist'}</span>
                                    </div>
                                </div>

                                <p className="text-sm font-medium text-slate-500 line-clamp-2 mb-8 h-10">
                                    {photographer.bio || "Passionate photographer capturing life's most precious moments with artistic flair and attention to detail."}
                                </p>

                                <div className="flex items-center gap-4 pt-6 border-t border-slate-50">
                                    <button
                                        onClick={() => navigate(`/client/bookings/new?photographerId=${photographer._id}`)}
                                        className="flex-1 bg-slate-900 text-white py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-colors shadow-lg shadow-slate-200 group/btn flex items-center justify-center gap-2"
                                    >
                                        Book Now <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                    <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-colors">
                                        <Heart size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-[40px] border border-slate-100 border-dashed">
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300">
                        <User size={40} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">No Photographers Found</h3>
                    <p className="text-slate-500 max-w-md mx-auto mb-8">
                        {searchTerm ? "Try adjusting your search terms." : "There are currently no verfied photographers available in your area."}
                    </p>
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="px-6 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-colors"
                        >
                            Clear Search
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
