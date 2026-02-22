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
  Flag,
} from 'lucide-react';

interface SchoolHouse {
  id: number;
  name: string;
  color: string;
  border: string;
  captain_name: string;
  captain_image: string;
  vice_captain_name: string;
  vice_captain_image: string;
  sort_order: number;
  created_at: string;
}

interface SchoolHousesManagementProps {
  onBack: () => void;
}

export function SchoolHousesManagement({ onBack }: SchoolHousesManagementProps) {
  const [houses, setHouses] = useState<SchoolHouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingHouse, setEditingHouse] = useState<SchoolHouse | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    color: '#3B82F6',
    border: 'rgba(59, 130, 246, 0.3)',
    captain_name: '',
    vice_captain_name: '',
    sort_order: 0,
  });
  const [submitting, setSubmitting] = useState(false);
  const [captainFile, setCaptainFile] = useState<File | null>(null);
  const [viceCaptainFile, setViceCaptainFile] = useState<File | null>(null);
  const [captainPreview, setCaptainPreview] = useState<string | null>(null);
  const [viceCaptainPreview, setViceCaptainPreview] = useState<string | null>(null);

  useEffect(() => {
    fetchHouses();
  }, []);

  const fetchHouses = async () => {
    try {
      const response = await fetch('/api/school-houses');
      const data = await response.json();
      setHouses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching school houses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingHouse
        ? `/api/school-houses/${editingHouse.id}`
        : '/api/school-houses';
      const method = editingHouse ? 'PUT' : 'POST';

      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('color', formData.color);
      submitData.append('border', formData.border);
      submitData.append('captain_name', formData.captain_name);
      submitData.append('vice_captain_name', formData.vice_captain_name);
      submitData.append('sort_order', String(formData.sort_order));
      if (captainFile) submitData.append('captain_image', captainFile);
      if (viceCaptainFile) submitData.append('vice_captain_image', viceCaptainFile);

      const response = await fetch(url, { method, body: submitData });

      if (response.ok) {
        fetchHouses();
        closeModal();
      }
    } catch (error) {
      console.error('Error saving school house:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this school house?')) return;
    try {
      const response = await fetch(`/api/school-houses/${id}`, { method: 'DELETE' });
      if (response.ok) fetchHouses();
    } catch (error) {
      console.error('Error deleting school house:', error);
    }
  };

  const handleEdit = (house: SchoolHouse) => {
    setEditingHouse(house);
    setFormData({
      name: house.name,
      color: house.color,
      border: house.border,
      captain_name: house.captain_name,
      vice_captain_name: house.vice_captain_name,
      sort_order: house.sort_order,
    });
    setCaptainPreview(house.captain_image || null);
    setViceCaptainPreview(house.vice_captain_image || null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingHouse(null);
    setFormData({ name: '', color: '#3B82F6', border: 'rgba(59, 130, 246, 0.3)', captain_name: '', vice_captain_name: '', sort_order: 0 });
    setCaptainFile(null);
    setViceCaptainFile(null);
    setCaptainPreview(null);
    setViceCaptainPreview(null);
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFile: (f: File | null) => void,
    setPreview: (s: string | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Auto-generate border from color
  const handleColorChange = (color: string) => {
    // Convert hex to rgba for border
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    setFormData({
      ...formData,
      color,
      border: `rgba(${r}, ${g}, ${b}, 0.3)`,
    });
  };

  const filteredHouses = houses.filter((h) =>
    h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.captain_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.vice_captain_name.toLowerCase().includes(searchTerm.toLowerCase())
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
              School Houses
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="admin-management-subtitle"
            >
              Manage school house captains and vice captains
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
            Add House
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
          placeholder="Search by house name or captain..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="admin-search-input"
        />
      </motion.div>

      {/* Houses List */}
      {loading ? (
        <div className="admin-loading">
          <Loader2 className="admin-loading-icon" />
        </div>
      ) : filteredHouses.length === 0 ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <div className="admin-empty-state">
            <Flag className="admin-empty-icon" />
            <h3 className="admin-empty-title">
              {searchTerm ? 'No houses found' : 'No school houses yet'}
            </h3>
            <p className="admin-empty-text">
              {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding school houses!'}
            </p>
            {!searchTerm && (
              <button onClick={() => setShowModal(true)} className="admin-add-btn" style={{ marginTop: '1.5rem' }}>
                <Plus />
                Add First House
              </button>
            )}
          </div>
        </motion.div>
      ) : (
        <div className="admin-cards-grid" style={{ gridTemplateColumns: '1fr' }}>
          {filteredHouses.map((house, index) => (
            <motion.div
              key={house.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="admin-item-card">
                <div className="admin-item-content">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <div style={{ width: '1rem', height: '1rem', borderRadius: '50%', background: house.color }} />
                    <h3 className="admin-item-title" style={{ fontSize: '1.125rem', color: house.color }}>
                      {house.name}
                    </h3>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.75rem' }}>
                    <span className="contacts-info-badge">
                      <Users style={{ width: '0.875rem', height: '0.875rem' }} />
                      Captain: {house.captain_name || 'TBA'}
                    </span>
                    <span className="contacts-info-badge">
                      <Users style={{ width: '0.875rem', height: '0.875rem' }} />
                      Vice Captain: {house.vice_captain_name || 'TBA'}
                    </span>
                  </div>
                </div>
                <div className="admin-item-actions">
                  <button className="admin-item-btn edit" onClick={() => handleEdit(house)}>
                    <Pencil />
                    Edit
                  </button>
                  <button className="admin-item-btn delete" onClick={() => handleDelete(house.id)}>
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
                  {editingHouse ? 'Edit School House' : 'Add New School House'}
                </h2>
                <button onClick={closeModal} className="admin-modal-close">
                  <X />
                </button>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                <div className="admin-modal-body">
                  <div className="admin-modal-form">
                    <div className="admin-form-field">
                      <label className="admin-form-label">House Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="admin-form-input"
                        placeholder="e.g. Red House"
                        required
                      />
                    </div>

                    <div className="admin-form-field">
                      <label className="admin-form-label">House Color *</label>
                      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <input
                          type="color"
                          value={formData.color}
                          onChange={(e) => handleColorChange(e.target.value)}
                          style={{ width: '3rem', height: '2.5rem', border: 'none', cursor: 'pointer', borderRadius: '0.375rem' }}
                        />
                        <input
                          type="text"
                          value={formData.color}
                          onChange={(e) => handleColorChange(e.target.value)}
                          className="admin-form-input"
                          placeholder="#EF4444"
                          style={{ flex: 1 }}
                        />
                      </div>
                    </div>

                    <div className="admin-form-field">
                      <label className="admin-form-label">Captain Name</label>
                      <input
                        type="text"
                        value={formData.captain_name}
                        onChange={(e) => setFormData({ ...formData, captain_name: e.target.value })}
                        className="admin-form-input"
                        placeholder="Enter captain's name"
                      />
                    </div>

                    <div className="admin-form-field">
                      <label className="admin-form-label">Captain Photo (Optional)</label>
                      <div className="admin-upload-area">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, setCaptainFile, setCaptainPreview)}
                          className="admin-upload-input"
                          id="captain-image"
                        />
                        <label htmlFor="captain-image" className="admin-upload-label">
                          {captainPreview ? (
                            <div className="admin-upload-preview">
                              <img src={captainPreview} alt="Captain Preview" />
                              <div className="admin-upload-overlay">
                                <Upload size={24} />
                                <span>Change Photo</span>
                              </div>
                            </div>
                          ) : (
                            <div className="admin-upload-placeholder">
                              <ImageIcon size={32} />
                              <span>Click to upload captain photo</span>
                              <span className="admin-upload-hint">JPG, PNG, WebP up to 5MB</span>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>

                    <div className="admin-form-field">
                      <label className="admin-form-label">Vice Captain Name</label>
                      <input
                        type="text"
                        value={formData.vice_captain_name}
                        onChange={(e) => setFormData({ ...formData, vice_captain_name: e.target.value })}
                        className="admin-form-input"
                        placeholder="Enter vice captain's name"
                      />
                    </div>

                    <div className="admin-form-field">
                      <label className="admin-form-label">Vice Captain Photo (Optional)</label>
                      <div className="admin-upload-area">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(e, setViceCaptainFile, setViceCaptainPreview)}
                          className="admin-upload-input"
                          id="vice-captain-image"
                        />
                        <label htmlFor="vice-captain-image" className="admin-upload-label">
                          {viceCaptainPreview ? (
                            <div className="admin-upload-preview">
                              <img src={viceCaptainPreview} alt="Vice Captain Preview" />
                              <div className="admin-upload-overlay">
                                <Upload size={24} />
                                <span>Change Photo</span>
                              </div>
                            </div>
                          ) : (
                            <div className="admin-upload-placeholder">
                              <ImageIcon size={32} />
                              <span>Click to upload vice captain photo</span>
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
                      <span>{editingHouse ? 'Update House' : 'Add House'}</span>
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
