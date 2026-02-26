import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./store/contexts/AuthContext";
import PrivateRoute from "./utils/PrivateRoute";
import Navbar from "./components/layout/Navbar";
import { ROUTES } from "./utils/constants";

// Layouts
import { AdminLayout, ClientLayout, PhotographerLayout } from "./layouts";

// Core Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";

// Client Pages
import ClientDashboard from "./pages/client/ClientDashboard";
import ClientBookings from "./pages/client/ClientBookings";
import ClientPhotographers from "./pages/client/ClientPhotographers";
import ClientProfile from "./pages/client/ClientProfile";
import CreateBooking from "./pages/client/CreateBooking";
import ClientPayments from "./pages/client/ClientPayments";
import Payment from "./pages/client/Payment";

// Photographer Pages
import PhotographerDashboard from "./pages/photographer/PhotographerDashboard";
import Assignments from "./pages/photographer/Assignments";
import Schedule from "./pages/photographer/Schedule";
import Completed from "./pages/photographer/Completed";
import Earnings from "./pages/photographer/Earnings";
import PhotographerProfile from "./pages/photographer/PhotographerProfile";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminPhotographers from "./pages/admin/AdminPhotographers";
import AdminAssignments from "./pages/admin/AdminAssignments";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminActivity from "./pages/admin/AdminActivity";

// Common Pages
import Chat from "./pages/common/Chat";

export default function App() {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  const getDefaultRoute = () => {
    if (!isAuthenticated || !user?.role) return ROUTES.LOGIN;
    if (user.role === "admin") return ROUTES.ADMIN_DASHBOARD;
    if (user.role === "photographer") return ROUTES.PHOTOGRAPHER_DASHBOARD;
    if (user.role === "client") return ROUTES.CLIENT_DASHBOARD;

    // Default fallback to login if role is unknown
    return ROUTES.LOGIN;
  };

  const isDashboard = location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/client") ||
    location.pathname.startsWith("/photographer");

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {!isDashboard && <Navbar />}

      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<Home />} />

        {/* Public Routes */}
        <Route
          path={ROUTES.LOGIN}
          element={isAuthenticated ? <Navigate to={getDefaultRoute()} replace /> : <Login />}
        />
        <Route
          path={ROUTES.REGISTER}
          element={isAuthenticated ? <Navigate to={getDefaultRoute()} replace /> : <Register />}
        />

        {/* Static Legal & Contact Pages */}
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/contact" element={<Contact />} />

        {/* Client Routes */}
        <Route
          path="/client/*"
          element={
            <PrivateRoute allowedRoles={["client"]}>
              <ClientLayout>
                <Routes>
                  <Route path="dashboard" element={<ClientDashboard />} />
                  <Route path="photographers" element={<ClientPhotographers />} />
                  <Route path="bookings" element={<ClientBookings />} />
                  <Route path="bookings/new" element={<CreateBooking />} />
                  <Route path="payments" element={<ClientPayments />} />
                  <Route path="payment/:bookingId" element={<Payment />} />
                  <Route path="chat/:bookingId" element={<Chat />} />
                  <Route path="profile" element={<ClientProfile />} />
                  <Route path="*" element={<Navigate to="/client/dashboard" replace />} />
                </Routes>
              </ClientLayout>
            </PrivateRoute>
          }
        />

        {/* Photographer Routes */}
        <Route
          path="/photographer/*"
          element={
            <PrivateRoute allowedRoles={["photographer"]}>
              <PhotographerLayout>
                <Routes>
                  <Route path="dashboard" element={<PhotographerDashboard />} />
                  <Route path="assignments" element={<Assignments />} />
                  <Route path="schedule" element={<Schedule />} />
                  <Route path="completed" element={<Completed />} />
                  <Route path="earnings" element={<Earnings />} />
                  <Route path="chat/:bookingId" element={<Chat />} />
                  <Route path="profile" element={<PhotographerProfile />} />
                  <Route path="*" element={<Navigate to="/photographer/dashboard" replace />} />
                </Routes>
              </PhotographerLayout>
            </PrivateRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="bookings" element={<AdminBookings />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="photographers" element={<AdminPhotographers />} />
                  <Route path="assignments" element={<AdminAssignments />} />
                  <Route path="payments" element={<AdminPayments />} />
                  <Route path="activity" element={<AdminActivity />} />
                  <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
                </Routes>
              </AdminLayout>
            </PrivateRoute>
          }
        />

        {/* Catch all - redirect to login */}
        <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />
      </Routes>
    </div>
  );
}

