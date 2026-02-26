import { useState, useEffect } from 'react';
import { apiService as api } from '../../services/api';
import { useToast } from '../../store/contexts/ToastContext';
import {
    History,
    User,
    Calendar,
    CreditCard,
    Camera,
    Target,
    Info,
    Filter,
    Search,
    Activity as ActivityIcon,
    Zap,
    Cpu,
    Database,
    Shield,
    Terminal,
    ChevronRight,
    Search as SearchIcon
} from 'lucide-react';
import { formatDateTime } from '../../utils/helpers';

export default function AdminActivity() {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [typeFilter, setTypeFilter] = useState('all');
    const { showToast } = useToast();

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        try {
            setLoading(true);
            const response = await api.getAdminActivity();
            setActivities(response.data);
        } catch (error) {
            showToast('Failed to load activities', 'error');
        } finally {
            setLoading(false);
        }
    };

    const filtered = activities.filter(a => {
        return typeFilter === 'all' || a.type === typeFilter;
    });

    const getActivityConfig = (type) => {
        const configs = {
            user: { icon: User, color: 'indigo', label: 'User Activity' },
            booking: { icon: Calendar, color: 'emerald', label: 'Booking' },
            payment: { icon: CreditCard, color: 'amber', label: 'Payment' },
            photographer: { icon: Camera, color: 'violet', label: 'Photographer' },
            assignment: { icon: Target, color: 'rose', label: 'Assignment' },
            default: { icon: Info, color: 'slate', label: 'System' }
        };
        return configs[type] || configs.default;
    };

    if (loading) return (
        <div className="flex flex-col justify-center items-center h-[60vh] space-y-4">
            <div className="h-10 w-10 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Loading Activities</p>
        </div>
    );

    return (
        <div className="space-y-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic">System Activity</h1>
                    <p className="text-slate-500 font-medium mt-2">View real-time records of all system actions and events.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
                        <ActivityIcon size={18} className="text-emerald-500" />
                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">System Active</span>
                    </div>
                    <button
                        onClick={fetchActivities}
                        className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-black transition-all active:scale-95 flex items-center gap-2"
                    >
                        <Terminal size={18} /> Refresh
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-8 items-center">
                <div className="flex items-center gap-3 px-6 py-4 bg-slate-50 border border-transparent rounded-2xl focus-within:bg-white focus-within:border-slate-200 transition-all flex-1 min-w-[300px]">
                    <SearchIcon size={20} className="text-slate-400" />
                    <select
                        className="bg-transparent outline-none text-xs font-black text-slate-900 w-full cursor-pointer appearance-none uppercase tracking-widest"
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                    >
                        <option value="all">Category: All Activity</option>
                        <option value="user">Category: Users</option>
                        <option value="booking">Category: Bookings</option>
                        <option value="payment">Category: Payments</option>
                        <option value="photographer">Category: Photographers</option>
                        <option value="assignment">Category: Assignments</option>
                    </select>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-indigo-500 rounded-full"></div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{filtered.length} Events Logged</span>
                    </div>
                </div>
            </div>

            {/* Activity Timeline */}
            <div className="relative space-y-12 before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-transparent before:via-slate-100 before:to-transparent">
                {filtered.length > 0 ? (
                    filtered.map((activity, index) => {
                        const config = getActivityConfig(activity.type);
                        const Icon = config.icon;
                        return (
                            <div key={activity._id || index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                                {/* Chrono Point */}
                                <div className={`flex items-center justify-center w-12 h-12 rounded-2xl border-4 border-white bg-slate-900 text-white shadow-2xl absolute left-0 md:left-1/2 md:-ml-6 transition-all group-hover:scale-110 group-hover:rotate-12 z-10`}>
                                    <Icon size={18} />
                                </div>

                                {/* Data Card */}
                                <div className="w-[calc(100%-5rem)] md:w-[calc(50%-3.5rem)] bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm transition-all group-hover:border-slate-300 group-hover:shadow-xl group-hover:shadow-slate-100 ml-20 md:ml-0 overflow-hidden relative">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 -mr-16 -mt-16 rounded-full group-hover:bg-indigo-50/50 transition-colors"></div>

                                    <div className="relative">
                                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                                            <span className={`w-fit px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all bg-${config.color}-50 text-${config.color}-700 border-${config.color}-100 shadow-sm`}>
                                                {config.label}
                                            </span>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                                <History size={12} />
                                                {formatDateTime(activity.timestamp || activity.createdAt)}
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-black text-slate-900 mb-2 italic tracking-tight">{activity.title}</h3>
                                        <p className="text-sm font-medium text-slate-500 mb-8 leading-relaxed">{activity.description}</p>

                                        {activity.details && (
                                            <div className="bg-slate-50 rounded-[30px] p-6 space-y-3 mb-8 border border-transparent group-hover:border-slate-100 transition-all font-mono">
                                                {Object.entries(activity.details).map(([key, value]) => (
                                                    <div key={key} className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                                        <span className="text-slate-400">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                                                        <span className="text-slate-900 group-hover:text-indigo-600 transition-colors">{String(value)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div className="flex items-center gap-4 pt-6 border-t border-slate-50">
                                            <div className="h-8 w-8 rounded-xl bg-slate-900 flex items-center justify-center text-[10px] font-black text-white shadow-lg">
                                                {activity.userName?.charAt(0) || 'S'}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Trigger Initiator</span>
                                                <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{activity.userName || 'SYSTEM'}</span>
                                            </div>
                                            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                                <ChevronRight size={20} className="text-slate-300" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="bg-white p-32 rounded-[40px] border border-slate-100 text-center shadow-sm">
                        <ActivityIcon size={64} className="mx-auto mb-8 text-slate-100 animate-pulse" />
                        <h3 className="text-2xl font-black text-slate-900 italic tracking-tight mb-2">No Activities Found</h3>
                        <p className="font-black text-slate-400 text-[10px] uppercase tracking-[0.3em]">No recent events recorded in the system</p>
                    </div>
                )}
            </div>
        </div>
    );
}
