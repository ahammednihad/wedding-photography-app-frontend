import { useEffect, useState } from "react";
import { useAuth } from "../../store/contexts/AuthContext";
import { apiService as api } from "../../services/api";
import { User, Mail, Phone, Calendar } from "lucide-react";
import { useToast } from "../../store/contexts/ToastContext";
import { formatDate } from "../../utils/helpers";

export default function ClientProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const { error: showError, success } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.getProfile();
      setProfile(response.data);
      setEditedProfile(response.data);
    } catch (err) {
      console.log("Profile fetch err", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await api.updateProfile(editedProfile);
      setProfile(editedProfile);
      setIsEditing(false);
      success("Profile updated successfully!");
    } catch (err) {
      showError("Failed to update profile");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
          >
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition"
            >
              Save
            </button>
            <button
              onClick={() => { setIsEditing(false); setEditedProfile(profile); }}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-8">
          <div className="flex items-center mb-10">
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-3xl font-bold mr-8 shadow-inner">
              {(profile?.name || user?.name)?.[0]}
            </div>
            <div>
              {isEditing ? (
                <input
                  name="name"
                  value={editedProfile.name}
                  onChange={handleChange}
                  className="text-2xl font-bold text-gray-900 border-b-2 border-primary-500 focus:outline-none bg-transparent"
                />
              ) : (
                <h2 className="text-2xl font-bold text-gray-900">{profile?.name || user?.name}</h2>
              )}
              <p className="text-gray-500 font-medium">Client Account</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Personal Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1 font-medium">Email Address</label>
                  <div className="flex items-center">
                    <Mail size={18} className="mr-3 text-gray-400" />
                    {isEditing ? (
                      <input name="email" value={editedProfile.email} onChange={handleChange} className="w-full border-b border-gray-200 focus:border-primary-500 outline-none py-1" />
                    ) : (
                      <span className="text-gray-900 font-medium">{profile?.email || user?.email}</span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-500 mb-1 font-medium">Phone Number</label>
                  <div className="flex items-center">
                    <Phone size={18} className="mr-3 text-gray-400" />
                    {isEditing ? (
                      <input name="phone" value={editedProfile.phone || ""} onChange={handleChange} placeholder="Add phone number" className="w-full border-b border-gray-200 focus:border-primary-500 outline-none py-1" />
                    ) : (
                      <span className="text-gray-900 font-medium">{profile?.phone || "Not provided"}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Address & Preferences</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-500 mb-1 font-medium">Location</label>
                  <div className="flex items-center">
                    <Calendar size={18} className="mr-3 text-gray-400" />
                    {isEditing ? (
                      <input name="address" value={editedProfile.address || ""} onChange={handleChange} placeholder="Add your city/address" className="w-full border-b border-gray-200 focus:border-primary-500 outline-none py-1" />
                    ) : (
                      <span className="text-gray-900 font-medium">{profile?.address || "Location not set"}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
