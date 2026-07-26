import { useState, useEffect } from 'react';
import { apiService as api } from '../../services/api';
import { useAuth } from '../../store/contexts/AuthContext';
import { useToast } from '../../store/contexts/ToastContext';
import { Camera, Upload, Trash2, User, Image as ImageIcon, RefreshCw } from 'lucide-react';

export default function PhotographerProfile() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [profile, setProfile] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.getProfile();
      if (res.data) {
        setProfile(res.data);
        setPortfolio(res.data.portfolio || res.data.images || []);
      }
    } catch (err) {
      console.error("Error loading profile:", err);
      showToast(err.response?.data?.message || "Could not load profile data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      showToast("Please select an image file to upload", "error");
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("portfolio", selectedFile);
      formData.append("image", selectedFile);

      const res = await api.uploadPortfolio(formData);
      showToast("Portfolio image uploaded successfully!", "success");
      setSelectedFile(null);
      
      const fileInput = document.getElementById("portfolioFileInput");
      if (fileInput) fileInput.value = "";

      if (res.data?.portfolio || res.data?.images) {
        setPortfolio(res.data.portfolio || res.data.images);
      } else {
        await fetchProfile();
      }
    } catch (err) {
      console.error("Upload error:", err);
      showToast(err.response?.data?.message || err.response?.data?.error || "Failed to upload image", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (item) => {
    const idToDelete = item.publicId || item.public_id || item.id || item._id || item;
    if (!idToDelete) return;
    if (!window.confirm("Are you sure you want to delete this photo from your portfolio?")) return;

    try {
      setDeletingId(idToDelete);
      await api.deletePortfolioImage(idToDelete);
      showToast("Photo deleted successfully", "success");
      setPortfolio((prev) => prev.filter((img) => {
        const imgId = img.publicId || img.public_id || img.id || img._id || img;
        return imgId !== idToDelete;
      }));
    } catch (err) {
      console.error("Delete error:", err);
      showToast(err.response?.data?.message || err.response?.data?.error || "Failed to delete photo", "error");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] space-y-4">
        <div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] animate-pulse">Loading Profile</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header / Basic Info */}
      <div className="bg-white p-8 md:p-10 rounded-[40px] border border-zinc-100 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="h-20 w-20 rounded-[28px] bg-zinc-900 flex items-center justify-center text-emerald-400 shadow-xl shadow-zinc-200 shrink-0">
            <User size={32} />
          </div>
          <div>
            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-1">Photographer Profile</p>
            <h1 className="text-3xl font-black text-zinc-900 tracking-tight">{profile?.name || user?.name}</h1>
            <p className="text-zinc-400 font-bold text-xs uppercase tracking-widest mt-1">{profile?.email || user?.email}</p>
          </div>
        </div>
      </div>

      {/* Portfolio Section */}
      <div className="bg-white rounded-[40px] border border-zinc-100 shadow-sm p-8 md:p-10 space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-100 pb-6">
          <div>
            <h2 className="text-2xl font-black text-zinc-900 tracking-tight flex items-center gap-3">
              <Camera className="text-emerald-500" size={24} /> My Portfolio
            </h2>
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mt-1">Upload and manage showcase photos</p>
          </div>
          <span className="px-4 py-1.5 bg-emerald-50 text-emerald-700 font-black text-xs rounded-full uppercase tracking-wider">
            {portfolio.length} Photos
          </span>
        </div>

        {/* Upload Form */}
        <form onSubmit={handleUpload} className="bg-zinc-50 p-6 rounded-[28px] border border-zinc-200/60 space-y-4">
          <label className="block text-xs font-black text-zinc-700 uppercase tracking-widest">Add New Portfolio Image</label>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="file"
              id="portfolioFileInput"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="flex-1 text-xs text-zinc-600 file:mr-4 file:py-3 file:px-6 file:rounded-2xl file:border-0 file:text-xs file:font-black file:uppercase file:tracking-wider file:bg-zinc-900 file:text-white hover:file:bg-black transition-all cursor-pointer"
            />
            <button
              type="submit"
              disabled={uploading || !selectedFile}
              className="px-8 py-3.5 bg-emerald-600 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-200 active:scale-95"
            >
              {uploading ? (
                <>
                  <RefreshCw className="animate-spin" size={16} /> Uploading...
                </>
              ) : (
                <>
                  <Upload size={16} /> Upload Image
                </>
              )}
            </button>
          </div>
        </form>

        {/* Portfolio Gallery */}
        <div>
          {portfolio.length === 0 ? (
            <div className="py-16 text-center border-2 border-dashed border-zinc-200 rounded-[32px]">
              <ImageIcon className="mx-auto text-zinc-300 mb-3" size={40} />
              <p className="text-sm font-bold text-zinc-500">No portfolio images uploaded yet.</p>
              <p className="text-xs text-zinc-400 mt-1">Upload your first photo above to showcase your work.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {portfolio.map((img, idx) => {
                const imgUrl = typeof img === 'string' ? img : (img.url || img.secure_url || img.path);
                const imgId = typeof img === 'string' ? img : (img.publicId || img.public_id || img.id || img._id || idx);

                return (
                  <div key={imgId || idx} className="group relative rounded-[28px] overflow-hidden border border-zinc-200/80 bg-zinc-100 shadow-sm hover:shadow-md transition-all">
                    <div className="h-60 w-full overflow-hidden">
                      <img
                        src={imgUrl}
                        alt={`Portfolio item ${idx + 1}`}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
                      <span className="text-[10px] font-bold text-white uppercase tracking-wider">Photo #{idx + 1}</span>
                      <button
                        onClick={() => handleDelete(img)}
                        disabled={deletingId === imgId}
                        className="px-3 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-all flex items-center gap-1.5 shadow-lg active:scale-95 disabled:opacity-50"
                      >
                        <Trash2 size={14} />
                        {deletingId === imgId ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

