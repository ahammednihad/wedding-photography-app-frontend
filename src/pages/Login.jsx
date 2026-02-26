import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../store/contexts/AuthContext";
import { useToast } from "../store/contexts/ToastContext";
import { useForm } from "../hooks/useForm";
import { ROUTES, ROLES } from "../utils/constants";
import { Lock, Mail, Loader2, Camera } from "lucide-react";

const validationSchema = {
  email: { type: "email", required: true, label: "Email" },
  password: { required: true, label: "Password" },
};

export default function Login() {
  const { login, loading } = useAuth();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();

  const { values, errors, handleChange, handleBlur, handleSubmit } = useForm(
    { email: "", password: "" },
    validationSchema
  );

  const onSubmit = async (formValues) => {
    // Clear any existing stale data before attempting login
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    const result = await login(formValues);
    if (result.success) {
      success("Welcome back!");
      // Use window.location to ensure fresh state and prevent PrivateRoute race conditions
      if (result.user?.role === ROLES.ADMIN) {
        window.location.href = ROUTES.ADMIN_DASHBOARD;
      } else if (result.user?.role === ROLES.PHOTOGRAPHER) {
        window.location.href = ROUTES.PHOTOGRAPHER_DASHBOARD;
      } else {
        window.location.href = ROUTES.CLIENT_DASHBOARD;
      }
    } else {
      showError(result.error || "Login unsuccessful");
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
          <h2 className="text-2xl font-bold text-gray-900 mt-4">Welcome Back</h2>
          <p className="text-gray-500 mt-1">Sign in to access your dashboard</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                <Mail size={18} />
              </div>
              <input
                type="text"
                className={`block w-full pl-10 pr-3 py-3 border ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50/50 focus:bg-white'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm font-medium`}
                placeholder="name@example.com"
                value={values.email}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-red-500 font-medium">{errors.email}</p>}
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-bold text-gray-700">Password</label>
              <a href="#" className="text-xs text-blue-600 font-bold hover:underline">Forgot?</a>
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                <Lock size={18} />
              </div>
              <input
                type="password"
                className={`block w-full pl-10 pr-3 py-3 border ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50/50 focus:bg-white'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm font-medium`}
                placeholder="••••••••"
                value={values.password}
                onChange={(e) => handleChange("password", e.target.value)}
                onBlur={() => handleBlur("password")}
              />
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-500 font-medium">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-500/30 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 hover:shadow-blue-500/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-0.5 transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Don't have an account?{" "}
            <Link to={ROUTES.REGISTER} className="font-bold text-blue-600 hover:text-blue-700 hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
