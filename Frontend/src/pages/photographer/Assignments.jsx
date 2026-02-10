import { useState, useEffect } from 'react';
import { apiService as api } from '../../services/api';
import { useToast } from '../../store/contexts/ToastContext';
import { formatDate } from '../../utils/helpers';
import { ArrowLeft, Briefcase, Calendar, MapPin, CheckCircle2, XCircle, Clock, RefreshCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Assignments() {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending');
    const { showToast } = useToast();
    const navigate = useNavigate();

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            setLoading(true);
            const response = await api.get('/photographer/assignments');
            setAssignments(response.data);
        } catch (error) {
            showToast('Failed to fetch assignments', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async (assignmentId) => {
        try {
            await api.put(`/photographer/assignments/${assignmentId}/accept`);
            showToast('Assignment accepted successfully', 'success');
            fetchAssignments();
        } catch (error) {
            showToast('Failed to accept assignment', 'error');
        }
    };

    const handleDecline = async (assignmentId) => {
        if (!window.confirm("Are you sure you want to decline this booking request?")) return;
        try {
            await api.put(`/photographer/assignments/${assignmentId}/decline`);
            showToast('Assignment declined', 'success');
            fetchAssignments();
        } catch (error) {
            showToast('Failed to decline assignment', 'error');
        }
    };

    const filteredAssignments = assignments.filter(a => {
        if (filter === 'all') return true;
        return a.status === filter;
    });

    if (loading && assignments.length === 0) return (
        <div className="flex justify-center items-center h-64 text-gray-400 font-bold text-sm uppercase tracking-widest">
            Loading Assignments...
        </div>
    );

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Job Assignments</h1>
                    <p className="text-gray-500 mt-1">Manage your incoming and active wedding photography jobs.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={fetchAssignments}
                        className="p-2 text-gray-500 hover:text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
                        title="Refresh"
                    >
                        <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
                    </button>
                    <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg font-bold text-xs uppercase tracking-wide">
                        <Briefcase size={16} /> Fast response improves ranking
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2">
                {['pending', 'confirmed', 'completed', 'declined'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-5 py-2.5 rounded-lg font-bold text-sm whitespace-nowrap transition-all ${filter === status
                                ? 'bg-gray-900 text-white shadow-lg'
                                : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-200'
                            }`}
                    >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                        <span className={`ml-2 px-1.5 py-0.5 rounded text-[10px] ${filter === status ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                            }`}>
                            {assignments.filter(a => a.status === status).length}
                        </span>
                    </button>
                ))}
            </div>

            {/* Assignments List */}
            <div className="space-y-4">
                {filteredAssignments.length > 0 ? (
                    filteredAssignments.map((assignment) => (
                        <div key={assignment._id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">

                            {/* Date Badge */}
                            <div className="flex-shrink-0 flex md:flex-col items-center justify-center bg-gray-50 rounded-lg p-4 w-full md:w-24 border border-gray-100">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{new Date(assignment.eventDate).toLocaleString('default', { month: 'short' })}</span>
                                <span className="text-2xl font-black text-gray-900">{new Date(assignment.eventDate).getDate()}</span>
                                <span className="text-xs font-medium text-gray-400">{new Date(assignment.eventDate).getFullYear()}</span>
                            </div>

                            {/* Details */}
                            <div className="flex-grow space-y-3">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-xl font-bold text-gray-900">{assignment.eventType} <span className="text-gray-400 text-sm font-normal">for</span> {assignment.clientId?.name || 'Client'}</h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${assignment.status === 'pending' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                                            assignment.status === 'confirmed' ? 'bg-green-50 text-green-600 border border-green-100' :
                                                'bg-gray-50 text-gray-600 border border-gray-100'
                                        }`}>
                                        {assignment.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Clock size={16} className="text-gray-400" />
                                        {assignment.startTime} - {assignment.endTime}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin size={16} className="text-gray-400" />
                                        {assignment.location}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Briefcase size={16} className="text-gray-400" />
                                        Package: <span className="font-bold capitalize">{assignment.package}</span>
                                    </div>
                                </div>

                                {assignment.notes && (
                                    <div className="bg-yellow-50 p-3 rounded-lg text-sm text-yellow-800 border border-yellow-100 mt-2">
                                        <span className="font-bold">Note:</span> {assignment.notes}
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex md:flex-col justify-center gap-2 min-w-[140px] border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                                {assignment.status === 'pending' && (
                                    <>
                                        <button
                                            onClick={() => handleAccept(assignment._id)}
                                            className="w-full py-2.5 bg-green-600 text-white rounded-lg font-bold text-sm shadow-sm hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle2 size={16} /> Accept
                                        </button>
                                        <button
                                            onClick={() => handleDecline(assignment._id)}
                                            className="w-full py-2.5 bg-white border border-gray-200 text-gray-600 rounded-lg font-bold text-sm hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all flex items-center justify-center gap-2"
                                        >
                                            <XCircle size={16} /> Decline
                                        </button>
                                    </>
                                )}
                                {assignment.status === 'confirmed' && (
                                    <button
                                        disabled
                                        className="w-full py-2.5 bg-green-50 text-green-700 border border-green-100 rounded-lg font-bold text-sm flex items-center justify-center gap-2 opacity-70 cursor-not-allowed"
                                    >
                                        <CheckCircle2 size={16} /> Accepted
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                        <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-bold text-gray-900">No {filter} assignments</h3>
                        <p className="text-gray-500 text-sm mt-1">You don't have any bookings in this category yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
