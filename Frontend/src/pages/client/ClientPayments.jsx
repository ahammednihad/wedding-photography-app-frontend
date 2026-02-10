import { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import { useToast } from '../../store/contexts/ToastContext';
import StatusBadge from '../../components/common/StatusBadge';
import Loading from '../../components/common/Loading';
import { formatDate, formatCurrency } from '../../utils/helpers';

export default function ClientPayments() {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();

    useEffect(() => {
        fetchPayments();
    }, []);

    const fetchPayments = async () => {
        try {
            setLoading(true);
            const response = await apiService.get('/client/payments');
            setPayments(response.data);
        } catch (error) {
            showToast('Failed to fetch payments', 'error');
        } finally {
            setLoading(false);
        }
    };

    const totalPaid = payments
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + (p.amount || 0), 0);

    const totalPending = payments
        .filter(p => p.status === 'pending')
        .reduce((sum, p) => sum + (p.amount || 0), 0);

    if (loading) return <Loading fullScreen />;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
                <p className="text-gray-600 mt-1">Track all your payment transactions</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-sm text-gray-600">Total Paid</div>
                    <div className="text-2xl font-bold text-green-600 mt-2">
                        {formatCurrency(totalPaid)}
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-sm text-gray-600">Pending Payments</div>
                    <div className="text-2xl font-bold text-yellow-600 mt-2">
                        {formatCurrency(totalPending)}
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="text-sm text-gray-600">Total Transactions</div>
                    <div className="text-2xl font-bold text-blue-600 mt-2">
                        {payments.length}
                    </div>
                </div>
            </div>

            {/* Payments List */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Transaction ID
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Booking
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Payment Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Method
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {payments.map((payment) => (
                                <tr key={payment._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-mono text-gray-900">
                                            {payment.transactionId || payment._id.slice(-8)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{payment.eventType}</div>
                                        <div className="text-xs text-gray-500">
                                            {formatDate(payment.eventDate)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-bold text-gray-900">
                                            {formatCurrency(payment.amount)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {formatDate(payment.paymentDate || payment.createdAt)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {payment.paymentMethod || 'Online'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusBadge status={payment.status} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {payments.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <div className="text-4xl mb-4">ðŸ’³</div>
                    <p className="text-gray-500">No payment history found</p>
                </div>
            )}
        </div>
    );
}
