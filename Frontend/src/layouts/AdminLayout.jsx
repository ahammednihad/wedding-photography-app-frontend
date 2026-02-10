import { useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../store/contexts/AuthContext';
import {
    LayoutDashboard,
    Users,
    Camera,
    Calendar,
    CreditCard,
    Settings,
    LogOut,
    Menu,
    X,
    Bell,
    ShieldAlert,
    ChevronRight,
    Search
} from 'lucide-react';

const navItems = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { to: '/admin/users', label: 'Clients', icon: <Users size={20} /> },
    { to: '/admin/photographers', label: 'Partners', icon: <Camera size={20} /> },
    { to: '/admin/bookings', label: 'Schedule', icon: <Calendar size={20} /> },
    { to: '/admin/assignments', label: 'Deployment', icon: <ShieldAlert size={20} /> },
    { to: '/admin/payments', label: 'Treasury', icon: <CreditCard size={20} /> },
    { to: '/admin/activity', label: 'Log Stream', icon: <Bell size={20} /> },
];

export default function AdminLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans selection:bg-blue-100 selection:text-blue-900">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-72 bg-gray-900 transform transition-transform duration-300 lg:static lg:translate-x-0
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex flex-col h-full">
                    {/* Sidebar Header */}
                    <div className="h-20 flex items-center px-8 border-b border-gray-800">
                        <Link to="/" className="flex items-center gap-3">
                            <div className="bg-blue-600 p-2 rounded-lg text-white">
                                <ShieldAlert size={24} />
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight italic">WedLens <span className="text-xs text-gray-500 not-italic uppercase font-black tracking-widest bg-gray-800 px-2 py-0.5 rounded ml-1">Admin</span></span>
                        </Link>
                    </div>

                    {/* Nav Items */}
                    <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-1">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) => `
                                    flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all
                                    ${isActive
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                    }
                                `}
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                {({ isActive }) => (
                                    <>
                                        {item.icon}
                                        {item.label}
                                        {isActive && (
                                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                                        )}
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="p-4 border-t border-gray-800">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-800/50">
                            <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center text-white font-bold">
                                {user?.name?.charAt(0) || 'A'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                                <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest">System Administrator</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Bar */}
                <header className="h-20 bg-white border-b border-gray-200 shrink-0 z-30 sticky top-0">
                    <div className="h-full px-8 flex items-center justify-between">
                        {/* Left */}
                        <div className="flex items-center gap-4">
                            <button
                                className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                                onClick={() => setIsSidebarOpen(true)}
                            >
                                <Menu size={24} />
                            </button>
                            <div className="hidden md:flex items-center bg-gray-100 rounded-xl px-4 py-2 gap-3 w-72 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all border border-transparent focus-within:bg-white focus-within:border-blue-200">
                                <Search size={18} className="text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search everything..."
                                    className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-gray-400 font-bold"
                                />
                                <div className="px-1.5 py-0.5 rounded border border-gray-200 bg-white text-[10px] font-black text-gray-400 shadow-sm">
                                    CTRL K
                                </div>
                            </div>
                        </div>

                        {/* Right */}
                        <div className="flex items-center gap-6">
                            <Link to="/admin/activity" className="p-2 text-gray-400 hover:text-gray-600 relative transition-colors">
                                <Bell size={22} />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                            </Link>
                            <div className="h-8 w-px bg-gray-200"></div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-black text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all uppercase tracking-widest"
                            >
                                <LogOut size={18} />
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-8 lg:p-12">
                    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
