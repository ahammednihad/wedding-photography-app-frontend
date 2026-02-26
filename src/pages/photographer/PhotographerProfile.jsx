import { useEffect, useState } from "react";
import { useAuth } from "../../store/contexts/AuthContext";
import { apiService as api } from "../../services/api";
import { Camera, Mail, Phone, MapPin, Edit, User, Plus, Trash2 } from "lucide-react";
import { useToast } from "../../store/contexts/ToastContext";

export default function PhotographerProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editedProfile, setEditedProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { error: showError, success } = useToast();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.getProfile();
      const data = response.data;
      // Convert skills array to comma-separated string for editing
      const profileData = {
        ...data,
        skills: Array.isArray(data.skills) ? data.skills.join(', ') : (data.skills || "")
      };
      setProfile(data);
      setEditedProfile(profileData);
    } catch (err) {
      showError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      // Prepare data for backend
      const dataToSave = {
        name: editedProfile.name,
        email: editedProfile.email,
        phone: editedProfile.phone,
        bio: editedProfile.bio,
        address: editedProfile.address,
        experience: Number(editedProfile.experience) || 0,
        pricePerDay: Number(editedProfile.pricePerDay) || 0,
        // Convert comma-separated string back to array for backend
        skills: typeof editedProfile.skills === 'string'
          ? editedProfile.skills.split(',').map(s => s.trim()).filter(s => s !== "")
          : editedProfile.skills
      };

      const response = await api.updateProfile(dataToSave);

      // Update local state handling possible response structures
      const updatedUser = response.data.photographer || response.data;
      setProfile(updatedUser);
      setEditedProfile({
        ...updatedUser,
        skills: Array.isArray(updatedUser.skills) ? updatedUser.skills.join(', ') : (updatedUser.skills || "")
      });
      setIsEditing(false);
      success("Profile updated successfully!");
    } catch (err) {
      console.error("Save Error:", err);
      showError(err.response?.data?.error || "Failed to update profile");
    }
  };

  const handleAvatarUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const response = await api.uploadAvatar(formData);
      const newAvatarUrl = response.data.avatar;
      setProfile(prev => ({ ...prev, avatar: newAvatarUrl }));
      setEditedProfile(prev => ({ ...prev, avatar: newAvatarUrl }));
      success("Profile picture updated!");
    } catch (err) {
      console.error("Avatar Upload Error:", err);
      showError(err.response?.data?.error || "Avatar upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handlePortfolioUpload = async (files) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const formData = new FormData();
      // 'images' is the field name expected by the backend multer middleware
      Array.from(files).forEach(file => formData.append("images", file));

      const response = await api.uploadPortfolio(formData);
      const updatedPortfolio = response.data.portfolio;

      setProfile(prev => ({ ...prev, portfolio: updatedPortfolio }));
      setEditedProfile(prev => ({ ...prev, portfolio: updatedPortfolio }));
      success("Portfolio updated successfully!");
    } catch (err) {
      console.error("Portfolio Upload Error:", err);
      showError(err.response?.data?.error || "Portfolio upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleDeletePortfolioImage = async (publicId) => {
    if (!window.confirm("Remove this image from your portfolio?")) return;
    setUploading(true);
    try {
      const response = await api.deletePortfolioImage(publicId);
      setProfile(prev => ({ ...prev, portfolio: response.data.portfolio }));
      setEditedProfile(prev => ({ ...prev, portfolio: response.data.portfolio }));
      success("Image removed from portfolio");
    } catch (err) {
      showError("Failed to delete image");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-bold animate-pulse uppercase tracking-widest text-xs">Developing Profile...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Profile Studio</h1>
          <p className="text-gray-500 font-medium">Manage your brand identity and professional portfolio.</p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-white border border-gray-200 px-8 py-3 rounded-2xl text-sm font-black shadow-sm hover:shadow-md hover:bg-gray-50 hover:-translate-y-0.5 transition-all text-gray-700 uppercase tracking-widest"
          >
            <Edit size={18} className="text-blue-600" /> Edit Studio
          </button>
        ) : (
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-8 py-3 rounded-2xl text-sm font-black shadow-lg shadow-blue-500/30 hover:bg-blue-700 hover:-translate-y-0.5 active:scale-95 transition-all uppercase tracking-widest"
            >
              Save Changes
            </button>
            <button
              onClick={() => { setIsEditing(false); setEditedProfile(profile); }}
              className="bg-white border border-gray-200 text-gray-500 px-8 py-3 rounded-2xl text-sm font-black hover:bg-gray-50 transition-all uppercase tracking-widest"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="premium-card overflow-hidden">
        <div className="h-48 bg-gradient-to-br from-blue-600 to-indigo-800 relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white/10 to-transparent"></div>
        </div>
        <div className="px-10 pb-10">
          <div className="relative group flex flex-col md:flex-row items-center md:items-end -mt-16 mb-10 gap-8">
            <div className="w-40 h-40 bg-white rounded-[2.5rem] p-2 border-8 border-white shadow-2xl overflow-hidden relative group/avatar">
              <div className="w-full h-full bg-gray-50 rounded-[2rem] flex items-center justify-center text-gray-300 overflow-hidden relative">
                {profile?.avatar ? (
                  <img src={profile.avatar} className="w-full h-full object-cover transition-transform duration-500 group-hover/avatar:scale-110" alt="Avatar" />
                ) : (
                  <User size={64} />
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-white/70 flex items-center justify-center backdrop-blur-sm">
                    <div className="h-8 w-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center cursor-pointer opacity-0 group-hover/avatar:opacity-100 transition-all duration-300 backdrop-blur-[2px]">
                <Camera className="text-white mb-2" size={28} />
                <span className="text-[10px] text-white font-black uppercase tracking-widest">Update Shot</span>
                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleAvatarUpload(e.target.files[0])} disabled={uploading} />
              </label>
            </div>

            <div className="flex-1 text-center md:text-left mb-4 w-full">
              {isEditing ? (
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-blue-500 font-bold ml-1">Studio / Artist Name</label>
                  <input
                    name="name"
                    value={editedProfile.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="text-4xl font-black text-gray-900 bg-blue-50/50 border-2 border-transparent focus:border-blue-200 focus:bg-white rounded-xl px-4 py-2 w-full transition-all outline-none placeholder:text-gray-300"
                  />
                </div>
              ) : (
                <>
                  <h2 className="text-4xl font-black text-gray-900 tracking-tight">{profile?.name}</h2>
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-3">
                    <span className="bg-blue-50 text-blue-700 text-[10px] px-3 py-1 bg ring-1 ring-blue-100 rounded-lg font-black uppercase tracking-widest">
                      Resident Photographer
                    </span>
                    {profile?.isApproved && (
                      <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-[10px] px-3 py-1 ring-1 ring-emerald-100 rounded-lg font-black uppercase tracking-widest">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Verified Professional
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <section>
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <div className="h-px bg-gray-100 flex-1"></div>
                  Professional Credentials
                  <div className="h-px bg-gray-100 flex-1"></div>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="group">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">Email Terminal</label>
                      <div className="flex items-center text-gray-700 relative">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center absolute left-0 group-focus-within:bg-blue-50 transition-colors">
                          <Mail size={18} className="text-gray-400 group-focus-within:text-blue-600" />
                        </div>
                        {isEditing ? (
                          <input name="email" value={editedProfile.email} onChange={handleChange} className="w-full pl-12 pr-4 py-2.5 border-b-2 border-gray-100 focus:border-blue-500 focus:outline-none bg-transparent font-bold text-sm transition-all" />
                        ) : (
                          <span className="pl-12 font-bold text-gray-900">{profile?.email}</span>
                        )}
                      </div>
                    </div>

                    <div className="group">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">Active Line</label>
                      <div className="flex items-center text-gray-700 relative">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center absolute left-0 group-focus-within:bg-blue-50 transition-colors">
                          <Phone size={18} className="text-gray-400 group-focus-within:text-blue-600" />
                        </div>
                        {isEditing ? (
                          <input name="phone" value={editedProfile.phone || ""} onChange={handleChange} placeholder="Update contact info" className="w-full pl-12 pr-4 py-2.5 border-b-2 border-gray-100 focus:border-blue-500 focus:outline-none bg-transparent font-bold text-sm transition-all" />
                        ) : (
                          <span className="pl-12 font-bold text-gray-900">{profile?.phone || "Private"}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="group">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">Operating Base</label>
                      <div className="flex items-center text-gray-700 relative">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center absolute left-0 group-focus-within:bg-blue-50 transition-colors">
                          <MapPin size={18} className="text-gray-400 group-focus-within:text-blue-600" />
                        </div>
                        {isEditing ? (
                          <input name="address" value={editedProfile.address || ""} onChange={handleChange} placeholder="Add location" className="w-full pl-12 pr-4 py-2.5 border-b-2 border-gray-100 focus:border-blue-500 focus:outline-none bg-transparent font-bold text-sm transition-all" />
                        ) : (
                          <span className="pl-12 font-bold text-gray-900">{profile?.address || "Global / Not set"}</span>
                        )}
                      </div>
                    </div>

                    <div className="group">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 px-1">Skill Specializations</label>
                      <div className="flex flex-col gap-2">
                        {isEditing ? (
                          <>
                            <input
                              name="skills"
                              value={editedProfile.skills || ""}
                              onChange={handleChange}
                              placeholder="e.g. Wedding, Cinematic, Drone (comma separated)"
                              className="w-full px-4 py-2.5 border-b-2 border-gray-100 focus:border-blue-500 focus:outline-none bg-transparent font-bold text-sm transition-all"
                            />
                            {/* Live Preview Tags */}
                            <div className="flex flex-wrap gap-2 px-1 mt-2">
                              {(editedProfile.skills ? (typeof editedProfile.skills === 'string' ? editedProfile.skills.split(',') : editedProfile.skills) : []).map((s, i) => (
                                s.trim() && (
                                  <span key={i} className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-blue-100 shadow-sm animate-in zoom-in duration-200">
                                    {s.trim()}
                                  </span>
                                )
                              ))}
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-wrap gap-2 px-1">
                            {profile?.skills && (Array.isArray(profile.skills) ? profile.skills : profile.skills.split(',')).map(s => (
                              <span key={s} className="bg-white text-gray-600 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-gray-100 shadow-sm">{s.trim()}</span>
                            ))}
                            {!profile?.skills?.length && <span className="text-gray-400 text-xs italic">Awaiting skill tags...</span>}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                  <div className="h-px bg-gray-100 flex-1"></div>
                  The Creative Vision
                  <div className="h-px bg-gray-100 flex-1"></div>
                </h3>
                <div className="bg-gray-50/50 p-8 rounded-[2rem] border border-gray-100 relative group focus-within:ring-4 focus-within:ring-blue-500/10 focus-within:border-blue-400 transition-all">
                  <div className="absolute top-0 right-0 p-6 text-gray-100 select-none pointer-events-none group-focus-within:text-blue-100 transition-colors">
                    <Camera size={64} />
                  </div>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      rows="5"
                      value={editedProfile.bio || ""}
                      onChange={handleChange}
                      placeholder="Describe your photographic philosophy and stylistic approach..."
                      className="w-full bg-transparent border-none focus:ring-0 p-0 text-gray-700 text-lg leading-relaxed font-medium italic relative z-10 resize-none placeholder:text-gray-300"
                    />
                  ) : (
                    <p className="text-gray-700 text-lg leading-relaxed font-medium italic relative z-10 whitespace-pre-wrap">
                      "{profile?.bio || "Every lens tells a different story. Share your vision with the world by adding a professional bio."}"
                    </p>
                  )}
                </div>
              </section>
            </div>

            <aside className="space-y-8">
              <section className="bg-gray-50/50 p-8 rounded-[2.5rem] border border-gray-100 flex flex-col gap-8">
                <div>
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6 px-1">Industry Metrics</h3>
                  <div className="space-y-4">
                    <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 group transition-all hover:shadow-md focus-within:ring-4 focus-within:ring-blue-500/10 ring-offset-2">
                      <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest block mb-2">Technical Experience</span>
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <input name="experience" type="number" value={editedProfile.experience || 0} onChange={handleChange} className="w-full bg-transparent font-black text-3xl text-blue-600 focus:outline-none" />
                          <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Years</span>
                        </div>
                      ) : (
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-black text-gray-900 tracking-tight">{profile?.experience || 0}</span>
                          <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Years in Field</span>
                        </div>
                      )}
                    </div>

                    <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 group transition-all hover:shadow-md focus-within:ring-4 focus-within:ring-blue-500/10 ring-offset-2">
                      <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest block mb-2">Daily Production Rate</span>
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <span className="text-blue-600 font-black text-xl">₹</span>
                          <input name="pricePerDay" type="number" value={editedProfile.pricePerDay || 0} onChange={handleChange} className="w-full bg-transparent font-black text-3xl text-blue-600 focus:outline-none" />
                        </div>
                      ) : (
                        <div className="flex items-baseline gap-1">
                          <span className="text-xs font-black text-gray-400 uppercase tracking-widest">₹</span>
                          <span className="text-3xl font-black text-gray-900 tracking-tight">{profile?.pricePerDay || 0}</span>
                          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest ml-auto bg-blue-50 px-2 py-1 rounded-md">Baseline</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 px-2">
                  <p className="text-[10px] font-bold text-gray-400 leading-relaxed uppercase tracking-tighter italic">
                    * All rates and experience metrics are subject to verification by the WedLens administration panel.
                  </p>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </div>

      {/* Portfolio Gallery */}
      <div className="premium-card p-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Portfolio Gallery</h2>
            <p className="text-gray-500 font-medium mt-1">Showcase your cinematic masterpieces and high-production captures.</p>
          </div>
          <label className="group flex items-center gap-3 bg-gradient-to-br from-gray-900 to-blue-900 text-white px-8 py-4 rounded-2xl text-sm font-black shadow-lg shadow-gray-200 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer uppercase tracking-widest">
            <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" /> Upload Session
            <input type="file" className="hidden" multiple accept="image/*" onChange={(e) => handlePortfolioUpload(e.target.files)} disabled={uploading} />
          </label>
        </div>

        {profile?.portfolio?.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {profile.portfolio.map((item, index) => (
              <div key={index} className="relative aspect-[4/5] rounded-[2rem] overflow-hidden group shadow-lg border border-white/20">
                <img src={item.url} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={`Portfolio ${index}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center p-6">
                  <button
                    onClick={() => handleDeletePortfolioImage(item.public_id)}
                    className="w-full py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white font-black text-xs uppercase tracking-widest hover:bg-red-500/80 hover:border-red-500 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0"
                  >
                    Remove Shot
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 border-4 border-dashed border-gray-50 rounded-[3rem] bg-gray-50/30">
            <div className="w-24 h-24 bg-white rounded-[2rem] shadow-sm flex items-center justify-center mx-auto mb-6">
              <Camera className="text-gray-200" size={48} />
            </div>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Gallery Empty</h3>
            <p className="text-gray-500 max-w-sm mx-auto mt-2 font-medium">Upload your high-definition photography to build credibility and attract premium wedding bookings.</p>
          </div>
        )}
      </div>
    </div>
  );
}
