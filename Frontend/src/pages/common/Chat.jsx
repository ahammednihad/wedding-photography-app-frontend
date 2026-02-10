import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiService } from "../../services/api";
import { useAuth } from "../../store/contexts/AuthContext";
import { Send, ArrowLeft, MessageSquare, User } from "lucide-react";
import io from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

export default function Chat() {
    const { bookingId } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const socketRef = useRef();
    const scrollRef = useRef();

    useEffect(() => {
        const api = apiService;
        // Socket Setup
        socketRef.current = io(SOCKET_URL);
        socketRef.current.emit("joinRoom", bookingId);

        socketRef.current.on("newMessage", (message) => {
            setMessages((prev) => {
                if (prev.find(m => m._id === message._id)) return prev;
                return [...prev, message];
            });
        });

        // Fetch data
        const fetchChatDetails = async () => {
            try {
                const endpoint = user.role === "client"
                    ? `/client/bookings/${bookingId}`
                    : `/photographer/bookings/${bookingId}`;
                // I'll stick to a safe assumption or the previous code's logic.
                // Previous code: /photographer/bookings/${bookingId}

                // Let's use a generic approach if possible or stick to what was there if it worked.
                // The previous code had: /photographer/bookings/${bookingId}

                // However, I want to be safe. I'll use the exact previous logic for endpoints.
                const roleEndpoint = user.role === "client"
                    ? `/client/bookings/${bookingId}`
                    : `/photographer/assignments/${bookingId}`; // I saw 'assignments' in dashboard links

                // Wait, previous file said: `/photographer/bookings/${bookingId}`
                // But PhotographerDashboard links to `/photographer/assignments`
                // I will trust the previous file's endpoint logic for now to avoid breaking backend calls I can't see.
                const safeEndpoint = user.role === "client"
                    ? `/client/bookings/${bookingId}`
                    : `/photographer/bookings/${bookingId}`;

                const bRes = await api.get(endpoint);
                setBooking(bRes.data);

                const mRes = await api.getChatHistory(bookingId);
                setMessages(mRes.data);
            } catch (err) {
                console.error("Chat loading error", err);
            } finally {
                setLoading(false);
            }
        };

        fetchChatDetails();

        return () => {
            socketRef.current.disconnect();
        };
    }, [bookingId, user.role]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        const api = apiService;
        if (!newMessage.trim()) return;

        const otherUserId = user.role === "client" ? booking?.photographerId?._id : booking?.clientId?._id;
        const receiverId = otherUserId || (user.role === "client" ? booking?.photographerId : booking?.clientId);

        if (!receiverId) return;

        try {
            const msgData = {
                text: newMessage,
                senderId: user._id || user.id,
                receiverId: receiverId,
                bookingId,
            };

            const tempId = Date.now();
            // Optimistic update
            setMessages((prev) => [...prev, { ...msgData, _id: tempId, createdAt: new Date() }]);
            setNewMessage("");

            await api.sendChatMessage(msgData);
        } catch (err) {
            console.error("Message send failed", err);
        }
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
        </div>
    );

    const otherUserName = user.role === "client" ? booking?.photographerId?.name : booking?.clientId?.name;

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 p-4 flex items-center justify-between shadow-sm z-10">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                        {otherUserName?.[0] || <User size={20} />}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 leading-tight">{otherUserName || "Chat Partner"}</h3>
                        <p className="text-xs text-green-600 flex items-center gap-1 font-medium">
                            <span className="h-2 w-2 rounded-full bg-green-500" />
                            Online
                        </p>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                        <MessageSquare size={48} className="mb-2 opacity-50" />
                        <p>No messages yet. Start the conversation!</p>
                    </div>
                ) : (
                    messages.map((msg, i) => {
                        // Check if message is from me
                        const isMe = msg.senderId === (user._id || user.id);
                        return (
                            <div key={i} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                                <div
                                    className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm shadow-sm ${isMe
                                        ? "bg-blue-600 text-white rounded-tr-none"
                                        : "bg-white text-gray-800 border border-gray-200 rounded-tl-none"
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={scrollRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100">
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-1 px-4 py-2.5 bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl transition-all outline-none text-sm"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Send size={20} />
                    </button>
                </div>
            </form>
        </div>
    );
}
