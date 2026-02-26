import axios from "axios";
import { API_BASE_URL, STORAGE_KEYS } from "../utils/constants";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL, // http://localhost:5000/api
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginPath = window.location.pathname === "/login";

    if (error.response?.status === 401 && !isLoginPath) {
      // Unauthorized - clear token and redirect to login only if not already on login page
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Helper to get user role
const getRole = () => {
  try {
    const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER));
    return user?.role;
  } catch (e) {
    return null;
  }
};

// API Service Functions
export const apiService = {
  // Generic methods (for existing code compatibility)
  get: (url, config) => apiClient.get(url, config),
  post: (url, data, config) => apiClient.post(url, data, config),
  put: (url, data, config) => apiClient.put(url, data, config),
  delete: (url, config) => apiClient.delete(url, config),

  // Auth
  login: (email, password) => apiClient.post("/auth/login", { email, password }),
  register: (data) => apiClient.post("/auth/register", data),

  // Profile (Dynamic based on role)
  getProfile: () => {
    const role = getRole();
    if (!role) return Promise.reject("No role found");
    return apiClient.get(`/${role}/profile`);
  },

  updateProfile: (data) => {
    const role = getRole();
    if (!role) return Promise.reject("No role found");
    return apiClient.put(`/${role}/profile`, data);
  },

  // Client Bookings
  createBooking: (data) => apiClient.post("/client/bookings", data),
  getMyBookings: () => apiClient.get("/client/bookings"),
  getClientStats: () => apiClient.get("/client/stats"),
  getClientBookings: (params) => apiClient.get("/client/bookings", { params }),
  getBooking: (id) => apiClient.get(`/client/bookings/${id}`),
  cancelBooking: (id) => apiClient.put(`/client/bookings/${id}/cancel`),
  getVerifiedPhotographers: () => apiClient.get("/client/photographers"),

  // Client Payments
  recordPayment: (bookingId, amount) => apiClient.post(`/client/bookings/${bookingId}/payment`, { amount }),
  getPayments: () => apiClient.get("/client/payments"),
  getFavorites: () => apiClient.get("/client/favorites"),
  addFavorite: (data) => apiClient.post("/client/favorites", data),
  removeFavorite: (id) => apiClient.delete(`/client/favorites/${id}`),

  uploadAvatar: (formData) => apiClient.post("/photographer/upload/avatar", formData),

  uploadPortfolio: (formData) => apiClient.post("/photographer/upload/portfolio", formData),

  deletePortfolioImage: (publicId) => apiClient.delete(`/photographer/upload/portfolio/${publicId}`),
  getPhotographerStats: () => apiClient.get("/photographer/stats"),
  getPhotographerAssignments: (params) => apiClient.get("/photographer/assignments", { params }),
  getPhotographerEarnings: () => apiClient.get("/photographer/earnings"),

  // Admin
  getAdminStats: () => apiClient.get("/admin/dashboard/stats"),
  getAdminConflicts: () => apiClient.get("/admin/conflicts"),
  getAdminActivity: () => apiClient.get("/admin/activity"),
  getAllUsers: () => apiClient.get("/admin/users"),
  getAllBookings: (params) => apiClient.get("/admin/bookings", { params }),

  assignPhotographer: (bookingId, photographerId) =>
    apiClient.put(`/admin/bookings/${bookingId}/assign`, { photographerId }),

  updateBookingStatusAdmin: (bookingId, status) =>
    apiClient.put(`/admin/bookings/${bookingId}/status`, { status }),

  getPendingPhotographers: () => apiClient.get("/admin/photographers/pending"),
  approvePhotographer: (id) => apiClient.put(`/admin/photographers/${id}/approve`),
  rejectPhotographer: (id) => apiClient.put(`/admin/photographers/${id}/reject`),

  deleteUser: (id) => apiClient.delete(`/admin/users/${id}`),
  blockUser: (id) => apiClient.put(`/admin/users/${id}/block`),
  unblockUser: (id) => apiClient.put(`/admin/users/${id}/unblock`),
  deletePhotographer: (id) => apiClient.delete(`/admin/photographers/${id}`),
  deleteBookingAdmin: (id) => apiClient.delete(`/admin/bookings/${id}`),

  // Payments (Common/Utility)
  createPaymentOrder: (bookingId, amount) => apiClient.post("/payments/create-order", { booking: bookingId, amount }),
  verifyPayment: (data) => apiClient.post("/payments/verify", data),
  getPaymentHistory: () => apiClient.get("/payments/history"),

  // Public / Photographers List
  getPhotographers: () => apiClient.get("/public/photographers"),
  getPhotographer: (id) => apiClient.get(`/public/photographers/${id}`),
  searchPhotographers: (keyword) => apiClient.post("/public/search", { keyword }),
  getAvailability: (id) => apiClient.get(`/public/availability/${id}`),
  getBusySlots: (id, date) => apiClient.get(`/public/busy-slots/${id}?date=${date}`),
  getReviews: (id) => apiClient.get(`/public/reviews/${id}`),

  // Chat
  getChatHistory: (bookingId) => apiClient.get(`/chat/history/${bookingId}`),
  sendChatMessage: (data) => apiClient.post("/chat/send", data),
  getChatInbox: (id) => apiClient.get(`/chat/inbox/${id}`),
};

export default apiClient;
