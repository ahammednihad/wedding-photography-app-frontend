import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../store/contexts/AuthContext";
import { useToast } from "../store/contexts/ToastContext";
import { useForm } from "../hooks/useForm";
import { ROUTES, ROLES } from "../utils/constants";
import { User, Mail, Lock, Camera, Shield, Loader2 } from "lucide-react";

const validationSchema = {
  name: { required: true, label: "Name" },
  email: { type: "email", required: true, label: "Email" },
  password: { type: "password", required: true, label: "Password" },
  role: { required: true, label: "Role" },
};

export default function Register() {
  const { register, loading } = useAuth();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();

  const { values, errors, handleChange, handleBlur, handleSubmit } = useForm(
    { name: "", email: "", password: "", role: "client" },
    validationSchema
  );

  const onSubmit = async (formValues) => {
    const result = await register(formValues);
    if (result.success) {
      success("Registration successful! Please login.");
      navigate(ROUTES.LOGIN);
    } else {
      showError(result.error || "Registration failed");
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
          <h2 className="text-2xl font-bold text-gray-900 mt-4">Create Account</h2>
          <p className="text-gray-500 mt-1">Join us as a Client or Photographer</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>

          {/* Role Selection - NO ADMIN */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => handleChange("role", "client")}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${values.role === 'client' ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md transform -translate-y-0.5' : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50 text-gray-500 hover:-translate-y-0.5'}`}
            >
              <User size={24} className="mb-2" />
              <span className="text-xs font-black uppercase tracking-widest">Client</span>
            </button>
            <button
              type="button"
              onClick={() => handleChange("role", "photographer")}
              className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 ${values.role === 'photographer' ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md transform -translate-y-0.5' : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50 text-gray-500 hover:-translate-y-0.5'}`}
            >
              <Camera size={24} className="mb-2" />
              <span className="text-xs font-black uppercase tracking-widest">Photographer</span>
            </button>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Full Name</label>
            <div className="relative group">
              <input
                type="text"
                className={`block w-full px-4 py-3 border ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50/50 focus:bg-white'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm font-medium`}
                placeholder="e.g. Rahul Sharma"
                value={values.name}
                onChange={(e) => handleChange("name", e.target.value)}
                onBlur={() => handleBlur("name")}
              />
            </div>
            {errors.name && <p className="mt-1 text-xs text-red-500 font-medium">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                <Mail size={18} />
              </div>
              <input
                type="text"
                className={`block w-full pl-10 pr-3 py-3 border ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50/50 focus:bg-white'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm font-medium`}
                placeholder="you@example.com"
                value={values.email}
                onChange={(e) => handleChange("email", e.target.value)}
                onBlur={() => handleBlur("email")}
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-red-500 font-medium">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                <Lock size={18} />
              </div>
              <input
                type="password"
                className={`block w-full pl-10 pr-3 py-3 border ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50/50 focus:bg-white'} rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm font-medium`}
                placeholder="Minimum 6 characters"
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
                Creating Account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Already have an account?{" "}
            <Link to={ROUTES.LOGIN} className="font-bold text-blue-600 hover:text-blue-700 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
