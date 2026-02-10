import { useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../store/contexts/AuthContext';
import {
    LayoutDashboard,
    ClipboardList,
    Calendar,
    CheckSquare,
    DollarSign,
    UserCircle,
    LogOut,
    Menu,
    X,
    Bell,
    Search,
    Camera,
    Flashlight
} from 'lucide-react';

export default function PhotographerLayout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { to: "/photographer/dashboard", label: "Dashboard", icon: <Camera size={20} /> },
        { to: "/photographer/assignments", label: "Intel", icon: <Flashlight size={20} /> },
        { to: "/photographer/schedule", label: "Deployment", icon: <Calendar size={20} /> },
        { to: "/photographer/completed", label: "Archive", icon: <CheckSquare size={20} /> },
        { to: "/photographer/earnings", label: "Revenue", icon: <DollarSign size={20} /> },
        { to: "/photographer/profile", label: "Portfolio", icon: <UserCircle size={20} /> },
    ];

    return (
        <div className="flex h-screen bg-zinc-50 overflow-hidden font-sans selection:bg-emerald-100 selection:text-emerald-900">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-zinc-900/40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-72 bg-zinc-900 transform transition-transform duration-300 lg:static lg:translate-x-0
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex flex-col h-full">
                    {/* Sidebar Header */}
                    <div className="h-24 flex items-center px-8 border-b border-zinc-800">
                        <Link to="/" className="flex items-center gap-3">
                            <div className="bg-emerald-500 p-2.5 rounded-2xl text-white shadow-lg shadow-emerald-500/20">
                                <Camera size={24} />
                            </div>
                            <span className="text-2xl font-black text-white tracking-tighter italic">WedLens <span className="not-italic text-zinc-600">/</span> <span className="text-xs text-zinc-500 not-italic uppercase font-black tracking-widest bg-zinc-800 px-2 py-0.5 rounded ml-1">Artist</span></span>
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
                                        ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-500/20 translate-x-1'
                                        : 'text-zinc-500 hover:bg-zinc-800 hover:text-white'
                                    }
                                `}
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                {({ isActive }) => (
                                    <>
                                        {item.icon}
                                        {item.label}
                                        {isActive && (
                                            <div className="ml-auto w-1 h-1 rounded-full bg-white shadow-sm animate-pulse"></div>
                                        )}
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="p-6 border-t border-zinc-800">
                        <div className="flex items-center gap-3 p-3 rounded-2xl bg-zinc-800">
                            <div className="w-10 h-10 rounded-xl bg-zinc-700 flex items-center justify-center text-white font-bold">
                                {user?.name?.charAt(0) || 'P'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-black text-white truncate tracking-tight">{user?.name}</p>
                                <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">Expert Artist</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Bar */}
                <header className="h-24 bg-white border-b border-zinc-200 shrink-0 z-30 sticky top-0">
                    <div className="h-full px-8 md:px-12 flex items-center justify-between">
                        {/* Left */}
                        <div className="flex items-center gap-6">
                            <button
                                className="lg:hidden p-3 text-zinc-500 bg-zinc-50 border border-zinc-100 rounded-2xl transition-all"
                                onClick={() => setIsSidebarOpen(true)}
                            >
                                <Menu size={24} />
                            </button>
                            <div className="hidden lg:flex items-center bg-zinc-50 rounded-2xl px-5 py-3.5 gap-3 w-80 focus-within:ring-4 focus-within:ring-emerald-500/10 focus-within:bg-white border border-transparent focus-within:border-emerald-100 transition-all duration-300">
                                <Search size={20} className="text-zinc-400" />
                                <input
                                    type="text"
                                    placeholder="Search assignments..."
                                    className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-zinc-400 font-bold"
                                />
                            </div>
                        </div>

                        {/* Right */}
                        <div className="flex items-center gap-4 sm:gap-8">
                            <button className="p-3 text-zinc-400 hover:text-emerald-600 transition-colors relative active:scale-90">
                                <Bell size={24} />
                                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></span>
                            </button>
                            <div className="h-10 w-px bg-zinc-100 hidden sm:block mx-2"></div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-black text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all uppercase tracking-widest"
                            >
                                <LogOut size={18} />
                                <span>Logout</span>
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
