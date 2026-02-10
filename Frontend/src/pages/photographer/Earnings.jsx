import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService as api } from '../../services/api';
import { useToast } from '../../store/contexts/ToastContext';
import { formatDate, formatCurrency } from '../../utils/helpers';
import {
    DollarSign,
    Calendar,
    ArrowLeft,
    TrendingUp,
    CreditCard,
    Target,
    ArrowUpRight,
    Package,
    User,
    Clock
} from 'lucide-react';

export default function Earnings() {
    const navigate = useNavigate();
    const [earnings, setEarnings] = useState([]);
    const [stats, setStats] = useState({
        totalEarnings: 0,
        totalJobs: 0,
        monthlyEarnings: []
    });
    const [loading, setLoading] = useState(true);
    const [timeframe, setTimeframe] = useState('all');
    const { showToast } = useToast();

    useEffect(() => {
        fetchEarnings();
    }, []);

    const fetchEarnings = async () => {
        try {
            setLoading(true);
            const response = await api.getPhotographerEarnings();
            const data = response.data;

            setEarnings(data.transactions || []);
            setStats({
                totalEarnings: data.totalEarnings || 0,
                totalJobs: data.totalJobs || 0,
                monthlyEarnings: data.monthlyEarnings || []
            });
        } catch (error) {
            console.error("Earnings fetch error:", error);
            showToast('Failed to fetch financial data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const filteredEarnings = earnings.filter(e => {
        const date = new Date(e.paymentDate);
        const now = new Date();

        if (timeframe === 'month') {
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        } else if (timeframe === 'year') {
            return date.getFullYear() === now.getFullYear();
        }
        return true;
    });

    const totalFiltered = filteredEarnings.reduce((sum, e) => sum + (e.amount || 0), 0);

    if (loading) return (
        <div className="flex flex-col justify-center items-center h-[60vh] space-y-4">
            <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 font-bold animate-pulse">Calculating Revenue...</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-up">
            {/* Header with Back Button */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-3 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-all text-gray-500 hover:text-indigo-600 group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Earnings Dashboard</h1>
                        <p className="text-gray-500 font-bold">Monitor your wedding job payments and total earnings.</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        Verified Earnings
                    </div>
                </div>
            </div>

            {/* High Level Stats Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Wallet Balance', val: stats.totalEarnings, icon: CreditCard, color: 'indigo', trend: 'Cleared for payout' },
                    { label: 'Total Volume', val: stats.totalEarnings, icon: TrendingUp, color: 'blue', trend: 'Lifetime revenue' },
                    { label: 'Active Pipeline', val: stats.totalJobs, icon: Target, color: 'purple', trend: 'Confirmed jobs', isCount: true },
                    { label: 'Avg / Shoot', val: stats.totalJobs > 0 ? (stats.totalEarnings / stats.totalJobs) : 0, icon: ArrowUpRight, color: 'emerald', trend: 'Session average' },
                ].map((stat, i) => (
                    <div key={i} className="premium-card p-6 group hover:border-indigo-200 transition-all duration-300">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</span>
                            <div className={`p-3 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600`}>
                                <stat.icon size={18} />
                            </div>
                        </div>
                        <p className="text-2xl font-black text-gray-900 tracking-tight">
                            {stat.isCount ? stat.val : formatCurrency(stat.val)}
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 mt-1">{stat.trend}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Control Panel */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="premium-card p-6">
                        <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-6">Filter Period</h3>
                        <div className="space-y-2">
                            {['all', 'month', 'year'].map((tf) => (
                                <button
                                    key={tf}
                                    onClick={() => setTimeframe(tf)}
                                    className={`w-full px-5 py-3.5 rounded-2xl font-bold text-sm text-left transition-all duration-300 flex items-center justify-between border ${timeframe === tf
                                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-100 translate-x-1'
                                        : 'bg-white text-gray-500 border-gray-100 hover:border-indigo-200 hover:text-indigo-600'
                                        }`}
                                >
                                    {tf === 'all' ? 'Accumulated' : tf === 'month' ? 'Active Month' : 'Annual View'}
                                    {timeframe === tf && <ArrowUpRight size={14} />}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-indigo-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-200">
                        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-indigo-300 mb-2">Period Total</p>
                        <h2 className="text-4xl font-black tracking-tight mb-6">{formatCurrency(totalFiltered)}</h2>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-indigo-200">
                                <span>Revenue Distribution</span>
                                <span>100%</span>
                            </div>
                            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-white w-full rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ledger Table */}
                <div className="lg:col-span-3 premium-card overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-white">
                        <div>
                            <h2 className="text-lg font-black text-gray-900">Payment Ledger</h2>
                            <p className="text-xs font-bold text-gray-400 mt-0.5">Transactional breakdown of your service fees</p>
                        </div>
                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                            <DollarSign size={20} />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50/50">
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Client & Event</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Package Details</th>
                                    <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest">Completion Date</th>
                                    <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest">Revenue</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredEarnings.length > 0 ? filteredEarnings.map((earning) => (
                                    <tr key={earning._id} className="hover:bg-indigo-50/20 transition-all group cursor-default">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 rounded-xl bg-gray-50 flex items-center justify-center text-indigo-600 group-hover:bg-white border border-transparent group-hover:border-indigo-100 transition-all">
                                                    <User size={18} />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-black text-gray-900">{earning.clientName}</div>
                                                    <div className="text-[10px] text-gray-400 font-bold">{earning.eventType}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-2">
                                                <Package size={14} className="text-indigo-400" />
                                                <span className="text-xs font-black text-gray-600 uppercase tracking-wide">{earning.package}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-gray-900">{formatDate(earning.eventDate)}</span>
                                                <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest flex items-center gap-1 mt-0.5">
                                                    <Clock size={10} /> Dispatched
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="text-lg font-black text-gray-900">
                                                {formatCurrency(earning.amount)}
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-24 text-center">
                                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                                <CreditCard size={32} className="text-gray-200" />
                                            </div>
                                            <h3 className="text-xl font-black text-gray-900 tracking-tight">Wallet is Empty</h3>
                                            <p className="text-gray-400 font-bold mt-2">No successfully processed payments were found for this period.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
