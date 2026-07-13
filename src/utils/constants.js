// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Routes
export const ROUTES = {
  // Auth
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password/:token",

  // Client
  CLIENT_DASHBOARD: "/client/dashboard",
  CLIENT_PROFILE: "/client/profile",
  CLIENT_CREATE_BOOKING: "/client/bookings/new",
  CLIENT_MY_BOOKINGS: "/client/bookings",
  CLIENT_PAYMENTS: "/client/payments",
  CLIENT_PAYMENT: "/client/payment",

  // Photographer
  PHOTOGRAPHER_DASHBOARD: "/photographer/dashboard",
  PHOTOGRAPHER_PROFILE: "/photographer/profile",
  PHOTOGRAPHER_BOOKINGS: "/photographer/bookings",

  // Admin
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_USERS: "/admin/users",
  ADMIN_BOOKINGS: "/admin/bookings",
};

// User Roles
export const ROLES = {
  CLIENT: "client",
  PHOTOGRAPHER: "photographer",
  ADMIN: "admin",
};

// Booking Status
export const BOOKING_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  DECLINED: "declined",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

// Booking Status Colors
export const STATUS_COLORS = {
  pending: "#ffc107",
  confirmed: "#28a745",
  declined: "#dc3545",
  in_progress: "#17a2b8",
  completed: "#007bff",
  cancelled: "#dc3545",
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your connection.",
  UNAUTHORIZED: "You are not authorized to access this resource.",
  NOT_FOUND: "Resource not found.",
  SERVER_ERROR: "Server error. Please try again later.",
  VALIDATION_ERROR: "Please check your input and try again.",
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Logged in successfully!",
  REGISTER_SUCCESS: "Registration successful!",
  BOOKING_CREATED: "Booking created successfully!",
  BOOKING_UPDATED: "Booking updated successfully!",
  PAYMENT_RECORDED: "Payment recorded successfully!",
  PROFILE_UPDATED: "Profile updated successfully!",
};
