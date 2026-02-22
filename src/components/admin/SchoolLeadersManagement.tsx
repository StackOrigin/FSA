import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Search,
  Loader2,
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  Users,
  Crown,
} from 'lucide-react';

interface SchoolLeader {
  id: number;
  role: string;
  name: string;
  image: string;
  color: string;
  sort_order: number;
  created_at: string;
}

interface SchoolLeadersManagementProps {
  onBack: () => void;
}

export function SchoolLeadersManagement({ onBack }: SchoolLeadersManagementProps) {
  const [leaders, setLeaders] = useState<SchoolLeader[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLeader, setEditingLeader] = useState<SchoolLeader | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    role: '',
    name: '',
    color: '#6366F1',
    sort_order: 0,
  });
  const [submitting, setSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaders();
  }, []);

  const fetchLeaders = async () => {
    try {
      const response = await fetch('/api/school-leaders');
      const data = await response.json();
      setLeaders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching school leaders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingLeader
        ? `/api/school-leaders/${editingLeader.id}`
        : '/api/school-leaders';
      const method = editingLeader ? 'PUT' : 'POST';

      const submitData = new FormData();
      submitData.append('role', formData.role);
      submitData.append('name', formData.name);
      submitData.append('color', formData.color);
      submitData.append('sort_order', String(formData.sort_order));
      if (selectedFile) submitData.append('image', selectedFile);

      const response = await fetch(url, { method, body: submitData });

      if (response.ok) {
        fetchLeaders();
        closeModal();
      }
    } catch (error) {
      console.error('Error saving school leader:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this school leader?')) return;
    try {
      const response = await fetch(`/api/school-leaders/${id}`, { method: 'DELETE' });
      if (response.ok) fetchLeaders();
    } catch (error) {
      console.error('Error deleting school leader:', error);
    }
  };

  const handleEdit = (leader: SchoolLeader) => {
    setEditingLeader(leader);
    setFormData({
      role: leader.role,
      name: leader.name,
      color: leader.color,
      sort_order: leader.sort_order,
    });
    setImagePreview(leader.image || null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingLeader(null);
    setFormData({ role: '', name: '', color: '#6366F1', sort_order: 0 });
    setSelectedFile(null);
    setImagePreview(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const filteredLeaders = leaders.filter((l) =>
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-management">
      {/* Header */}
      <div className="admin-management-header">
        <div className="admin-management-header-left">
          <button onClick={onBack} className="admin-back-btn">
            <ArrowLeft />
          </button>
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="admin-management-title"
            >
              School Leaders
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="admin-management-subtitle"
            >
              Manage school captains, prefects, and representatives
            </motion.p>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <button onClick={() => setShowModal(true)} className="admin-add-btn">
            <Plus />
            Add Leader
          </button>
        </motion.div>
      </div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="admin-search-wrapper"
      >
        <Search className="admin-search-icon" />
        <input
          type="text"
          placeholder="Search by name or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="admin-search-input"
        />
      </motion.div>

      {/* Leaders List */}
      {loading ? (
        <div className="admin-loading">
          <Loader2 className="admin-loading-icon" />
        </div>
      ) : filteredLeaders.length === 0 ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="admin-empty-state">
            <Crown className="admin-empty-icon" />
            <h3 className="admin-empty-title">
              {searchTerm ? 'No leaders found' : 'No school leaders yet'}
            </h3>
            <p className="admin-empty-text">
              {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding school leaders!'}
            </p>
            {!searchTerm && (
              <button onClick={() => setShowModal(true)} className="admin-add-btn" style={{ marginTop: '1.5rem' }}>
                <Plus />
                Add First Leader
              </button>
            )}
          </div>
        </motion.div>
      ) : (
        <div className="admin-cards-grid" style={{ gridTemplateColumns: '1fr' }}>
          {filteredLeaders.map((leader, index) => (
            <motion.div
              key={leader.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="admin-item-card">
                <div className="admin-item-content">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <div style={{ width: '1rem', height: '1rem', borderRadius: '50%', background: leader.color }} />
                    <span className="contacts-info-badge" style={{ color: leader.color, fontWeight: 600 }}>
                      {leader.role}
                    </span>
                  </div>
                  <h3 className="admin-item-title" style={{ fontSize: '1.125rem' }}>
                    {leader.name}
                  </h3>
                </div>
                <div className="admin-item-actions">
                  <button className="admin-item-btn edit" onClick={() => handleEdit(leader)}>
                    <Pencil />
                    Edit
                  </button>
                  <button className="admin-item-btn delete" onClick={() => handleDelete(leader.id)}>
                    <Trash2 />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="admin-modal-overlay"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="admin-modal"
            >
              <div className="admin-modal-header">
                <h2 className="admin-modal-title">
                  {editingLeader ? 'Edit School Leader' : 'Add New School Leader'}
                </h2>
                <button onClick={closeModal} className="admin-modal-close">
                  <X />
                </button>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                <div className="admin-modal-body">
                  <div className="admin-modal-form">
                    <div className="admin-form-field">
                      <label className="admin-form-label">Role / Title *</label>
                      <input
                        type="text"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="admin-form-input"
                        placeholder="e.g. Captain, Vice Captain, School Prefect"
                        required
                      />
                    </div>

                    <div className="admin-form-field">
                      <label className="admin-form-label">Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="admin-form-input"
                        placeholder="Enter student's name"
                        required
                      />
                    </div>

                    <div className="admin-form-field">
                      <label className="admin-form-label">Accent Color</label>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <input
                          type="color"
                          value={formData.color}
                          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                          style={{ width: '3rem', height: '2.5rem', border: 'none', cursor: 'pointer', borderRadius: '0.375rem' }}
                        />
                        <input
                          type="text"
                          value={formData.color}
                          onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                          className="admin-form-input"
                          placeholder="#6366F1"
                          style={{ flex: 1 }}
                        />
                      </div>
                    </div>

                    <div className="admin-form-field">
                      <label className="admin-form-label">Photo (Optional)</label>
                      <div className="admin-upload-area">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="admin-upload-input"
                          id="leader-image"
                        />
                        <label htmlFor="leader-image" className="admin-upload-label">
                          {imagePreview ? (
                            <div className="admin-upload-preview">
                              <img src={imagePreview} alt="Preview" />
                              <div className="admin-upload-overlay">
                                <Upload size={24} />
                                <span>Change Photo</span>
                              </div>
                            </div>
                          ) : (
                            <div className="admin-upload-placeholder">
                              <ImageIcon size={32} />
                              <span>Click to upload photo</span>
                              <span className="admin-upload-hint">JPG, PNG, WebP up to 5MB</span>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>

                    <div className="admin-form-field">
                      <label className="admin-form-label">Sort Order</label>
                      <input
                        type="number"
                        value={formData.sort_order}
                        onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                        className="admin-form-input"
                        placeholder="0"
                        min={0}
                      />
                    </div>
                  </div>
                </div>

                <div className="admin-modal-actions">
                  <button type="button" onClick={closeModal} className="admin-modal-cancel-btn" disabled={submitting}>
                    Cancel
                  </button>
                  <button type="submit" className="admin-modal-submit-btn" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>{editingLeader ? 'Update Leader' : 'Add Leader'}</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
