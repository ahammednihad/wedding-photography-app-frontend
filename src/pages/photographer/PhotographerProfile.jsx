import { useState, useEffect } from "react";
import axios from "axios";
import { Layout } from "@/components/Layout";
import { API_BASE } from "@/config/api";
import { getAuthHeaders } from "@/utils/auth";
export default function PhotographerProfile() {
  const [profile, setProfile] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${API_BASE}/photographer/profile`, {
        headers: getAuthHeaders(),
      });
      setProfile(res.data);
      setPortfolio(res.data?.portfolio || res.data?.images || []);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to load profile');
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
      setError('Please select an image file to upload.');
      return;
    }
    setUploading(true);
    setError('');
    setSuccess('');
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('portfolio', selectedFile);
      formData.append('image', selectedFile);
      const res = await axios.post(`${API_BASE}/photographer/upload/portfolio`, formData, {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess('Portfolio photo uploaded successfully!');
      setSelectedFile(null);
      const fileInput = document.getElementById('portfolioFileInput');
      if (fileInput) fileInput.value = '';
      if (res.data?.portfolio || res.data?.images) {
        setPortfolio(res.data.portfolio || res.data.images);
      } else if (res.data?.image || res.data?.url) {
        setPortfolio((prev) => [...prev, res.data.image || res.data]);
      } else {
        await fetchProfile();
      }
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };
  const handleDelete = async (item) => {
    const idToDelete = item.publicId || item.public_id || item.id || item._id || item;
    if (!idToDelete) return;
    if (!window.confirm('Are you sure you want to delete this photo from your portfolio?')) return;
    setDeletingId(idToDelete);
    setError('');
    setSuccess('');
    try {
      await axios.delete(`${API_BASE}/photographer/upload/portfolio/${encodeURIComponent(idToDelete)}`, {
        headers: getAuthHeaders(),
      });
      setSuccess('Portfolio photo deleted successfully!');
      setPortfolio((prev) => prev.filter((img) => {
        const imgId = img.publicId || img.public_id || img.id || img._id || img;
        return imgId !== idToDelete;
      }));
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to delete photo');
    } finally {
      setDeletingId(null);
    }
  };
  if (loading) return <Layout title="My Profile"><div className="text-center py-5"><div className="spinner-border text-primary" /></div></Layout>;
  return (
    <Layout title="My Profile">
      {error && <div className="alert alert-danger alert-dismissible fade show">{error}<button type="button" className="btn-close" onClick={() => setError('')}></button></div>}
      {success && <div className="alert alert-success alert-dismissible fade show">{success}<button type="button" className="btn-close" onClick={() => setSuccess('')}></button></div>}
      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h5 className="card-title mb-3">Photographer Profile</h5>
          <p className="mb-1"><strong>Name:</strong> {profile?.name ?? '—'}</p>
          <p className="mb-1"><strong>Email:</strong> {profile?.email ?? '—'}</p>
          <p className="mb-0"><strong>Role:</strong> Photographer</p>
        </div>
      </div>
      <div className="card shadow-sm mb-4">
        <div className="card-header bg-white py-3">
          <h5 className="mb-0">Manage Portfolio</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleUpload} className="mb-4">
            <label className="form-label font-weight-bold">Upload New Photo</label>
            <div className="input-group">
              <input
                type="file"
                id="portfolioFileInput"
                className="form-control"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
              />
              <button className="btn btn-primary" type="submit" disabled={uploading || !selectedFile}>
                {uploading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Uploading...
                  </>
                ) : (
                  'Upload Photo'
                )}
              </button>
            </div>
          </form>
          <h6 className="mb-3">Portfolio Photos ({portfolio.length})</h6>
          {portfolio.length === 0 ? (
            <p className="text-muted italic">No portfolio photos uploaded yet.</p>
          ) : (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
              {portfolio.map((img, idx) => {
                const imgUrl = typeof img === 'string' ? img : (img.url || img.secure_url || img.path);
                const imgId = typeof img === 'string' ? img : (img.publicId || img.public_id || img.id || img._id || idx);
                return (
                  <div className="col" key={imgId || idx}>
                    <div className="card h-100 shadow-sm overflow-hidden">
                      <div style={{ height: '180px', backgroundColor: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {imgUrl ? (
                          <img src={imgUrl} alt={`Portfolio ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <span className="text-muted">No Image</span>
                        )}
                      </div>
                      <div className="card-footer bg-white text-end py-2">
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDelete(img)}
                          disabled={deletingId === imgId}
                        >
                          {deletingId === imgId ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
