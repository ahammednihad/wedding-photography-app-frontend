import { useState, useEffect } from 'react';
import { apiService as api } from '../../services/api';
import { useToast } from '../../store/contexts/ToastContext';
import {
    User,
    Calendar,
    MapPin,
    DollarSign,
    CheckCircle2,
    Target,
    ArrowRight,
    Info,
    ChevronRight,
    ShieldCheck,
    Star,
    Zap,
    Cpu,
    Terminal,
    Activity,
    Globe
} from 'lucide-react';
import { formatDate } from '../../utils/helpers';

export default function AdminAssignments() {
    const [bookings, setBookings] = useState([]);
    const [photographers, setPhotographers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [selectedPhotographer, setSelectedPhotographer] = useState('');
    const { showToast } = useToast();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [bookingsRes, photographersRes] = await Promise.all([
                api.get('/admin/bookings'),
                api.get('/admin/photographers?status=approved')
            ]);
            // Filter bookings that are pending or confirmed
            setBookings(bookingsRes.data.filter(b => b.status === 'pending' || b.status === 'confirmed'));
            setPhotographers(photographersRes.data);
        } catch (error) {
            showToast('Operational data fetch failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleAutoAssign = () => {
        const unassignedBookings = bookings.filter(b => !b.photographerId);
        if (unassignedBookings.length === 0) {
            showToast('All bookings are already assigned.', 'info');
            return;
        }

        const bookingToAssign = unassignedBookings[0];

        // Simple strategy: finds random available photographer
        const availablePhotographer = photographers.find(p => p.isActive && p.isApproved);

        if (!availablePhotographer) {
            showToast('No available photographers found.', 'error');
            return;
        }

        setSelectedBooking(bookingToAssign);
        setSelectedPhotographer(availablePhotographer._id);
        showToast('Photographer auto-selected. Please confirm.', 'success');
    };

    const handleAssign = async () => {
        if (!selectedBooking || !selectedPhotographer) {
            showToast('Please select a booking and a photographer', 'error');
            return;
        }

        try {
            await api.assignPhotographer(selectedBooking._id, selectedPhotographer);
            showToast('Photographer assigned successfully', 'success');
            setSelectedBooking(null);
            setSelectedPhotographer('');
            fetchData();
        } catch (error) {
            showToast('Failed to assign photographer', 'error');
        }
    };

    if (loading) return (
        <div className="flex flex-col justify-center items-center h-[60vh] space-y-4">
            <div className="h-10 w-10 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Loading Assignments...</p>
        </div>
    );

    return (
        <div className="space-y-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic">Photographer <span className="not-italic text-slate-400">/</span> Assignments</h1>
                    <p className="text-slate-500 font-medium mt-2">Assign photographers to pending and confirmed bookings.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
                        <Target size={18} className="text-rose-500" />
                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{bookings.filter(b => !b.photographerId).length} Unassigned</span>
                    </div>
                    <button
                        onClick={handleAutoAssign}
                        className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-black transition-all active:scale-95 flex items-center gap-2"
                    >
                        <CheckCircle2 size={18} /> Auto Assign
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Bookings Queue */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Booking List</h2>
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{bookings.length} Total</span>
                    </div>

                    <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[700px]">
                        <div className="p-8 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                            <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest italic">Current Bookings</h2>
                            <Activity size={16} className="text-slate-300" />
                        </div>

                        <div className="overflow-y-auto flex-1 p-6 space-y-4 custom-scrollbar">
                            {bookings.length > 0 ? (
                                bookings.map((booking) => (
                                    <div
                                        key={booking._id}
                                        onClick={() => setSelectedBooking(booking)}
                                        className={`p-8 rounded-[32px] border transition-all cursor-pointer group relative overflow-hidden ${selectedBooking?._id === booking._id
                                            ? 'bg-slate-900 border-slate-900 shadow-2xl shadow-indigo-200 translate-x-1'
                                            : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-lg translate-x-0'
                                            }`}
                                    >
                                        <div className="relative z-10">
                                            <div className="flex justify-between items-start mb-6">
                                                <div>
                                                    <p className={`text-sm font-black transition-colors ${selectedBooking?._id === booking._id ? 'text-white' : 'text-slate-900'}`}>{booking.clientId?.name || 'Customer'}</p>
                                                    <p className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${selectedBooking?._id === booking._id ? 'text-slate-500' : 'text-slate-400'}`}>{booking._id.slice(-8).toUpperCase()}</p>
                                                </div>
                                                <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${selectedBooking?._id === booking._id
                                                    ? 'bg-slate-800 border-slate-700 text-slate-400'
                                                    : 'bg-slate-50 border-slate-100 text-slate-500 shadow-sm'
                                                    }`}>
                                                    {booking.status}
                                                </span>
                                            </div>

                                            <div className={`space-y-3 text-[10px] font-black uppercase tracking-widest ${selectedBooking?._id === booking._id ? 'text-slate-400' : 'text-slate-400'}`}>
                                                <div className="flex items-center gap-3">
                                                    <Calendar size={14} className={selectedBooking?._id === booking._id ? 'text-indigo-500' : 'text-slate-300'} />
                                                    <span className={selectedBooking?._id === booking._id ? 'text-slate-200' : 'text-slate-600'}>{booking.eventType}</span>
                                                    <span className="text-slate-500">/</span>
                                                    <span className={selectedBooking?._id === booking._id ? 'text-slate-200' : 'text-slate-600'}>{formatDate(booking.eventDate)}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <MapPin size={14} className={selectedBooking?._id === booking._id ? 'text-indigo-500' : 'text-slate-300'} />
                                                    <span className={selectedBooking?._id === booking._id ? 'text-slate-200' : 'text-slate-600'}>{booking.location}</span>
                                                </div>
                                            </div>

                                            {booking.photographerId ? (
                                                <div className={`mt-6 pt-6 border-t ${selectedBooking?._id === booking._id ? 'border-slate-800' : 'border-slate-50'} flex items-center justify-between`}>
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-8 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                                            <ShieldCheck size={14} className="text-emerald-500" />
                                                        </div>
                                                        <span className={`text-[10px] font-black uppercase tracking-widest ${selectedBooking?._id === booking._id ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                                            {booking.photographerId.name}
                                                        </span>
                                                    </div>
                                                    <div className={`text-[10px] font-black uppercase tracking-widest ${selectedBooking?._id === booking._id ? 'text-slate-600' : 'text-slate-300'}`}>Verified</div>
                                                </div>
                                            ) : (
                                                <div className="mt-6 flex items-center gap-3">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse"></div>
                                                    <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Unassigned</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-24 text-center">
                                    <Globe size={48} className="mx-auto mb-6 text-slate-100 animate-pulse" />
                                    <p className="font-black text-slate-400 text-[10px] uppercase tracking-[0.3em] italic">No bookings found</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Assignment Tool */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="px-2">
                        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Assignment Details</h2>
                    </div>

                    <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-12 h-fit relative overflow-hidden group/orchestrator">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 -mr-32 -mt-32 rounded-full blur-3xl group-hover/orchestrator:bg-indigo-500/10 transition-all duration-1000"></div>

                        {selectedBooking ? (
                            <div className="space-y-12 relative z-10">
                                {/* Booking Details */}
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
                                    <div>
                                        <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.3em] mb-3 flex items-center gap-2">
                                            <Zap size={12} className="fill-indigo-500" />
                                            Booking Summary
                                        </p>
                                        <h3 className="text-4xl font-black text-slate-900 tracking-tighter italic">{selectedBooking.clientId?.name}</h3>
                                        <div className="flex flex-wrap items-center gap-4 mt-4">
                                            <span className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-100">{selectedBooking.eventType}</span>
                                            <span className="text-xs font-bold text-slate-400 italic">Location: {selectedBooking.location}</span>
                                        </div>
                                    </div>
                                    <div className="bg-slate-900 p-8 rounded-[32px] border border-slate-800 flex flex-col items-end shadow-2xl">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Booking ID</p>
                                        <p className="text-lg font-black text-white tracking-widest">{selectedBooking._id.slice(-12).toUpperCase()}</p>
                                    </div>
                                </div>

                                {/* Photographer Selection */}
                                <div className="space-y-8">
                                    <div className="flex items-center justify-between">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Select Photographer</label>
                                        <span className="text-[10px] font-black text-slate-900 flex items-center gap-2">
                                            <div className="h-1 w-1 bg-emerald-500 rounded-full"></div>
                                            Verified Photographers Only
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {photographers.map((p) => (
                                            <div
                                                key={p._id}
                                                onClick={() => setSelectedPhotographer(p._id)}
                                                className={`p-8 rounded-[32px] border transition-all cursor-pointer group/item relative overflow-hidden ${selectedPhotographer === p._id
                                                    ? 'bg-indigo-50 border-indigo-200 ring-2 ring-indigo-100 shadow-xl'
                                                    : 'bg-slate-50 border-transparent hover:border-slate-200'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-5">
                                                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center text-sm font-black transition-all ${selectedPhotographer === p._id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 translate-y-[-2px]' : 'bg-white text-slate-400 group-hover/item:text-slate-900 shadow-sm'
                                                        }`}>
                                                        {p.name?.charAt(0)}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest group-hover/item:text-indigo-600 transition-colors">{p.name}</p>
                                                        <div className="flex items-center gap-3 mt-2">
                                                            <div className="flex items-center gap-1">
                                                                <Star size={10} className="text-amber-500 fill-amber-500" />
                                                                <span className="text-[10px] font-black text-slate-500">{p.experience}Y EXP</span>
                                                            </div>
                                                            <div className="h-1 w-1 bg-slate-300 rounded-full"></div>
                                                            <span className="text-[10px] font-black text-emerald-500 uppercase">Available</span>
                                                        </div>
                                                    </div>
                                                    {selectedPhotographer === p._id && (
                                                        <div className="h-8 w-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white animate-in zoom-in-50 duration-300 shadow-lg">
                                                            <ShieldCheck size={18} />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-slate-50">
                                    <button
                                        onClick={handleAssign}
                                        disabled={!selectedPhotographer}
                                        className="w-full bg-slate-900 text-white py-6 rounded-[32px] font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-indigo-100 hover:bg-black disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-4 group/btn overflow-hidden relative"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 via-white/5 to-indigo-600/0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000"></div>
                                        <span className="relative">Confirm Assignment</span>
                                        <ArrowRight size={18} className="relative group-hover/btn:translate-x-2 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="py-40 flex flex-col items-center justify-center text-center space-y-10 group/empty">
                                <div className="h-32 w-32 rounded-[48px] bg-slate-50 flex items-center justify-center group-hover/empty:scale-110 transition-transform duration-700 border border-slate-100 shadow-inner">
                                    <Info size={48} className="text-slate-200 group-hover/empty:text-indigo-400 transition-colors" />
                                </div>
                                <div className="space-y-4">
                                    <p className="text-xl font-black text-slate-900 tracking-tight italic">Waiting for Selection</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] max-w-[320px] leading-relaxed mx-auto">Choose a booking from the list to start assigning a photographer.</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="h-1 w-1 bg-slate-200 rounded-full animate-pulse"></div>
                                    <div className="h-1 w-1 bg-slate-300 rounded-full animate-pulse delay-75"></div>
                                    <div className="h-1 w-1 bg-slate-200 rounded-full animate-pulse delay-150"></div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
