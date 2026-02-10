import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService as api } from '../../services/api';
import { useAuth } from '../../store/contexts/AuthContext';
import { useToast } from '../../store/contexts/ToastContext';
import { formatCurrency } from '../../utils/helpers';
import {
    Calendar,
    Clock,
    CheckCircle2,
    DollarSign,
    Camera,
    User,
    MapPin,
    ArrowUpRight,
    MessageSquare,
    Activity,
    Briefcase,
    Flashlight,
    ChevronRight,
    Star,
    CheckSquare
} from 'lucide-react';

export default function PhotographerDashboard() {
    const { user } = useAuth();
    const [dashboardStats, setDashboardStats] = useState({
        totalAssignments: 0,
        pendingAssignments: 0,
        completedAssignments: 0,
        totalEarnings: 0
    });
    const [upcomingJobs, setUpcomingJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

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
                const [statsResponse, jobsResponse] = await Promise.all([
                    api.getPhotographerStats(),
                    api.getPhotographerAssignments({ status: 'confirmed', limit: 3 })
                ]);

                if (statsResponse.data) {
                    setDashboardStats(statsResponse.data);
                }
                setUpcomingJobs(Array.isArray(jobsResponse.data) ? jobsResponse.data : []);
            } catch (error) {
                console.error('Dashboard Error:', error);
                showToast("Could not load your studio data", "error");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [showToast]);

    if (loading) return (
        <div className="flex flex-col justify-center items-center h-[60vh] space-y-4">
            <div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] animate-pulse">Loading Studio</p>
        </div>
    );

    return (
        <div className="space-y-10">
            {/* 1. Header Section */}
            <div className="relative overflow-hidden bg-white p-8 md:p-10 rounded-[40px] border border-zinc-100 shadow-sm group">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-emerald-50/50 rounded-full blur-3xl group-hover:bg-emerald-100/50 transition-all duration-700"></div>

                <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="h-20 w-20 rounded-[28px] bg-zinc-900 flex items-center justify-center text-emerald-400 shadow-xl shadow-zinc-200 shrink-0 transform group-hover:rotate-12 transition-transform duration-500">
                            <Camera size={32} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-1">Photographer Console</p>
                            <h1 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">
                                {getGreeting()}, <span className="italic text-zinc-500">{user?.name?.split(' ')[0]}</span>
                            </h1>
                            <p className="text-zinc-400 font-bold text-xs uppercase tracking-widest mt-2 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                {dashboardStats.pendingAssignments > 0
                                    ? `Action Required: ${dashboardStats.pendingAssignments} New Request${dashboardStats.pendingAssignments > 1 ? 's' : ''}`
                                    : 'All systems operational'
                                }
                            </p>
                        </div>
                    </div>
                    <div className="flex w-full md:w-auto">
                        <Link
                            to="/photographer/assignments"
                            className="flex-1 md:flex-none justify-center px-8 py-4 bg-emerald-600 text-white font-black rounded-[24px] hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 active:scale-95 flex items-center gap-3 text-xs uppercase tracking-widest"
                        >
                            <Briefcase size={16} /> View Assignments
                        </Link>
                    </div>
                </div>
            </div>

            {/* 2. Key Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Jobs', value: dashboardStats.totalAssignments || 0, icon: Activity, color: 'zinc', desc: 'Career Bookings' },
                    { label: 'Pending', value: dashboardStats.pendingAssignments || 0, icon: Clock, color: 'amber', desc: 'Awaiting Response' },
                    { label: 'Completed', value: dashboardStats.completedAssignments || 0, icon: CheckCircle2, color: 'emerald', desc: 'Succesfully Done' },
                    { label: 'Total Revenue', value: formatCurrency(dashboardStats.totalEarnings || 0), icon: DollarSign, color: 'blue', desc: 'Lifetime Earnings' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[32px] border border-zinc-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] transition-all hover:border-emerald-100 hover:-translate-y-1 duration-300 group">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 group-hover:scale-110 transition-transform duration-300`}>
                                <stat.icon size={22} />
                            </div>
                        </div>
                        <div>
                            <h3 className="text-3xl font-black text-zinc-900 mb-1">{stat.value}</h3>
                            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wide">{stat.label}</p>
                            <p className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest mt-2">{stat.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* 3. Main Dashboard Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 ">

                {/* Left: Next Up Feed */}
                <div className="lg:col-span-2 bg-white rounded-[40px] border border-zinc-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-8 border-b border-zinc-50 flex items-center justify-between bg-zinc-50/50">
                        <div>
                            <h2 className="text-lg font-black text-zinc-900 italic">Upcoming <span className="not-italic text-zinc-300">/</span> Schedule</h2>
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1">Next confirmed shoots</p>
                        </div>
                        <Link to="/photographer/schedule" className="p-2.5 bg-white border border-zinc-200 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-100 transition-all shadow-sm">
                            <ArrowUpRight size={18} />
                        </Link>
                    </div>

                    <div className="flex-1 overflow-y-auto max-h-[500px]">
                        {upcomingJobs.length > 0 ? (
                            <div className="divide-y divide-zinc-50">
                                {upcomingJobs.map((job) => (
                                    <div key={job._id} className="p-6 md:p-8 hover:bg-zinc-50/50 transition-colors group">
                                        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">

                                            <div className="flex items-start gap-6">
                                                {/* Date Block */}
                                                <div className="h-16 w-16 bg-white border border-zinc-200 rounded-2xl flex flex-col items-center justify-center text-zinc-900 shrink-0 shadow-sm group-hover:border-emerald-200 transition-all">
                                                    <span className="text-[9px] font-black uppercase tracking-tighter text-emerald-600 mb-0.5">
                                                        {new Date(job.eventDate).toLocaleString('default', { month: 'short' })}
                                                    </span>
                                                    <span className="text-2xl font-black leading-none">{new Date(job.eventDate).getDate()}</span>
                                                </div>

                                                {/* Job Details */}
                                                <div>
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="font-black text-zinc-900 text-base">{job.package || 'Standard Package'}</h3>
                                                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-md text-[9px] font-black uppercase tracking-widest">Confirmed</span>
                                                    </div>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-[11px] font-bold text-zinc-500 uppercase tracking-wide">
                                                        <span className="flex items-center gap-1.5"><User size={12} className="text-zinc-400" /> {job.clientId?.name || 'Client'}</span>
                                                        <span className="flex items-center gap-1.5"><Clock size={12} className="text-amber-500" /> {job.startTime}</span>
                                                        <span className="flex items-center gap-1.5 col-span-2"><MapPin size={12} className="text-rose-500" /> {job.location}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action */}
                                            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end mt-4 sm:mt-0">
                                                <div className="text-right sm:block hidden">
                                                    <p className="text-[9px] text-zinc-300 uppercase font-black tracking-widest">Payout</p>
                                                    <p className="text-lg font-black text-zinc-900">{formatCurrency(job.amount)}</p>
                                                </div>
                                                <Link
                                                    to={`/photographer/chat/${job._id}`}
                                                    className="h-12 w-12 bg-white border border-zinc-200 text-zinc-400 rounded-xl flex items-center justify-center hover:text-emerald-600 hover:border-emerald-200 transition-all shadow-sm active:scale-95"
                                                    title="Message Client"
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
                                <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-6 border border-zinc-200 text-zinc-300">
                                    <Flashlight size={32} />
                                </div>
                                <h3 className="font-black text-zinc-900 text-lg mb-2">Schedule Clear</h3>
                                <p className="text-xs text-zinc-500 font-medium max-w-xs mx-auto mb-8">You have no upcoming confirmed shoots. Check assignments to find new work.</p>
                                <Link to="/photographer/assignments" className="px-8 py-3 bg-zinc-900 text-white rounded-xl text-xs font-black shadow-lg shadow-zinc-200 hover:bg-black transition-all inline-block uppercase tracking-widest">
                                    Find Jobs
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Quick Links & Reputation */}
                <div className="space-y-6 lg:col-span-1">

                    {/* Reputation Card */}
                    <div className="bg-zinc-900 rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl group-hover:bg-emerald-500/30 transition-all duration-700"></div>

                        <div className="flex items-center gap-3 mb-6 relative z-10">
                            <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                                <Star size={20} fill="currentColor" />
                            </div>
                            <div>
                                <h3 className="font-black italic text-lg leading-none">Top Rated</h3>
                                <p className="text-[9px] text-zinc-500 font-black uppercase tracking-widest mt-1">Artist Status</p>
                            </div>
                        </div>

                        <div className="space-y-4 relative z-10">
                            <div>
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2 text-zinc-400">
                                    <span>Response Rate</span>
                                    <span className="text-white">100%</span>
                                </div>
                                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-full rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2 text-zinc-400">
                                    <span>Job Completion</span>
                                    <span className="text-white">98%</span>
                                </div>
                                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-[98%] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Navigation */}
                    <div className="bg-white rounded-[32px] p-6 border border-zinc-100 shadow-sm">
                        <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4 px-2">Workspace</h4>
                        <div className="space-y-2">
                            {[
                                { label: 'Completed Jobs', icon: CheckSquare, link: '/photographer/completed' },
                                { label: 'Earnings Report', icon: DollarSign, link: '/photographer/earnings' },
                                { label: 'Full Schedule', icon: Calendar, link: '/photographer/schedule' },
                                { label: 'Edit Portfolio', icon: User, link: '/photographer/profile' },
                            ].map((item, i) => (
                                <Link
                                    key={i}
                                    to={item.link}
                                    className="flex items-center justify-between p-3 rounded-xl hover:bg-zinc-50 transition-colors group/link"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-500 group-hover/link:bg-emerald-50 group-hover/link:text-emerald-600 transition-colors">
                                            <item.icon size={16} />
                                        </div>
                                        <span className="text-xs font-bold text-zinc-700">{item.label}</span>
                                    </div>
                                    <ChevronRight size={14} className="text-zinc-300 group-hover/link:text-emerald-500 transition-colors" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
