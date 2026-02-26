import { useEffect, useState } from "react";
import { apiService as api } from "../../services/api";
import { useToast } from "../../store/contexts/ToastContext";
import { formatDate } from "../../utils/helpers";
import {
  Search,
  Filter,
  Calendar as CalIcon,
  MapPin,
  RefreshCcw,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Trash2,
} from "lucide-react";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [conflicts, setConflicts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { showToast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bookingsRes, conflictsRes] = await Promise.all([
        api.getAllBookings({}),
        api.getAdminConflicts()
      ]);

      setBookings(bookingsRes.data);
      setConflicts(conflictsRes.data);
    } catch (err) {
      console.error("Fetch Data Error:", err);
      showToast("Data synchronization failed.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.updateBookingStatusAdmin(id, status);
      showToast(`Booking ${status} confirmed.`, "success");
      fetchData();
    } catch (err) {
      showToast("Operation failed.", "error");
    }
  };

  const handleDeleteBooking = async (id) => {
    if (window.confirm("CRITICAL: Permanently delete this record?")) {
      try {
        await api.deleteBookingAdmin(id);
        showToast("Record purged.", "success");
        fetchData();
      } catch (err) {
        showToast("Access denied or system error.", "error");
      }
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      booking.clientId?.name?.toLowerCase().includes(term) ||
      booking.location?.toLowerCase().includes(term) ||
      booking.package?.toLowerCase().includes(term);
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'confirmed': return 'text-green-700 bg-green-50 border-green-100';
      case 'pending': return 'text-orange-700 bg-orange-50 border-orange-100';
      case 'completed': return 'text-blue-700 bg-blue-50 border-blue-100';
      case 'cancelled': return 'text-red-700 bg-red-50 border-red-100';
      default: return 'text-gray-600 bg-gray-50 border-gray-100';
    }
  };

  if (loading && bookings.length === 0) return (
    <div className="flex flex-col justify-center items-center h-[60vh] space-y-4">
      <div className="h-10 w-10 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Bookings...</p>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Simple Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Booking Management</h1>
          <p className="text-gray-500 mt-1">View and manage all photography bookings.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            className="p-2 text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
            title="Refresh"
          >
            <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Conflicts Alert - Simplified */}
      {conflicts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between text-red-700">
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} />
            <div>
              <p className="font-bold">Schedule Conflicts Detected</p>
              <p className="text-sm">{conflicts.length} bookings have overlapping schedules.</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-white border border-red-200 text-red-600 text-sm font-bold rounded-lg hover:bg-red-50">
            Resolve
          </button>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search bookings..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-64">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <select
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Clean Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Photographer</th>
                <th className="px-6 py-4">Event Details</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{booking.clientId?.name || "Unknown"}</div>
                      <div className="text-xs text-gray-500">{booking.clientId?.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      {booking.photographerId ? (
                        <>
                          <div className="font-medium text-gray-900">{booking.photographerId.name}</div>
                          <div className="text-xs text-gray-500">{booking.photographerId.email}</div>
                        </>
                      ) : (
                        <span className="text-xs text-orange-600 font-bold bg-orange-50 px-2 py-1 rounded">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{booking.eventType}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <CalIcon size={12} /> {formatDate(booking.eventDate)}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <MapPin size={12} /> {booking.location}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize border ${getStatusStyle(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {booking.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleUpdateStatus(booking._id, 'confirmed')}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Approve"
                            >
                              <CheckCircle2 size={18} />
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(booking._id, 'declined')}
                              className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                              title="Reject"
                            >
                              <XCircle size={18} />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDeleteBooking(booking._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    No bookings found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
