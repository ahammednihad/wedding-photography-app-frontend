import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService as api } from '../../services/api';
import { useToast } from '../../store/contexts/ToastContext';
import StatusBadge from '../../components/common/StatusBadge';
import Loading from '../../components/common/Loading';
import { formatDate } from '../../utils/helpers';
import { User, MapPin, Mail, ArrowLeft, Calendar as CalendarIcon, Clock } from 'lucide-react';

export default function Schedule() {
    const navigate = useNavigate();
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('list'); // list or calendar
    const { showToast } = useToast();

    useEffect(() => {
        fetchSchedule();
    }, []);

    const fetchSchedule = async () => {
        try {
            setLoading(true);
            const response = await api.get('/photographer/schedule');
            setSchedule(response.data);
        } catch (error) {
            showToast('Failed to fetch schedule', 'error');
        } finally {
            setLoading(false);
        }
    };

    // Group events by date
    const groupedSchedule = schedule.reduce((acc, event) => {
        const date = new Date(event.eventDate).toDateString();
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(event);
        return acc;
    }, {});

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
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">My Schedule</h1>
                        <p className="text-gray-500 font-bold">Track your upcoming wedding shoots and timings.</p>
                    </div>
                </div>
                <div className="flex bg-gray-100/50 p-1.5 rounded-2xl border border-gray-200/50 backdrop-blur-sm">
                    <button
                        onClick={() => setViewMode('list')}
                        className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center gap-2 ${viewMode === 'list'
                            ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-gray-200/50'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                            }`}
                    >
                        <User size={16} /> List
                    </button>
                    <button
                        onClick={() => setViewMode('calendar')}
                        className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center gap-2 ${viewMode === 'calendar'
                            ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-gray-200/50'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                            }`}
                    >
                        <CalendarIcon size={16} /> Calendar
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Events', val: schedule.length, color: 'text-gray-900', bg: 'bg-gray-50' },
                    {
                        label: 'This Week', val: schedule.filter(e => {
                            const eventDate = new Date(e.eventDate);
                            const today = new Date();
                            const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
                            return eventDate >= today && eventDate <= weekFromNow;
                        }).length, color: 'text-blue-600', bg: 'bg-blue-50'
                    },
                    {
                        label: 'This Month', val: schedule.filter(e => {
                            const eventDate = new Date(e.eventDate);
                            const today = new Date();
                            return eventDate.getMonth() === today.getMonth() && eventDate.getFullYear() === today.getFullYear();
                        }).length, color: 'text-emerald-600', bg: 'bg-emerald-50'
                    },
                    { label: 'Next Event', val: schedule.length > 0 ? formatDate(schedule[0].eventDate) : 'N/A', color: 'text-purple-600', bg: 'bg-purple-50', isDate: true },
                ].map((stat, i) => (
                    <div key={i} className="premium-card p-6 border-b-4 hover:-translate-y-1 transition-transform duration-300" style={{ borderBottomColor: stat.color === 'text-blue-600' ? '#2563eb' : stat.color === 'text-emerald-600' ? '#10b981' : stat.color === 'text-purple-600' ? '#9333ea' : '#e5e7eb' }}>
                        <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-widest mb-4">{stat.label}</h3>
                        <p className={`${stat.isDate ? 'text-lg' : 'text-3xl'} font-black ${stat.color} tracking-tight`}>{stat.val}</p>
                    </div>
                ))}
            </div>

            {/* Schedule Display */}
            {viewMode === 'list' ? (
                <div className="space-y-8">
                    {Object.keys(groupedSchedule).length > 0 ? (
                        Object.entries(groupedSchedule).map(([date, events]) => (
                            <div key={date} className="premium-card overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
                                <div className="bg-gradient-to-r from-gray-900 to-blue-900 text-white p-6 flex justify-between items-center relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <MapPin size={80} />
                                    </div>
                                    <h2 className="text-xl font-bold tracking-tight relative z-10">{date}</h2>
                                    <span className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest relative z-10">{events.length} Assignments</span>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {events.map((event) => (
                                        <div key={event._id} className="p-8 hover:bg-gray-50/50 transition-colors group">
                                            <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
                                                <div className="flex-1 space-y-6">
                                                    <div className="flex flex-wrap items-center gap-4">
                                                        <div className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-black uppercase tracking-widest ring-1 ring-blue-100">
                                                            {event.package} Plan
                                                        </div>
                                                        <span className="text-gray-300 text-2xl font-thin">|</span>
                                                        <span className="text-sm font-bold text-gray-500 flex items-center gap-2">
                                                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                                            {event.eventTime || 'Session: 4-6 Hours'}
                                                        </span>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                                        <div className="space-y-2">
                                                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Client Lead</p>
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-blue-600 border border-gray-100">
                                                                    <User size={18} />
                                                                </div>
                                                                <p className="font-black text-gray-900 text-base">{event.clientId?.name || 'Guest User'}</p>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Shoot Location</p>
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-orange-600 border border-gray-100">
                                                                    <MapPin size={18} />
                                                                </div>
                                                                <p className="font-bold text-gray-700 text-sm truncate max-w-[200px]">{event.location}</p>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-2">
                                                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">Contact Gateway</p>
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center text-emerald-600 border border-gray-100">
                                                                    <Mail size={18} />
                                                                </div>
                                                                <p className="font-bold text-gray-700 text-sm">{event.clientId?.phone || 'Private Number'}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-4 min-w-[120px]">
                                                    <StatusBadge status={event.status} />
                                                    <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">View Agreement</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-24 premium-card border-dashed border-2">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                                <User size={40} />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Schedule Clear</h3>
                            <p className="text-gray-500 font-medium max-w-sm mx-auto mt-2">No events currently scheduled for the selected period. New assignments will appear here once accepted.</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="premium-card p-10">
                    <div className="flex items-center justify-between mb-10 pb-6 border-b border-gray-50">
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
                            {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </h2>
                        <div className="flex gap-4">
                            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(d => (
                                <div key={d} className="w-12 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest">{d}</div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-6">
                        {Array.from({ length: new Date(new Date().getFullYear(), new Date().getMonth(), 1).getDay() }).map((_, i) => (
                            <div key={`empty-${i}`} className="aspect-square"></div>
                        ))}
                        {Array.from({ length: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate() }).map((_, i) => {
                            const day = i + 1;
                            const today = new Date();
                            const isToday = today.getDate() === day && today.getMonth() === new Date().getMonth();
                            const hasEvents = schedule.some(e => new Date(e.eventDate).getDate() === day && new Date(e.eventDate).getMonth() === new Date().getMonth());

                            return (
                                <div
                                    key={day}
                                    className={`relative aspect-square rounded-[1.5rem] flex items-center justify-center text-sm font-black transition-all border
                                        ${isToday ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-500/30 ring-4 ring-blue-50' : 'bg-gray-50/50 text-gray-600 border-transparent hover:bg-white hover:border-gray-200 hover:shadow-sm'}
                                        ${hasEvents && !isToday ? 'bg-white border-blue-200 text-blue-600 ring-4 ring-blue-50/50' : ''}
                                    `}
                                >
                                    {day}
                                    {hasEvents && (
                                        <div className={`absolute bottom-3 h-1.5 w-1.5 rounded-full ${isToday ? 'bg-white' : 'bg-blue-600'} animate-pulse`}></div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-12 pt-10 border-t border-gray-50">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Calendar Key</h3>
                        <div className="flex flex-wrap gap-8">
                            <div className="flex items-center gap-3 text-xs font-black text-gray-700 uppercase tracking-tighter">
                                <span className="w-4 h-4 rounded-lg bg-blue-600 shadow-sm shadow-blue-500/30"></span>
                                Active Today
                            </div>
                            <div className="flex items-center gap-3 text-xs font-black text-gray-700 uppercase tracking-tighter">
                                <span className="w-4 h-4 rounded-lg border-2 border-blue-200 bg-white ring-4 ring-blue-50"></span>
                                Assignment Scheduled
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
