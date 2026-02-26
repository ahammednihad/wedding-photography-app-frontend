import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiService as api } from "../../services/api";
import { CreditCard, IndianRupee, ShieldCheck, ArrowLeft, Calendar, MapPin, Lock } from "lucide-react";
import { useToast } from "../../store/contexts/ToastContext";
import { formatCurrency } from "../../utils/helpers";

export default function Payment() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
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
    } finally {
      setLoading(false);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setSubmitting(true);

    try {
      const res = await loadRazorpayScript();
      if (!res) {
        showError("Razorpay SDK failed to load. Are you online?");
        setSubmitting(false);
        return;
      }

      // 1. Create Order in Backend
      const amount = booking.amount || (booking.package === 'gold' ? 89999 : (booking.package === 'platinum' ? 149999 : 49999));
      const orderRes = await api.createPaymentOrder(bookingId, amount);
      const { orderId, key, amount: orderAmount } = orderRes.data;

      // 2. Open Razorpay Checkout
      const options = {
        key: key,
        amount: orderAmount,
        currency: "INR",
        name: "Wedding Photography",
        description: `Payment for ${booking.eventType} booking`,
        order_id: orderId,
        handler: async (response) => {
          try {
            // 3. Verify Payment in Backend
            const verifyRes = await api.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.data.success) {
              success("Payment successful! Your booking is confirmed.");
              navigate("/client/bookings");
            } else {
              showError("Payment verification failed.");
            }
          } catch (err) {
            showError("Error verifying payment.");
          }
        },
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        theme: {
          color: "#2563eb",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on("payment.failed", function (response) {
        showError(response.error.description);
      });
      rzp1.open();
    } catch (err) {
      showError(err.response?.data?.error || "Payment failed. Please try again.");
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
              <Lock size={14} /> Your transaction is encrypted and secure via Razorpay.
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

            <div className="space-y-6">
              <div className="p-4 border border-blue-100 rounded-xl bg-blue-50/50 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <IndianRupee size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Instant Online Payment</p>
                  <p className="text-xs text-gray-500">Pay securely using UPI, Card, NetBanking or Wallet</p>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={submitting}
                className="w-full bg-blue-600 text-white rounded-xl py-4 font-bold text-lg shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>Processing...</>
                ) : (
                  <>
                    <CreditCard size={20} /> Pay Now with Razorpay
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-500 flex items-center justify-center gap-1">
                <ShieldCheck size={14} className="text-green-500" /> Payments are processed securely via Razorpay.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
