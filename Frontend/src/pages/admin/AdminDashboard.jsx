import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiService as api } from "../../services/api";
import { useAuth } from "../../store/contexts/AuthContext";
import {
  Users,
  Calendar,
  DollarSign,
  Activity,
  ArrowRight,
  ShieldAlert,
  Search,
  Camera,
  UserCheck,
  TrendingUp,
  BarChart2,
  Bell,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  FileText
} from "lucide-react";
import { formatCurrency } from "../../utils/helpers";

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboardStats, setDashboardStats] = useState({
    users: { total: 0, clients: 0, photographers: 0, pendingPhotographers: 0 },
    bookings: { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0 },
    revenue: { total: 0 },
    recentBookings: []
  });
  const [systemAlerts, setSystemAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get dynamic greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch stats and alerts concurrently
      const [statsResponse, alertsResponse] = await Promise.all([
        api.getAdminStats(),
        api.getAdminConflicts()
      ]);

      setDashboardStats(statsResponse.data);
      setSystemAlerts(alertsResponse.data || []);
    } catch (err) {
      console.error("Dashboard Data Error", err);
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    pending: 'bg-amber-50 text-amber-700 border-amber-100',
    completed: 'bg-blue-50 text-blue-700 border-blue-100',
    cancelled: 'bg-rose-50 text-rose-700 border-rose-100',
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return <CheckCircle size={14} className="text-emerald-500" />;
      case 'pending': return <Clock size={14} className="text-amber-500" />;
      case 'completed': return <CheckCircle size={14} className="text-blue-500" />;
      case 'cancelled': return <XCircle size={14} className="text-rose-500" />;
      default: return <Activity size={14} className="text-gray-400" />;
    }
  };

  if (loading) return (
    <div className="flex h-[60vh] flex-col items-center justify-center space-y-4">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] animate-pulse">Initializing Admin Hub</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Admin Header Section */}
      <div className="relative overflow-hidden bg-slate-900 p-8 md:p-10 rounded-[40px] border border-slate-800 shadow-2xl group">
        {/* Background Effects */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>

        <div className="relative flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-8">
            <div className="h-24 w-24 rounded-[32px] bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center text-white shadow-2xl shadow-indigo-900/50 relative shrink-0">
              <Activity size={40} className="group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute -top-2 -right-2 h-8 w-8 bg-emerald-500 rounded-full border-4 border-slate-900 flex items-center justify-center animate-pulse">
                <TrendingUp size={14} className="text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-indigo-500/30">System Admin</span>
                <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                  <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  Online
                </span>
              </div>
              <h1 className="text-4xl font-black text-white tracking-tighter">
                {getGreeting()}, <span className="text-indigo-400">{user?.name?.split(' ')[0] || 'Admin'}</span>
              </h1>
              <p className="text-slate-400 font-medium mt-2 text-sm max-w-md">
                System overview and operational controls at your fingertips.
              </p>
            </div>
          </div>

          {/* Quick Stats Summary */}
          <div className="flex gap-4">
            <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-2xl border border-slate-700 text-center min-w-[100px]">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Users</p>
              <p className="text-2xl font-black text-white">{dashboardStats.users.total}</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-2xl border border-slate-700 text-center min-w-[100px]">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Bookings</p>
              <p className="text-2xl font-black text-white">{dashboardStats.bookings.confirmed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Grid - Interactive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: 'Total Revenue',
            value: formatCurrency(dashboardStats.revenue.total),
            icon: DollarSign,
            color: 'indigo',
            trend: '+12.5%',
            desc: 'All time earnings',
            link: '/admin/payments'
          },
          {
            label: 'Total Users',
            value: dashboardStats.users.total,
            icon: Users,
            color: 'blue',
            trend: '+5',
            desc: `${dashboardStats.users.photographers} Photographers`,
            link: '/admin/users'
          },
          {
            label: 'Conf. Bookings',
            value: dashboardStats.bookings.confirmed,
            icon: Calendar,
            color: 'emerald',
            trend: 'Active',
            desc: `${dashboardStats.bookings.pending} Pending`,
            link: '/admin/bookings'
          },
          {
            label: 'Pending Approvals',
            value: dashboardStats.users.pendingPhotographers,
            icon: UserCheck,
            color: 'amber',
            trend: 'Action',
            desc: 'Awaiting Verification',
            link: '/admin/photographers'
          },
        ].map((stat, i) => (
          <Link to={stat.link} key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer block">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon size={22} />
              </div>
              <span className={`px-2 py-1 round-lg text-[10px] font-black uppercase tracking-widest bg-${stat.color}-50 text-${stat.color}-600 rounded-lg`}>
                {stat.trend}
              </span>
            </div>
            <div>
              <h3 className="text-3xl font-black text-slate-900 mb-1">{stat.value}</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{stat.label}</p>
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-2 group-hover:text-slate-400 transition-colors">{stat.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* 3. Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Column: Recent Orders/Bookings */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <div>
                <h2 className="text-lg font-black text-slate-900 italic">Recent <span className="not-italic text-slate-300">/</span> Bookings</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Latest platform activity</p>
              </div>
              <Link to="/admin/bookings" className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-sm">
                <ArrowRight size={18} />
              </Link>
            </div>

            <div className="flex-1 overflow-y-auto max-h-[400px]">
              {dashboardStats.recentBookings && dashboardStats.recentBookings.length > 0 ? (
                <div className="divide-y divide-slate-50">
                  {dashboardStats.recentBookings.map((booking) => (
                    <div key={booking._id} className="p-6 hover:bg-slate-50/80 transition-colors group">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                            {new Date(booking.eventDate).getDate()}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm">{booking.eventType || 'Wedding Event'}</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                              {booking.clientId?.name || 'Unknown Client'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 ${statusColors[booking.status] || 'bg-gray-100 text-gray-600'}`}>
                            {getStatusIcon(booking.status)}
                            {booking.status}
                          </span>
                          <div className="text-right hidden sm:block">
                            <p className="text-sm font-black text-slate-900">{formatCurrency(booking.amount)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center p-8">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-300">
                    <Calendar size={24} />
                  </div>
                  <p className="text-slate-500 font-bold text-sm">No recent bookings found.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Alerts & Quick Actions */}
        <div className="space-y-6 lg:col-span-1">

          {/* System Alerts Card */}
          <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 text-amber-500 rounded-xl">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-sm">System Alerts</h3>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Requires Attention</p>
                </div>
              </div>
              <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-1 rounded-md">{systemAlerts.length}</span>
            </div>

            <div className="space-y-3">
              {systemAlerts.length > 0 ? (
                systemAlerts.slice(0, 3).map((alert, idx) => (
                  <div key={idx} className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl flex items-start gap-3">
                    <ShieldAlert size={16} className="text-amber-500 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-slate-700">{alert.message || 'System conflict detected'}</p>
                      <p className="text-[10px] text-slate-400 mt-1">Action needed</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <CheckCircle size={32} className="mx-auto text-emerald-400 mb-2" />
                  <p className="text-xs font-bold text-slate-400">All systems operational</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="bg-slate-900 rounded-[32px] p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl -mr-10 -mt-10"></div>

            <h3 className="font-black italic text-lg mb-6 relative z-10">Quick Actions</h3>

            <div className="space-y-3 relative z-10">
              {[
                { label: 'Manage Users', icon: Users, link: '/admin/users' },
                { label: 'Verify Photographers', icon: Camera, link: '/admin/photographers' },
                { label: 'Activity Logs', icon: FileText, link: '/admin/activity' },
              ].map((action, i) => (
                <Link
                  key={i}
                  to={action.link}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group/item"
                >
                  <div className="flex items-center gap-3">
                    <action.icon size={16} className="text-indigo-400" />
                    <span className="text-xs font-bold">{action.label}</span>
                  </div>
                  <ArrowRight size={14} className="text-slate-500 group-hover/item:text-white transition-colors" />
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
