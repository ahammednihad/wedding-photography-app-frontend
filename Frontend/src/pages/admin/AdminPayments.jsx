import { useEffect, useState } from "react";
import { apiService as api } from "../../services/api";
import { useToast } from "../../store/contexts/ToastContext";
import { formatCurrency, formatDate } from "../../utils/helpers";
import {
    CreditCard,
    Search,
    Download,
    Filter,
    ArrowUpRight,
    ArrowDownLeft,
    Clock,
    CheckCircle2,
    MoreHorizontal,
    TrendingUp,
    Activity,
    Zap,
    ShieldCheck,
    Globe,
    DollarSign,
    Briefcase
} from "lucide-react";

export default function AdminPayments() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const { showToast } = useToast();

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            setLoading(true);
            const response = await api.get("/admin/payments");
            setPayments(response.data);
        } catch (err) {
            showToast("Treasury synchronization failed.", "error");
        } finally {
            setLoading(false);
        }
    };

    const filteredPayments = payments.filter(payment => {
        const term = searchTerm.toLowerCase();
        const matchesSearch =
            payment.clientName?.toLowerCase().includes(term) ||
            payment.transactionId?.toLowerCase().includes(term) ||
            payment.clientEmail?.toLowerCase().includes(term);
        const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const stats = {
        totalRevenue: payments.reduce((acc, curr) => acc + (curr.amount || 0), 0),
        successfulCount: payments.filter(p => p.status === 'completed').length,
        pendingVolume: payments.filter(p => p.status === 'pending').reduce((acc, curr) => acc + (curr.amount || 0), 0)
    };

    if (loading) return (
        <div className="flex flex-col justify-center items-center h-[60vh] space-y-4">
            <div className="h-10 w-10 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Loading Payments</p>
        </div>
    );

    return (
        <div className="space-y-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic">Payment <span className="not-italic text-slate-400">/</span> Management</h1>
                    <p className="text-slate-500 font-medium mt-2">Track and manage all transactions and financial records.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
                        <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Payments Secure</span>
                    </div>
                    <button className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-black transition-all active:scale-95 flex items-center gap-2">
                        <Download size={18} /> Export Data
                    </button>
                </div>
            </div>

            {/* Stats Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { label: 'Total Revenue', val: formatCurrency(stats.totalRevenue), icon: TrendingUp, color: 'emerald' },
                    { label: 'Completed', val: stats.successfulCount, icon: ShieldCheck, color: 'indigo' },
                    { label: 'Pending', val: formatCurrency(stats.pendingVolume), icon: Activity, color: 'amber' },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm flex items-center justify-between transition-all hover:border-slate-300 group">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">{stat.label}</p>
                            <p className="text-4xl font-black text-slate-900 italic tracking-tight">{stat.val}</p>
                        </div>
                        <div className={`p-5 rounded-3xl bg-${stat.color}-50 text-${stat.color}-600 group-hover:scale-110 transition-transform shadow-sm`}>
                            <stat.icon size={28} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Ledger Controls */}
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-8">
                <div className="flex-1 relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search Transaction Trace or Member Identity..."
                        className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-slate-100 focus:border-slate-200 outline-none transition-all placeholder:text-slate-400 text-sm font-bold"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-3 px-6 py-4 bg-slate-50 border border-transparent rounded-2xl focus-within:bg-white focus-within:border-slate-200 transition-all min-w-[240px]">
                    <Filter size={20} className="text-slate-400" />
                    <select
                        className="bg-transparent outline-none text-xs font-black text-slate-900 w-full cursor-pointer appearance-none uppercase tracking-widest"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">Pulse: All Transactions</option>
                        <option value="completed">Pulse: Settled Nodes</option>
                        <option value="pending">Pulse: Processing Stream</option>
                        <option value="failed">Pulse: Aborted Logic</option>
                    </select>
                </div>
            </div>

            {/* Main Ledger Table */}
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Transaction Trace</th>
                            <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Beneficiary Identity</th>
                            <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Valuation Index</th>
                            <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Temporal Status</th>
                            <th className="px-10 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pr-12">Audit Logic</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filteredPayments.length > 0 ? (
                            filteredPayments.map((payment) => (
                                <tr key={payment._id} className="hover:bg-indigo-50/10 transition-all group">
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg shadow-slate-200 group-hover:scale-110 transition-transform">
                                                <CreditCard size={18} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-slate-900 tracking-tight uppercase">{payment.transactionId || payment._id.slice(-12).toUpperCase()}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{formatDate(payment.createdAt)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <p className="text-sm font-black text-slate-900 tracking-tight">{payment.clientName || "System Process"}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{payment.clientEmail}</p>
                                    </td>
                                    <td className="px-10 py-8">
                                        <p className="text-base font-black text-slate-900 italic tracking-tight">{formatCurrency(payment.amount)}</p>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{payment.paymentMethod || 'SECURE_GATEWAY'}</p>
                                    </td>
                                    <td className="px-10 py-8">
                                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all shadow-sm ${payment.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                            payment.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                'bg-rose-50 text-rose-700 border-rose-100'
                                            }`}>
                                            {payment.status}
                                        </span>
                                    </td>
                                    <td className="px-10 py-8 text-right pr-12">
                                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                                            <button className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-slate-900 hover:border-slate-200 rounded-2xl transition-all shadow-sm">
                                                <ArrowUpRight size={18} />
                                            </button>
                                            <button className="p-3 bg-white border border-slate-100 text-slate-400 hover:text-slate-900 hover:border-slate-200 rounded-2xl transition-all shadow-sm">
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-10 py-32 text-center text-slate-400">
                                    <Activity size={48} className="mx-auto mb-6 opacity-20" />
                                    <p className="font-black text-sm uppercase tracking-[0.3em] italic">Ledger Null / Zero Flux</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
