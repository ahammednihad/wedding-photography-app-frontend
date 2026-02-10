import { useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../store/contexts/AuthContext';
import {
    Menu, X, LogOut, User, Bell, Search,
    ChevronRight, Camera
} from 'lucide-react';

export default function DashboardShell({ navItems, children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-[#FDFDFF] overflow-hidden font-sans selection:bg-blue-100 selection:text-blue-900">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-900/40 lg:hidden backdrop-blur-md transition-opacity duration-300"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-gray-100 transform transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1) lg:static lg:translate-x-0
                ${isSidebarOpen ? 'translate-x-0 overflow-y-auto' : '-translate-x-full shadow-none'}
                lg:shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)]
            `}>
                <div className="flex flex-col h-full bg-gradient-to-b from-white via-white to-blue-50/20">
                    {/* Sidebar Header */}
                    <div className="h-24 flex items-center px-10 border-b border-gray-50">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2.5 rounded-2xl text-white shadow-lg shadow-blue-500/20 group-hover:rotate-12 transition-transform duration-500">
                                <Camera size={26} />
                            </div>
                            <span className="text-3xl font-black text-gray-900 tracking-tighter">WedLens</span>
                        </Link>
                    </div>

                    {/* Nav Items */}
                    <nav className="flex-1 overflow-y-auto py-10 px-6 space-y-3">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) => `
                                    flex items-center gap-4 px-6 py-4 rounded-[1.25rem] text-sm font-black transition-all duration-300 group relative
                                    ${isActive
                                        ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30 scale-[1.02]'
                                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 active:scale-95'
                                    }
                                `}
                                onClick={() => setIsSidebarOpen(false)}
                            >
                                {({ isActive }) => (
                                    <>
                                        <div className={`transition-colors duration-300 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-blue-500'}`}>
                                            {item.icon}
                                        </div>
                                        <span className="tracking-widest uppercase text-[10px]">{item.label}</span>
                                        {isActive && (
                                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-sm animate-pulse"></div>
                                        )}
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </nav>

                    {/* User Profile Summary (Sidebar Bottom) */}
                    <div className="p-6 border-t border-gray-50 pb-8">
                        <div className="flex items-center gap-4 p-4 rounded-3xl bg-gray-50/80 border border-gray-100/50 backdrop-blur-sm group hover:bg-white hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-500">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 font-black text-lg shadow-inner">
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-black text-gray-900 truncate tracking-tight">{user?.name}</p>
                                <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">{user?.role}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Header */}
                <header className="h-24 bg-white/80 backdrop-blur-xl border-b border-gray-100 shrink-0 z-30 sticky top-0">
                    <div className="h-full px-8 sm:px-12 flex items-center justify-between">
                        {/* Left side actions */}
                        <div className="flex items-center gap-6">
                            <button
                                className="lg:hidden p-3 bg-gray-50 text-gray-500 hover:text-blue-600 rounded-2xl border border-gray-100 transition-all active:scale-95"
                                onClick={() => setIsSidebarOpen(true)}
                            >
                                <Menu size={24} />
                            </button>

                            <div className="hidden lg:flex items-center bg-gray-50 rounded-2xl px-5 py-3 gap-3 w-80 group focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:bg-white border border-gray-100 focus-within:border-blue-200 transition-all duration-300">
                                <Search size={20} className="text-gray-400 group-focus-within:text-blue-500" />
                                <input
                                    type="text"
                                    placeholder="Search entries..."
                                    className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-gray-400 font-medium"
                                />
                            </div>
                        </div>

                        {/* Right side actions */}
                        <div className="flex items-center gap-4 sm:gap-8">
                            <button className="hidden sm:flex p-3 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all relative border border-transparent hover:border-blue-100 active:scale-90">
                                <Bell size={24} />
                                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-bounce"></span>
                            </button>

                            <div className="h-10 w-px bg-gray-100 hidden sm:block mx-2"></div>

                            <div className="flex items-center gap-4 sm:gap-6">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-black text-gray-900 leading-none mb-1">{user?.name}</p>
                                    <div className="flex items-center gap-1.5 justify-end">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                        <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{user?.role} Access</p>
                                    </div>
                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="flex items-center justify-center p-3.5 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-[1.25rem] transition-all border border-gray-100 hover:border-red-100 group shadow-sm active:scale-90"
                                    title="Sign Out"
                                >
                                    <LogOut size={22} className="group-hover:-translate-x-1 transition-transform duration-300" />
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-y-auto p-8 sm:p-12 bg-[#FDFDFF] relative">
                    <div className="absolute top-0 right-0 w-full h-96 bg-gradient-to-b from-blue-50/30 to-transparent pointer-events-none"></div>
                    <div className="max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-6 duration-1000 cubic-bezier(0.4, 0, 0.2, 1) relative z-10">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
