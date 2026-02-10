import { useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../store/contexts/AuthContext';
import {
    LayoutDashboard,
    Calendar,
    History,
    CreditCard,
    User,
    LogOut,
    Menu,
    X,
    Bell,
    Search,
    Sparkles,
    Heart,
    User as UserIcon
} from 'lucide-react';

export default function ClientLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Safety check - although PrivateRoute handles this, it prevents render crashes
    if (!user) return null;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { to: "/client/dashboard", label: "Overview", icon: <LayoutDashboard size={20} /> },
        { to: "/client/photographers", label: "Artists", icon: <UserIcon size={20} /> },
        { to: "/client/bookings/new", label: "Build Memory", icon: <Sparkles size={20} /> },
        { to: "/client/bookings", label: "My Sessions", icon: <History size={20} /> },
        { to: "/client/payments", label: "Ledger", icon: <CreditCard size={20} /> },
        { to: "/client/profile", label: "Identity", icon: <UserIcon size={20} /> },
    ];

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans selection:bg-indigo-100 selection:text-indigo-900">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 lg:static lg:translate-x-0
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex flex-col h-full">
                    {/* Sidebar Header */}
                    <div className="h-24 flex items-center px-8 border-b border-slate-100">
                        <Link to="/" className="flex items-center gap-3">
                            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-2.5 rounded-2xl text-white shadow-lg shadow-indigo-100">
                                <Heart size={24} />
                            </div>
                            <span className="text-2xl font-black text-slate-900 tracking-tighter italic">WedLens <span className="not-italic text-indigo-500">/</span> <span className="text-xs text-slate-400 not-italic uppercase font-black tracking-widest bg-slate-50 px-2 py-0.5 rounded ml-1">Client</span></span>
                        </Link>
                    </div>

                    {/* Nav Items */}
                    <nav className="flex-1 overflow-y-auto py-10 px-4 space-y-2">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) => `
                                    flex items-center gap-4 px-4 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all
                                    ${isActive
                                        ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 translate-x-1'
                                        : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'
                                    }
                                `}
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                {({ isActive }) => (
                                    <>
                                        {item.icon}
                                        {item.label}
                                        {isActive && (
                                            <div className="ml-auto w-1 h-1 rounded-full bg-white shadow-sm"></div>
                                        )}
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="p-6 border-t border-slate-100">
                        <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100">
                            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-black text-slate-900 truncate tracking-tight">{user?.name}</p>
                                <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">Client Member</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Bar */}
                <header className="h-24 bg-white border-b border-slate-200 shrink-0 z-30 sticky top-0">
                    <div className="h-full px-8 md:px-12 flex items-center justify-between">
                        {/* Left */}
                        <div className="flex items-center gap-6">
                            <button
                                className="lg:hidden p-3 text-slate-500 bg-slate-50 border border-slate-100 rounded-2xl transition-all"
                                onClick={() => setIsSidebarOpen(true)}
                            >
                                <Menu size={24} />
                            </button>
                            <div className="hidden lg:flex items-center bg-slate-50 rounded-2xl px-5 py-3.5 gap-3 w-80 focus-within:ring-4 focus-within:ring-indigo-500/10 focus-within:bg-white border border-transparent focus-within:border-indigo-100 transition-all duration-300">
                                <Search size={20} className="text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search your memories..."
                                    className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-slate-400 font-bold"
                                />
                            </div>
                        </div>

                        {/* Right */}
                        <div className="flex items-center gap-4 sm:gap-8">
                            <button className="p-3 text-slate-400 hover:text-indigo-600 transition-colors relative active:scale-90">
                                <Bell size={24} />
                                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
                            </button>
                            <div className="h-10 w-px bg-slate-100 hidden sm:block mx-2"></div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 px-5 py-3 text-[10px] font-black text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all uppercase tracking-widest"
                            >
                                <LogOut size={20} />
                                <span className="hidden sm:inline">Exit Console</span>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-8 md:p-12">
                    <div className="max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
