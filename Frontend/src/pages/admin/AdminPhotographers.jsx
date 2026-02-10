import { useState, useEffect } from 'react';
import { apiService as api } from '../../services/api';
import { useToast } from '../../store/contexts/ToastContext';
import {
    Camera,
    ShieldCheck,
    ShieldAlert,
    MoreHorizontal,
    Search,
    Filter,
    CheckCircle2,
    XCircle,
    Ban,
    ExternalLink,
    Star,
    Zap,
    Globe,
    Activity,
    UserCheck,
    Award
} from 'lucide-react';
import { formatDate } from '../../utils/helpers';

export default function AdminPhotographers() {
    const [photographers, setPhotographers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const { showToast } = useToast();

    useEffect(() => {
        fetchPhotographers();
    }, []);

    const fetchPhotographers = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/photographers');
            setPhotographers(response.data);
        } catch (error) {
            showToast('Registry synchronization failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, action) => {
        try {
            await api.put(`/admin/photographers/${id}/${action}`);
            showToast(`Status updated: ${action}`, 'success');
            fetchPhotographers();
        } catch (error) {
            showToast('Operation failed', 'error');
        }
    };

    const filtered = photographers.filter(p => {
        const matchesSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' ||
            (statusFilter === 'approved' && p.isApproved) ||
            (statusFilter === 'pending' && !p.isApproved) ||
            (statusFilter === 'blocked' && !p.isActive);
        return matchesSearch && matchesStatus;
    });

    const getStatusStyle = (status) => {
        switch (status) {
            case 'approved': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
            case 'pending': return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'blocked': return 'bg-rose-50 text-rose-700 border-rose-100';
            default: return 'bg-slate-50 text-slate-700 border-slate-100';
        }
    };

    if (loading) return (
        <div className="flex flex-col justify-center items-center h-[60vh] space-y-4">
            <div className="h-10 w-10 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Synchronizing Expert Registry</p>
        </div>
    );

    return (
        <div className="space-y-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic">Photographer <span className="not-italic text-slate-400">/</span> Management</h1>
                    <p className="text-slate-500 font-medium mt-2">Manage and verify professional photographers on the platform.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
                        <Camera size={18} className="text-indigo-500" />
                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{photographers.length} Total Pros</span>
                    </div>
                    <button onClick={fetchPhotographers} className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-black transition-all active:scale-95 flex items-center gap-2">
                        <Activity size={18} /> Refresh List
                    </button>
                </div>
            </div>

            {/* Stats Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { label: 'Approved', val: photographers.filter(p => p.isApproved && p.isActive).length, icon: ShieldCheck, color: 'emerald' },
                    { label: 'Pending Approval', val: photographers.filter(p => !p.isApproved && p.isActive).length, icon: ShieldAlert, color: 'amber' },
                    { label: 'Blocked', val: photographers.filter(p => !p.isActive).length, icon: Ban, color: 'rose' },
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

            {/* Search and Filters */}
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-8">
                <div className="flex-1 relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
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
                        <option value="all">Status: All</option>
                        <option value="pending">Status: Pending</option>
                        <option value="approved">Status: Approved</option>
                        <option value="blocked">Status: Blocked</option>
                    </select>
                </div>
            </div>

            {/* Photographers Table */}
            <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="bg-slate-50/50 border-b border-slate-100">
                            <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Photographer</th>
                            <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Stats & Info</th>
                            <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                            <th className="px-10 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pr-12">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {filtered.length > 0 ? (
                            filtered.map(p => (
                                <tr key={p._id} className="hover:bg-indigo-50/10 transition-all group">
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-5">
                                            <div className="h-14 w-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white text-xs font-black shadow-lg shadow-slate-200 group-hover:scale-110 transition-transform overflow-hidden relative">
                                                {p.avatar ? (
                                                    <img src={p.avatar} alt="" className="w-full h-full object-cover opacity-80" />
                                                ) : (
                                                    <span className="relative z-10">{p.name?.charAt(0)}</span>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent"></div>
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-slate-900 tracking-tight">{p.name}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.15em] mt-1">{p.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2">
                                                <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 rounded-md">
                                                    <Star size={10} className="text-amber-500 fill-amber-500" />
                                                    <span className="text-[10px] font-black text-amber-700">{p.rating || '0.0'}</span>
                                                </div>
                                                <span className="text-slate-200">•</span>
                                                <div className="flex items-center gap-1 px-2 py-0.5 bg-indigo-50 rounded-md">
                                                    <Award size={10} className="text-indigo-600" />
                                                    <span className="text-[10px] font-black text-indigo-700">{p.completedEvents || 0} Jobs</span>
                                                </div>
                                            </div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.specialization || 'Professional Photographer'}</p>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        {!p.isActive ? (
                                            <span className="px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all bg-rose-50 text-rose-700 border-rose-100 shadow-sm">
                                                Blocked
                                            </span>
                                        ) : p.isApproved ? (
                                            <span className="px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all bg-emerald-50 text-emerald-700 border-emerald-100 shadow-sm">
                                                Approved
                                            </span>
                                        ) : (
                                            <span className="px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all bg-amber-50 text-amber-700 border-amber-100 shadow-sm">
                                                Pending
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-10 py-8 text-right pr-12">
                                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                                            {!p.isApproved && p.isActive && (
                                                <>
                                                    <button
                                                        onClick={() => handleAction(p._id, 'approve')}
                                                        className="p-3 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                                                        title="Approve Photographer"
                                                    >
                                                        <CheckCircle2 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(p._id, 'reject')}
                                                        className="p-3 bg-rose-50 text-rose-600 border border-rose-100 rounded-2xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                                                        title="Reject Request"
                                                    >
                                                        <XCircle size={18} />
                                                    </button>
                                                </>
                                            )}

                                            {p.isApproved && p.isActive && (
                                                <button
                                                    onClick={() => handleAction(p._id, 'block')}
                                                    className="p-3 bg-amber-50 text-amber-600 border border-amber-100 rounded-2xl hover:bg-amber-600 hover:text-white transition-all shadow-sm"
                                                    title="Block Photographer"
                                                >
                                                    <Ban size={18} />
                                                </button>
                                            )}

                                            {!p.isActive && (
                                                <button
                                                    onClick={() => handleAction(p._id, 'unblock')}
                                                    className="p-3 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                                                    title="Unblock Photographer"
                                                >
                                                    <CheckCircle2 size={18} />
                                                </button>
                                            )}

                                            <button className="p-3 bg-slate-50 text-slate-400 border border-slate-100 rounded-2xl hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-10 py-32 text-center text-slate-400">
                                    <Activity size={48} className="mx-auto mb-6 opacity-20" />
                                    <p className="font-black text-sm uppercase tracking-[0.3em] italic">No photographers found</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
