import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService as api } from '../../services/api';
import { useToast } from '../../store/contexts/ToastContext';
import Loading from '../../components/common/Loading';
import { formatDate, formatCurrency } from '../../utils/helpers';
import { ArrowLeft, Award, Camera, CheckCircle } from 'lucide-react';

export default function Completed() {
    const navigate = useNavigate();
    const [completedEvents, setCompletedEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    useEffect(() => {
        fetchCompletedEvents();
    }, []);

    const fetchCompletedEvents = async () => {
        try {
            setLoading(true);
            const response = await api.get('/photographer/completed');
            setCompletedEvents(response.data);
        } catch (error) {
            showToast('Failed to fetch completed events', 'error');
        } finally {
            setLoading(false);
        }
    };

    const totalEarnings = completedEvents.reduce((sum, event) => sum + (event.amount || 0), 0);

    if (loading) return <Loading fullScreen />;

    return (
        <div className="space-y-8 animate-fade-up">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-3 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all text-gray-500 hover:text-indigo-600 group shadow-sm"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Completed Jobs</h1>
                        <p className="text-gray-500 font-bold">View your past wedding photography jobs.</p>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 font-bold text-xs uppercase tracking-widest">
                    <CheckCircle size={16} /> Portfolio Growth Active
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { label: 'Assignments Completed', val: completedEvents.length, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                    { label: 'Total Revenue', val: formatCurrency(totalEarnings), color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
                    {
                        label: 'Performance Rating', val: completedEvents.length > 0
                            ? (completedEvents.reduce((sum, e) => sum + (e.rating || 0), 0) / completedEvents.length).toFixed(1)
                            : 'N/A', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100', isRating: true
                    },
                ].map((stat, i) => (
                    <div key={i} className="premium-card p-6 border-b-4 hover:-translate-y-1 transition-transform duration-300" style={{ borderBottomColor: stat.color === 'text-emerald-600' ? '#10b981' : stat.color === 'text-purple-600' ? '#9333ea' : '#f97316' }}>
                        <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-4">{stat.label}</h3>
                        <div className="flex items-center gap-2">
                            {stat.isRating && <span className="text-orange-400 font-black">★</span>}
                            <p className="text-3xl font-black text-gray-900 tracking-tight">{stat.val}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Completed Events Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {completedEvents.map((event) => (
                    <div key={event._id} className="premium-card overflow-hidden group hover:border-emerald-200 transition-colors">
                        <div className="bg-gradient-to-br from-emerald-600 to-teal-800 p-6 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-4 -translate-y-4">
                                <span className="text-6xl font-black">OK</span>
                            </div>
                            <div className="relative z-10 flex justify-between items-start">
                                <div>
                                    <h3 className="text-2xl font-black tracking-tight">{event.eventType}</h3>
                                    <div className="flex items-center gap-2 text-emerald-100 text-[10px] font-black uppercase tracking-widest mt-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-300"></span>
                                        Delivered on {formatDate(event.completedDate || event.eventDate)}
                                    </div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-lg border border-white/20 text-[10px] font-black uppercase tracking-widest">
                                    Success Story
                                </div>
                            </div>
                        </div>

                        <div className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-1">
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Collaborator</p>
                                    <p className="font-bold text-gray-900">{event.clientName}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Assignment Timing</p>
                                    <p className="font-bold text-gray-900">{formatDate(event.eventDate)}</p>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Production Site</p>
                                <p className="font-bold text-gray-700 text-sm">{event.location}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-1">
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Service Plan</p>
                                    <p className="font-bold text-blue-600 text-sm uppercase tracking-wider">{event.package}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Final Milestone</p>
                                    <p className="font-black text-gray-900 text-base">{formatCurrency(event.amount)}</p>
                                </div>
                            </div>

                            {event.rating && (
                                <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Professional Feedback</p>
                                        <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg shadow-sm">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} className={`text-xs ${i < event.rating ? 'text-orange-400' : 'text-gray-200'}`}>
                                                    ★
                                                </span>
                                            ))}
                                            <span className="text-[10px] font-black text-gray-900 ml-1">{event.rating}/5</span>
                                        </div>
                                    </div>
                                    {event.feedback && (
                                        <p className="text-gray-600 text-sm font-medium italic leading-relaxed">
                                            "{event.feedback}"
                                        </p>
                                    )}
                                </div>
                            )}

                            {event.photosDelivered && (
                                <div className="flex items-center gap-2 bg-blue-50/50 p-4 rounded-xl border border-blue-50">
                                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-black text-xs">
                                        {event.photosDelivered}
                                    </div>
                                    <p className="text-[10px] text-blue-700 font-black uppercase tracking-widest">High-Resolution Shots Dispatched</p>
                                </div>
                            )}

                            <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Archive ID: #{event._id.slice(-8)}</p>
                                <button className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline">Download Report</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {completedEvents.length === 0 && (
                <div className="text-center py-24 premium-card border-dashed border-2">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                        <span className="text-4xl text-gray-200">★</span>
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tight">Archive Empty</h3>
                    <p className="text-gray-500 font-medium max-w-sm mx-auto mt-2">Complete your active assignments to see your professional history here.</p>
                </div>
            )}
        </div>
    );
}
