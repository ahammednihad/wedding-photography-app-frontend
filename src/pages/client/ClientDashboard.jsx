import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService as api } from '../../services/api';
import { useAuth } from '../../store/contexts/AuthContext';
import { useToast } from '../../store/contexts/ToastContext';
import { formatCurrency } from '../../utils/helpers';
import {
    Calendar,
    CreditCard,
    Clock,
    CheckCircle2,
    Heart,
    Sparkles,
    MessageSquare,
    ArrowUpRight,
    Camera,
    MapPin,
    Plus,
    Search,
    FileText
} from 'lucide-react';

export default function ClientDashboard() {
    const { user } = useAuth();
    const [dashboardStats, setDashboardStats] = useState({});
    const [recentBookings, setRecentBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    // Determines the greeting based on the current time
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch stats and recent bookings in parallel
                const [statsResponse, bookingsResponse] = await Promise.all([
                    api.getClientStats(),
                    api.getClientBookings({ limit: 5 })
                ]);

                setDashboardStats(statsResponse.data);
                setRecentBookings(bookingsResponse.data);
            } catch (error) {
                console.error("Dashboard Error:", error);
                showToast('Failed to load dashboard data. Please refresh.', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [showToast]);

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-[60vh] space-y-4">
                <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] animate-pulse">Loading Your Experience</p>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            {/* 1. Welcome Header Section */}
            <div className="relative overflow-hidden bg-white p-8 md:p-10 rounded-[40px] border border-slate-100 shadow-sm group">
                {/* Decorative Background Blur */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-50/50 rounded-full blur-3xl group-hover:bg-indigo-100/40 transition-all duration-700"></div>

                <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="h-20 w-20 rounded-[24px] bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-xl shadow-indigo-200 shrink-0 transform group-hover:scale-105 transition-transform duration-500">
                            <Heart size={32} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.25em] mb-1">Client Portal</p>
                            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                                {getGreeting()}, <span className="italic text-indigo-600">{user?.name?.split(' ')[0]}</span>
                            </h1>
                            <p className="text-slate-500 font-medium text-sm mt-1 max-w-md">
                                Your personal wedding photography command center. Manage bookings, payments, and memories.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <Link
                            to="/client/bookings/new"
                            className="flex-1 md:flex-none justify-center px-6 py-3.5 bg-slate-900 text-white font-black rounded-[20px] hover:bg-black transition-all shadow-lg shadow-slate-200 active:scale-95 flex items-center gap-2 text-xs uppercase tracking-widest"
                        >
                            <Plus size={16} /> New Booking
                        </Link>
                    </div>
                </div>
            </div>

            {/* 2. Key Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Bookings', value: dashboardStats.totalBookings || 0, icon: Calendar, color: 'indigo', desc: 'Lifetime sessions' },
                    { label: 'Upcoming', value: dashboardStats.upcomingBookings || 0, icon: Clock, color: 'amber', desc: 'Pending & Confirmed' },
                    { label: 'Completed', value: dashboardStats.completedBookings || 0, icon: CheckCircle2, color: 'emerald', desc: 'Successfully delivered' },
                    { label: 'Total Investment', value: formatCurrency(dashboardStats.totalSpent || 0), icon: CreditCard, color: 'rose', desc: 'Amount details' },
                ].map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-50/50 transition-all duration-300 group">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 group-hover:scale-110 transition-transform duration-300`}>
                                <stat.icon size={22} />
                            </div>
                            <span className="flex items-center text-[10px] font-black uppercase tracking-widest text-slate-300 bg-slate-50 px-2 py-1 rounded-lg group-hover:bg-white group-hover:text-indigo-400 transition-colors">
                                {stat.color === 'indigo' ? 'All Time' : 'Status'}
                            </span>
                        </div>
                        <div>
                            <h3 className="text-3xl font-black text-slate-900 mb-1">{stat.value}</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{stat.label}</p>
                            <p className="text-[10px] text-slate-300 mt-2 font-medium">{stat.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* 3. Quick Actions & Recent Activity Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Quick Actions */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-indigo-600 rounded-[32px] p-8 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                        <h3 className="text-xl font-black italic relative z-10">Quick Actions</h3>
                        <p className="text-indigo-200 text-xs font-bold mb-8 relative z-10">Common tasks for you</p>

                        <div className="space-y-3 relative z-10">
                            {[
                                { to: '/client/photographers', label: 'Browse Photographers', icon: Search },
                                { to: '/client/bookings', label: 'View My Schedule', icon: Calendar },
                                { to: '/client/payments', label: 'Payment History', icon: FileText },
                            ].map((action, i) => (
                                <Link
                                    key={i}
                                    to={action.to}
                                    className="flex items-center gap-4 p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-all border border-white/5 backdrop-blur-sm group/item"
                                >
                                    <action.icon size={18} className="text-indigo-200 group-hover/item:text-white transition-colors" />
                                    <span className="text-sm font-bold tracking-wide">{action.label}</span>
                                    <ArrowUpRight size={16} className="ml-auto opacity-50 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all" />
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-2 bg-amber-50 rounded-xl text-amber-500">
                                <Sparkles size={20} />
                            </div>
                            <div>
                                <h4 className="font-black text-slate-900 text-sm">Pro Tip</h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">For better photos</p>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">
                            "Coordinate outfits with your partner to match the location's color palette. It makes a huge difference in the final shots!"
                        </p>
                    </div>
                </div>

                {/* Right Column: Recent Bookings Feed */}
                <div className="lg:col-span-2 bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                        <div>
                            <h2 className="text-lg font-black text-slate-900 italic">Recent <span className="not-italic text-slate-300">/</span> Activity</h2>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Your latest booking updates</p>
                        </div>
                        <Link to="/client/bookings" className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm">
                            <ArrowUpRight size={18} />
                        </Link>
                    </div>

                    <div className="flex-1 overflow-y-auto max-h-[500px]">
                        {recentBookings.length > 0 ? (
                            <div className="divide-y divide-slate-50">
                                {recentBookings.map((booking) => (
                                    <div key={booking._id} className="p-6 md:p-8 hover:bg-slate-50 transition-colors group">
                                        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                                            {/* Date Badge */}
                                            <div className="h-16 w-16 rounded-2xl bg-white border border-slate-100 flex flex-col items-center justify-center text-slate-900 shrink-0 shadow-sm group-hover:border-indigo-200 group-hover:scale-105 transition-all">
                                                <span className="text-[9px] font-black uppercase tracking-widest text-indigo-500 mb-0.5">
                                                    {new Date(booking.eventDate).toLocaleDateString('en-US', { month: 'short' })}
                                                </span>
                                                <span className="text-2xl font-black leading-none text-slate-800">
                                                    {new Date(booking.eventDate).getDate()}
                                                </span>
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="font-black text-slate-900 text-base truncate">{booking.eventType || 'Wedding Event'}</h3>
                                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${booking.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                        booking.status === 'pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                            'bg-slate-50 text-slate-500 border-slate-100'
                                                        }`}>
                                                        {booking.status}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                                                    <span className="flex items-center gap-1.5"><Clock size={12} className="text-indigo-400" /> {booking.startTime}</span>
                                                    <span className="flex items-center gap-1.5"><MapPin size={12} className="text-rose-400" /> {booking.location || 'TBD'}</span>
                                                </div>
                                            </div>

                                            {/* Price & Action */}
                                            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                                                <div className="text-right">
                                                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Amount</p>
                                                    <p className="text-lg font-black text-slate-900">{formatCurrency(booking.amount)}</p>
                                                </div>
                                                <Link
                                                    to={`/client/chat/${booking._id}`}
                                                    className="h-12 w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm active:scale-95"
                                                    title="Chat with Photographer"
                                                >
                                                    <MessageSquare size={20} />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                                <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300">
                                    <Camera size={32} />
                                </div>
                                <h3 className="text-lg font-black text-slate-900 mb-2">No Memories Yet?</h3>
                                <p className="text-sm text-slate-500 max-w-xs mb-8">Start your journey by exploring our talented photographers and booking your first session.</p>
                                <Link
                                    to="/client/bookings/new"
                                    className="px-8 py-3 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-colors shadow-xl shadow-indigo-100"
                                >
                                    Book Now
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
