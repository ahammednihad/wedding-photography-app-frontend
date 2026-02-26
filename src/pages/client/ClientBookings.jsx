import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchBookings } from "../../store/slices/bookingSlice";
import { useToast } from "../../store/contexts/ToastContext";
import StatusBadge from "../../components/common/StatusBadge";
import { formatDate, formatCurrency } from "../../utils/helpers";
import { CreditCard, Calendar, MapPin, Package, Clock, MessageSquare, ArrowRight } from "lucide-react";
import { apiService as api } from "../../services/api";

export default function ClientBookings() {
    const dispatch = useDispatch();
    const { items: bookings, loading, error } = useSelector((state) => state.bookings);
    const { error: showError } = useToast();

    useEffect(() => {
        dispatch(fetchBookings());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            showError(error);
        }
    }, [error, showError]);


    if (loading && bookings.length === 0) return (
        <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Bookings</h1>
                    <p className="text-gray-500 mt-1">Track and manage your wedding photography sessions.</p>
                </div>
                <Link
                    to="/client/bookings/new"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-bold text-sm shadow-md transition-all flex items-center gap-2"
                >
                    <Calendar size={18} /> Book New Session
                </Link>
            </div>

            <div className="space-y-6">
                {bookings.length > 0 ? (
                    bookings.map((booking) => (
                        <div key={booking._id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all">
                            <div className="p-6 flex flex-col md:flex-row gap-6">
                                {/* Date Box */}
                                <div className="hidden md:flex flex-col items-center justify-center w-20 h-20 bg-indigo-50 rounded-lg text-indigo-600 shrink-0 border border-indigo-100">
                                    <span className="text-xs font-bold uppercase tracking-wider">{new Date(booking.eventDate).toLocaleString('default', { month: 'short' })}</span>
                                    <span className="text-2xl font-black leading-none">{new Date(booking.eventDate).getDate()}</span>
                                    <span className="text-xs font-bold text-indigo-400">{new Date(booking.eventDate).getFullYear()}</span>
                                </div>

                                {/* Content */}
                                <div className="flex-1 space-y-3">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-lg font-bold text-gray-900">
                                                {booking.eventType}
                                            </h3>
                                            <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wide border border-gray-200">
                                                {booking.package}
                                            </span>
                                        </div>
                                        <StatusBadge status={booking.status} />
                                    </div>

                                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
                                        <span className="flex items-center gap-1.5"><Clock size={16} className="text-gray-400" /> {booking.startTime} - {booking.endTime}</span>
                                        <span className="flex items-center gap-1.5"><MapPin size={16} className="text-gray-400" /> {booking.location}</span>
                                    </div>

                                    {/* Mobile Date */}
                                    <div className="md:hidden flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg font-bold mt-2">
                                        <Calendar size={18} className="text-indigo-500" />
                                        <span>{new Date(booking.eventDate).toLocaleDateString()}</span>
                                    </div>

                                    <div className="pt-4 mt-2 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <p className="text-xs text-gray-500 font-medium">Total Amount</p>
                                            <p className="text-lg font-black text-gray-900">
                                                {formatCurrency(booking.amount || (booking.package === 'gold' ? 89999 : booking.package === 'silver' ? 49999 : 149999))}
                                            </p>
                                        </div>

                                        <div className="flex gap-3">
                                            {(booking.status === 'confirmed' || booking.status === 'pending') && (
                                                <Link
                                                    to={`/client/chat/${booking._id}`}
                                                    className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-lg font-bold text-sm hover:bg-gray-50 hover:text-indigo-600 hover:border-indigo-200 transition-all flex items-center gap-2"
                                                >
                                                    <MessageSquare size={16} /> Chat
                                                </Link>
                                            )}

                                            {booking.paymentStatus !== 'paid' && (booking.status === 'pending' || booking.status === 'confirmed') && (
                                                <Link
                                                    to={`/client/payment/${booking._id}`}
                                                    className="px-5 py-2 bg-emerald-600 text-white rounded-lg font-bold text-sm shadow-sm hover:bg-emerald-700 transition-all flex items-center gap-2"
                                                >
                                                    <CreditCard size={16} /> Pay Now
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                        <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
                        <p className="text-gray-500 font-medium text-lg">No bookings found.</p>
                        <Link to="/client/bookings/new" className="text-indigo-600 font-bold mt-2 inline-block hover:underline">
                            Book your first session
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
