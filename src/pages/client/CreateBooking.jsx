import { useReducer, useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { apiService as api } from "../../services/api";
import { useToast } from "../../store/contexts/ToastContext";
import { Camera, Check, MapPin, ChevronLeft, User } from "lucide-react";

const initialState = {
  photographerId: "",
  date: "",
  startTime: "10:00",
  endTime: "18:00",
  location: "",
  eventType: "Wedding",
  selectedPackage: "gold",
  loading: false,
  coordinates: { lat: 15.2993, lng: 73.9814 },
  busySlots: [],
};

import MapPicker from "../../components/common/MapPicker";

function reducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_LOADING":
      return { ...state, loading: action.value };
    case "INITIALIZE":
      return { ...state, ...action.payload };
    case "RESET_FORM":
      return initialState;
    default:
      return state;
  }
}

export default function CreateBooking() {
  const [searchParams] = useSearchParams();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { photographerId, date, startTime, endTime, location, eventType, selectedPackage, loading } = state;
  const [photographers, setPhotographers] = useState([]);
  const [fetchingPhotographers, setFetchingPhotographers] = useState(false);

  const navigate = useNavigate();
  const { success, error: showError } = useToast();

  useEffect(() => {
    const fetchAuthoredData = async () => {
      setFetchingPhotographers(true);
      try {
        const res = await api.getVerifiedPhotographers();
        setPhotographers(res.data || []);

        const pId = searchParams.get("photographerId") || "";
        const pkg = searchParams.get("package") || "gold";
        dispatch({ type: "INITIALIZE", payload: { photographerId: pId, selectedPackage: pkg } });
      } catch (err) {
        showError("Failed to fetch photographers.");
      } finally {
        setFetchingPhotographers(false);
      }
    };
    fetchAuthoredData();
  }, [searchParams, showError]);

  useEffect(() => {
    if (photographerId && date) {
      fetchBusySlots();
    }
  }, [photographerId, date]);

  const fetchBusySlots = async () => {
    try {
      const res = await api.getBusySlots(photographerId, date);
      dispatch({ type: "SET_FIELD", field: "busySlots", value: res.data });
    } catch (err) {
      console.error("Failed to fetch busy slots", err);
    }
  };

  const packages = [
    { id: "silver", name: "Silver", price: "₹49,999", desc: "Essential coverage", features: ["4 hours", "200 photos", "Basic editing"] },
    { id: "gold", name: "Gold", price: "₹89,999", desc: "Premium coverage", features: ["8 hours", "500 photos", "Advanced editing", "Album"] },
    { id: "platinum", name: "Platinum", price: "₹1,49,999", desc: "Luxury experience", features: ["Full day", "Unlimited photos", "Drone + Cinematic Video", "Premium album"] },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!photographerId) {
      showError("Please select a photographer.");
      return;
    }
    dispatch({ type: "SET_LOADING", value: true });
    try {
      const amountMap = { silver: 49999, gold: 89999, platinum: 149999 };
      await api.createBooking({
        photographerId: photographerId,
        eventDate: date,
        startTime,
        endTime,
        location,
        coordinates: state.coordinates,
        eventType,
        package: selectedPackage,
        amount: amountMap[selectedPackage]
      });
      success("Booking successful!");
      navigate("/client/bookings");
    } catch (err) {
      showError(err.response?.data?.error || "Date already booked. Please choose another date or time.");
    } finally {
      dispatch({ type: "SET_LOADING", value: false });
    }
  };

  const handleFieldChange = (field, value) => {
    dispatch({ type: "SET_FIELD", field, value });
  };

  const selectedPhotographer = photographers.find(p => p._id === photographerId);

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      {/* Simple Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link to="/client/dashboard" className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-2">
            <ChevronLeft size={16} /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Book a Photographer</h1>
          <p className="text-gray-500 mt-1">Fill in the details below to send a booking request.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8 space-y-8">

        {/* Photographer Selection */}
        <div className="space-y-4">
          <label className="text-sm font-bold text-gray-700 block ml-1">Select Professional Photographer</label>
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User size={18} className="text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
            </div>
            <select
              required
              value={photographerId}
              onChange={(e) => handleFieldChange("photographerId", e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none appearance-none"
              disabled={fetchingPhotographers}
            >
              <option value="">Choose a Photographer...</option>
              {photographers.map(p => (
                <option key={p._id} value={p._id}>{p.name} ({p.location || 'Remote'})</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400">
              <ChevronLeft size={16} className="-rotate-90" />
            </div>
          </div>

          {selectedPhotographer && (
            <div className="flex items-center gap-3 bg-indigo-50 p-4 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold shrink-0">
                {selectedPhotographer.name.charAt(0)}
              </div>
              <div>
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest leading-none mb-1">Service Availability</p>
                <p className="text-sm font-bold text-slate-700">Ready for {eventType} in {selectedPhotographer.location || location || 'your area'}</p>
              </div>
            </div>
          )}
        </div>

        {/* Event Type & Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 block ml-1">Event Type</label>
            <select
              required
              value={eventType}
              onChange={(e) => handleFieldChange("eventType", e.target.value)}
              className="w-full bg-gray-50 border border-transparent rounded-2xl px-5 py-3.5 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
            >
              <option value="Wedding">Wedding Ceremony</option>
              <option value="Engagement">Engagement</option>
              <option value="Pre-Wedding">Pre-Wedding Shoot</option>
              <option value="Reception">Reception</option>
              <option value="Other">Other Event</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 block ml-1">Event Date</label>
            <input
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={date}
              onChange={(e) => handleFieldChange("date", e.target.value)}
              className="w-full bg-gray-50 border border-transparent rounded-2xl px-5 py-3.5 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
            />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 block ml-1">Venue / Location</label>
          <div className="relative group">
            <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
            <input
              type="text"
              required
              placeholder="e.g. Grand Hyatt, Goa"
              value={location}
              onChange={(e) => handleFieldChange("location", e.target.value)}
              className="w-full bg-gray-50 border border-transparent rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none placeholder:text-gray-300"
            />
          </div>
          <div className="space-y-2 mt-4">
            <label className="text-sm font-bold text-gray-700 block ml-1">Pin Venue on Map</label>
            <MapPicker
              onLocationSelect={(pos) => handleFieldChange("coordinates", pos)}
              initialPosition={state.coordinates}
            />
          </div>
        </div>

        {/* Time Slots */}
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 block ml-1">Start Time</label>
            <input
              type="time"
              required
              value={startTime}
              onChange={(e) => handleFieldChange("startTime", e.target.value)}
              className="w-full bg-gray-50 border border-transparent rounded-2xl px-5 py-3.5 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 block ml-1">End Time</label>
            <input
              type="time"
              required
              value={endTime}
              onChange={(e) => handleFieldChange("endTime", e.target.value)}
              className="w-full bg-gray-50 border border-transparent rounded-2xl px-5 py-3.5 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
            />
          </div>
        </div>

        {/* Package Selection */}
        <div className="space-y-4 pt-6 border-t border-gray-100">
          <label className="text-sm font-bold text-gray-700 block ml-1 text-center">Select Your Experience Package</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                onClick={() => handleFieldChange("selectedPackage", pkg.id)}
                className={`cursor-pointer rounded-[24px] border p-6 transition-all duration-300 relative overflow-hidden group/pkg ${selectedPackage === pkg.id
                  ? "bg-indigo-600 border-transparent text-white shadow-xl shadow-indigo-200 -translate-y-1"
                  : "bg-white border-gray-100 hover:border-indigo-200 text-slate-600"
                  }`}
              >
                {selectedPackage === pkg.id && (
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 w-16 h-16 bg-white/10 rounded-full blur-xl animate-pulse"></div>
                )}
                <div className="flex justify-between items-center mb-4">
                  <span className={`text-[10px] font-black uppercase tracking-widest ${selectedPackage === pkg.id ? 'text-indigo-200' : 'text-slate-400'}`}>{pkg.name}</span>
                  {selectedPackage === pkg.id && <Check size={16} className="text-white" />}
                </div>
                <p className={`font-black text-2xl mb-1 tracking-tight ${selectedPackage === pkg.id ? 'text-white' : 'text-slate-900'}`}>{pkg.price}</p>
                <p className={`text-[10px] uppercase font-bold mb-4 tracking-wide ${selectedPackage === pkg.id ? 'text-indigo-100' : 'text-slate-400'}`}>{pkg.desc}</p>
                <ul className="space-y-2">
                  {pkg.features.map((feat, i) => (
                    <li key={i} className={`text-[11px] font-bold flex items-center gap-2 ${selectedPackage === pkg.id ? 'text-white/80' : 'text-slate-500'}`}>
                      <div className={`w-1 h-1 rounded-full ${selectedPackage === pkg.id ? 'bg-white' : 'bg-indigo-500'}`}></div> {feat}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-8">
          <button
            type="submit"
            disabled={loading || !photographerId}
            className="w-full bg-slate-900 text-white font-black py-4 rounded-[20px] shadow-2xl shadow-slate-200 hover:bg-black hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-3 text-sm uppercase tracking-[0.2em]"
          >
            {loading ? "Processing Transmission..." : "Initialize Booking Request"}
          </button>
          <p className="text-center text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-4">
            Your request will be prioritized and sent to {selectedPhotographer ? selectedPhotographer.name : 'the selected professional'} immediately.
          </p>
        </div>

      </form>
    </div>
  );
}
