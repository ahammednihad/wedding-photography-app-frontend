import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../store/contexts/AuthContext";
import { ROUTES, ROLES } from "../../utils/constants";
import { Menu, X, LogOut, User, Camera } from "lucide-react";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  const navLinks = {
    [ROLES.ADMIN]: [
      { to: ROUTES.ADMIN_DASHBOARD, label: "Dashboard" },
      { to: ROUTES.ADMIN_USERS, label: "Users" },
      { to: ROUTES.ADMIN_BOOKINGS, label: "Bookings" },
    ],
    [ROLES.PHOTOGRAPHER]: [
      { to: ROUTES.PHOTOGRAPHER_DASHBOARD, label: "Dashboard" },
      { to: ROUTES.PHOTOGRAPHER_PROFILE, label: "My Profile" },
      { to: ROUTES.PHOTOGRAPHER_BOOKINGS, label: "Assignments" },
    ],
    [ROLES.CLIENT]: [
      { to: ROUTES.CLIENT_DASHBOARD, label: "Dashboard" },
      { to: ROUTES.CLIENT_MY_BOOKINGS, label: "My Bookings" },
      { to: ROUTES.CLIENT_PROFILE, label: "Profile" },
    ],
  };

  const currentLinks = user ? navLinks[user.role] : [];

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                <Camera size={20} />
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">WedLens</span>
            </Link>
          </div>

          <div className="hidden md:flex md:items-center md:space-x-8">
            {isAuthenticated ? (
              <>
                {currentLinks?.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors ${location.pathname === link.to
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-blue-600"
                      }`}
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="flex items-center ml-4 space-x-4 border-l pl-4 border-gray-200">
                  <div className="text-sm text-right hidden lg:block">
                    <div className="font-medium text-gray-900">{user?.name}</div>
                    <div className="text-xs text-gray-500 capitalize">{user?.role}</div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-6">
                <Link to="/contact" className="text-gray-500 hover:text-blue-600 font-medium text-sm transition-colors">
                  Contact
                </Link>
                <Link to={ROUTES.LOGIN} className="text-gray-500 hover:text-blue-600 font-medium text-sm transition-colors">
                  Sign In
                </Link>
                <Link
                  to={ROUTES.REGISTER}
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition shadow-sm shadow-blue-200"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="pt-2 pb-3 space-y-1">
            {isAuthenticated ? (
              <>
                <div className="px-4 py-3 border-b border-gray-100 mb-2">
                  <p className="font-bold text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                </div>
                {currentLinks?.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${location.pathname === link.to
                      ? "bg-blue-50 border-blue-500 text-blue-700"
                      : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                      }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full text-left block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-red-600 hover:bg-red-50 hover:border-red-200"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="p-4 space-y-2">
                <Link
                  to={ROUTES.LOGIN}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2 border border-gray-200 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Sign In
                </Link>
                <Link
                  to={ROUTES.REGISTER}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
