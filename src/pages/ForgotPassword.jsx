import { useState } from "react";
import { Link } from "react-router-dom";
import { apiService as api } from "../services/api";
import { useToast } from "../store/contexts/ToastContext";
import { Mail, Camera, Loader2, ArrowLeft } from "lucide-react";
import { ROUTES } from "../utils/constants";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { success, error: showError } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      showError("Email is required");
      return;
    }

    setLoading(true);
    try {
      const response = await api.forgotPassword(email);
      success(response.data?.message || "Password reset link sent to your email!");
    } catch (err) {
      showError(err.response?.data?.error || "Failed to request password reset");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50/50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-white/50 backdrop-blur-sm animate-fade-up">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center gap-2 mb-2 group">
            <div className="bg-blue-600 text-white p-3 rounded-xl shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
              <Camera size={28} />
            </div>
            <span className="font-extrabold text-2xl text-gray-900 tracking-tight">WedLens</span>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900 mt-4">Forgot Password</h2>
          <p className="text-gray-500 mt-1">Enter your email to receive a password reset link</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                <Mail size={18} />
              </div>
              <input
                type="email"
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 bg-gray-50/50 focus:bg-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm font-medium"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-500/30 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5 transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                Sending Link...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link to={ROUTES.LOGIN} className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline">
            <ArrowLeft size={16} /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
