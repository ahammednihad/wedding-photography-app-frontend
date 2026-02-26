import { useEffect, useState } from "react";
import { apiService as api } from "../../services/api";
import { useToast } from "../../store/contexts/ToastContext";
import {
  Trash2,
  CheckCircle2,
  Ban,
  UserCheck,
  Search,
  Filter,
  Users,
  ShieldAlert,
  UserPlus,
  Shield,
  Zap,
  MoreVertical,
  Activity
} from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const { showToast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.getAllUsers();
      setUsers(response.data);
    } catch (err) {
      showToast("Access Denied or Connection Lost", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleBlock = async (userId) => {
    try {
      await api.blockUser(userId);
      showToast("Access Restricted", "success");
      fetchUsers();
    } catch (err) {
      showToast("Restriction Failed", "error");
    }
  };

  const handleUnblock = async (userId) => {
    try {
      await api.unblockUser(userId);
      showToast("Access Restored", "success");
      fetchUsers();
    } catch (err) {
      showToast("Restoration Failed", "error");
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("CRITICAL: Permanently purge this user account?")) return;
    try {
      await api.deleteUser(userId);
      showToast("Account Purged", "success");
      fetchUsers();
    } catch (err) {
      showToast("Purge Failed", "error");
    }
  };

  const filteredUsers = users.filter(user => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = user.name?.toLowerCase().includes(term) ||
      user.email?.toLowerCase().includes(term);
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleStyle = (role) => {
    switch (role) {
      case 'admin': return 'bg-slate-900 text-white border-slate-900';
      case 'photographer': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'client': return 'bg-slate-50 text-slate-700 border-slate-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  if (loading) return (
    <div className="flex flex-col justify-center items-center h-[60vh] space-y-4">
      <div className="h-10 w-10 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Accessing Member Registry</p>
    </div>
  );

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter italic">User <span className="not-italic text-slate-400">/</span> Management</h1>
          <p className="text-slate-500 font-medium mt-2">Manage all registered clients and photographers on the platform.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
            <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{users.length} Total Users</span>
          </div>
          <button className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-black transition-all active:scale-95 flex items-center gap-2">
            <UserPlus size={18} /> Add User
          </button>
        </div>
      </div>

      {/* Stats Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Total Clients', val: users.filter(u => u.role === 'client').length, icon: UserPlus, color: 'indigo' },
          { label: 'Photographers', val: users.filter(u => u.role === 'photographer').length, icon: Users, color: 'violet' },
          { label: 'Disabled', val: users.filter(u => !u.isActive).length, icon: ShieldAlert, color: 'rose' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-slate-300 transition-all">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">{stat.label}</p>
              <p className="text-4xl font-black text-slate-900 italic tracking-tight">{stat.val}</p>
            </div>
            <div className={`p-5 rounded-3xl bg-${stat.color}-50 text-${stat.color}-600 group-hover:scale-110 transition-transform`}>
              <stat.icon size={28} />
            </div>
          </div>
        ))}
      </div>

      {/* Control Interface */}
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
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">Role: All</option>
            <option value="client">Role: Clients</option>
            <option value="photographer">Role: Photographers</option>
            <option value="admin">Role: Admins</option>
          </select>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">User</th>
              <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Role</th>
              <th className="px-10 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
              <th className="px-10 py-6 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pr-12">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-indigo-50/10 transition-all group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-5">
                      <div className="h-12 w-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white text-xs font-black shadow-lg shadow-slate-200 group-hover:scale-110 transition-transform">
                        {user.name?.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-900 tracking-tight">{user.name}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.15em] mt-1">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${getRoleStyle(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-10 py-8">
                    {!user.isActive ? (
                      <span className="flex items-center gap-2 text-rose-600">
                        <div className="h-1.5 w-1.5 bg-rose-600 rounded-full"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest">Disabled</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-emerald-600">
                        <div className="h-1.5 w-1.5 bg-emerald-600 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-black uppercase tracking-widest">Active</span>
                      </span>
                    )}
                  </td>
                  <td className="px-10 py-8 text-right pr-12">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                      {user.isActive ? (
                        <button
                          onClick={() => handleBlock(user._id)}
                          className="p-3 bg-white border border-rose-100 text-rose-400 hover:text-white hover:bg-rose-600 rounded-2xl transition-all shadow-sm"
                          title="Block User"
                        >
                          <Ban size={18} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUnblock(user._id)}
                          className="p-3 bg-slate-900 text-white rounded-2xl hover:bg-black transition-all shadow-xl shadow-slate-200"
                          title="Unblock User"
                        >
                          <UserCheck size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="p-3 bg-white border border-slate-100 text-slate-300 hover:text-rose-600 hover:border-rose-200 rounded-2xl transition-all shadow-sm"
                        title="Delete User"
                      >
                        <Trash2 size={18} />
                      </button>
                      <button className="p-3 bg-white border border-slate-100 text-slate-300 hover:text-slate-900 rounded-2xl transition-all shadow-sm">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-10 py-32 text-center text-slate-400">
                  <Activity size={48} className="mx-auto mb-6 opacity-20" />
                  <p className="font-black text-sm uppercase tracking-[0.3em] italic">No users found</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
