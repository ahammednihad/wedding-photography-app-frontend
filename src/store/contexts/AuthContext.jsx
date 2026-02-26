import { createContext, useContext, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { login as loginAction, register as registerAction, logout as logoutAction, fetchProfile } from "../slices/authSlice";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { user, token, loading, isAuthenticated } = useSelector((state) => state.auth);

  // Check if user profile needs fetching if we have a token but no user
  useEffect(() => {
    if (token && !user && !loading) {
      dispatch(fetchProfile());
    }
  }, [token, user, loading, dispatch]);

  const login = async ({ email, password }) => {
    const resultAction = await dispatch(loginAction({ email, password }));
    if (loginAction.fulfilled.match(resultAction)) {
      return { success: true, user: resultAction.payload.user };
    } else {
      return { success: false, error: resultAction.payload || "Login failed" };
    }
  };

  const register = async (formData) => {
    const resultAction = await dispatch(registerAction(formData));
    if (registerAction.fulfilled.match(resultAction)) {
      return { success: true, user: resultAction.payload.user };
    } else {
      return { success: false, error: resultAction.payload || "Registration failed" };
    }
  };

  const logout = () => {
    dispatch(logoutAction());
  };

  const updateUser = (userData) => {
    // This could also be a Redux action if needed, but for now we'll just use the profile fetch logic
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated,
    isClient: user?.role === "client",
    isPhotographer: user?.role === "photographer",
    isAdmin: user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
