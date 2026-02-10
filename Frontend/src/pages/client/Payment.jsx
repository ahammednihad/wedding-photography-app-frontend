import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiService as api } from "../../services/api";
import { useAuth } from "../../store/contexts/AuthContext";
import { CreditCard, IndianRupee, ShieldCheck, ArrowLeft, Calendar, MapPin, CheckCircle, Lock } from "lucide-react";
import { useToast } from "../../store/contexts/ToastContext";
import { formatCurrency } from "../../utils/helpers";

export default function Payment() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { success, error: showError } = useToast();

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const response = await api.getBooking(bookingId);
      setBooking(response.data);
    } catch (err) {
      showError("Failed to fetch booking details");
      if (err.response?.status === 401) {
        logout();
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.recordPayment(bookingId, parseFloat(amount));
      success("Payment recorded successfully.");
      navigate("/client/bookings");
    } catch (err) {
      showError("Payment failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate("/client/bookings")}
          className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-medium mb-8 transition-colors"
        >
          <ArrowLeft size={20} /> Back to Bookings
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-blue-600 p-8 text-white">
            <h1 className="text-2xl font-bold mb-2">Secure Payment</h1>
            <p className="text-blue-100 text-sm flex items-center gap-2">
              <Lock size={14} /> Your transaction is encrypted and secure.
            </p>
          </div>

          <div className="p-8">
            <div className="flex items-start justify-between mb-8 pb-8 border-b border-gray-100">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Booking Reference</p>
                <p className="text-lg font-bold text-gray-900">#{bookingId.slice(-8).toUpperCase()}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Total Due</p>
                <p className="text-2xl font-bold text-blue-600">
                  {booking ? formatCurrency(booking.amount || (booking.package === 'gold' ? 89999 : 49999)) : '...'}
                </p>
              </div>
            </div>

            {booking && (
              <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar size={18} className="text-blue-500" /> Booking Summary
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="block text-gray-500 text-xs font-bold uppercase">Event Type</span>
                    <span className="font-medium text-gray-900">{booking.eventType}</span>
                  </div>
                  <div>
                    <span className="block text-gray-500 text-xs font-bold uppercase">Date</span>
                    <span className="font-medium text-gray-900">
                      {new Date(booking.eventDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                  <div>
                    <span className="block text-gray-500 text-xs font-bold uppercase">Location</span>
                    <span className="font-medium text-gray-900 flex items-center gap-1">
                      <MapPin size={14} /> {booking.location}
                    </span>
                  </div>
                  <div>
                    <span className="block text-gray-500 text-xs font-bold uppercase">Package</span>
                    <span className="font-medium text-gray-900 capitalize">{booking.package}</span>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handlePayment} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Payment Amount (INR)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <IndianRupee size={20} />
                  </div>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    min="1"
                    step="0.01"
                    className="block w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-bold text-gray-900 transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Mock Credit Card Fields (Visual Only) */}
              <div className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 space-y-4 opacity-70 pointer-events-none select-none grayscale">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-gray-400 uppercase">Card Details (Mock)</span>
                  <div className="flex gap-2">
                    <div className="h-4 w-8 bg-gray-200 rounded"></div>
                    <div className="h-4 w-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
                <div className="h-10 bg-white border border-gray-200 rounded-lg"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-10 bg-white border border-gray-200 rounded-lg"></div>
                  <div className="h-10 bg-white border border-gray-200 rounded-lg"></div>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 text-white rounded-xl py-4 font-bold text-lg shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>Processing...</>
                ) : (
                  <>
                    <CreditCard size={20} /> Confirm Payment
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-500 flex items-center justify-center gap-1">
                <ShieldCheck size={14} className="text-green-500" /> Payments are processed securely.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
