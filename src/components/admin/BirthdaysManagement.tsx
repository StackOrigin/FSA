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
  Cake,
  Calendar,
  User,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';

interface Birthday {
  id: number;
  name: string;
  role: string;
  birth_date: string;
  image_url?: string;
  created_at: string;
}

interface BirthdaysManagementProps {
  onBack: () => void;
}

export function BirthdaysManagement({ onBack }: BirthdaysManagementProps) {
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBirthday, setEditingBirthday] = useState<Birthday | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    birth_date: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchBirthdays();
  }, []);

  const fetchBirthdays = async () => {
    try {
      const response = await fetch('/api/birthdays');
      const data = await response.json();
      setBirthdays(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching birthdays:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingBirthday
        ? `/api/birthdays/${editingBirthday.id}`
        : '/api/birthdays';
      const method = editingBirthday ? 'PUT' : 'POST';

      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('role', formData.role);
      submitData.append('birth_date', formData.birth_date);
      if (selectedFile) {
        submitData.append('image', selectedFile);
      }

      const response = await fetch(url, {
        method,
        body: submitData,
      });

      if (response.ok) {
        fetchBirthdays();
        closeModal();
      }
    } catch (error) {
      console.error('Error saving birthday:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this birthday entry?')) return;

    try {
      const response = await fetch(`/api/birthdays/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchBirthdays();
      }
    } catch (error) {
      console.error('Error deleting birthday:', error);
    }
  };

  const handleEdit = (birthday: Birthday) => {
    setEditingBirthday(birthday);
    setFormData({
      name: birthday.name,
      role: birthday.role,
      birth_date: birthday.birth_date.split('T')[0],
    });
    setImagePreview(birthday.image_url || null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingBirthday(null);
    setFormData({ name: '', role: '', birth_date: '' });
    setSelectedFile(null);
    setImagePreview(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredBirthdays = birthdays.filter((b) => {
    return (
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isBirthdayToday = (dateString: string) => {
    const today = new Date();
    const bdate = new Date(dateString);
    return bdate.getMonth() === today.getMonth() && bdate.getDate() === today.getDate();
  };

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
              Birthdays
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="admin-management-subtitle"
            >
              Manage student and staff birthdays
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
            Add Birthday
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

      {/* Birthdays List */}
      {loading ? (
        <div className="admin-loading">
          <Loader2 className="admin-loading-icon" />
        </div>
      ) : filteredBirthdays.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="admin-empty-state">
            <Cake className="admin-empty-icon" />
            <h3 className="admin-empty-title">
              {searchTerm ? 'No birthdays found' : 'No birthdays yet'}
            </h3>
            <p className="admin-empty-text">
              {searchTerm
                ? 'Try adjusting your search terms.'
                : 'Get started by adding student and staff birthdays!'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowModal(true)}
                className="admin-add-btn"
                style={{ marginTop: '1.5rem' }}
              >
                <Plus />
                Add First Birthday
              </button>
            )}
          </div>
        </motion.div>
      ) : (
        <div className="admin-cards-grid" style={{ gridTemplateColumns: '1fr' }}>
          {filteredBirthdays.map((birthday, index) => (
            <motion.div
              key={birthday.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="admin-item-card">
                <div className="admin-item-content">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    {isBirthdayToday(birthday.birth_date) && (
                      <span className="notice-priority-badge high">Today</span>
                    )}
                    <span className="contacts-info-badge">
                      <User style={{ width: '0.875rem', height: '0.875rem' }} />
                      {birthday.role}
                    </span>
                  </div>
                  <h3 className="admin-item-title" style={{ fontSize: '1.125rem' }}>
                    {birthday.name}
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.75rem' }}>
                    <span className="contacts-info-badge">
                      <Calendar style={{ width: '1rem', height: '1rem', color: '#3b82f6' }} />
                      {formatDate(birthday.birth_date)}
                    </span>
                  </div>
                </div>
                <div className="admin-item-actions">
                  <button className="admin-item-btn edit" onClick={() => handleEdit(birthday)}>
                    <Pencil />
                    Edit
                  </button>
                  <button className="admin-item-btn delete" onClick={() => handleDelete(birthday.id)}>
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
                  {editingBirthday ? 'Edit Birthday' : 'Add New Birthday'}
                </h2>
                <button onClick={closeModal} className="admin-modal-close">
                  <X />
                </button>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                <div className="admin-modal-body">
                  <div className="admin-modal-form">
                    <div className="admin-form-field">
                      <label htmlFor="name" className="admin-form-label">
                        Full Name *
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="admin-form-input"
                        placeholder="e.g. Aarav Sharma"
                        required
                      />
                    </div>

                    <div className="admin-form-field">
                      <label htmlFor="role" className="admin-form-label">
                        Role *
                      </label>
                      <input
                        id="role"
                        type="text"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="admin-form-input"
                        placeholder="e.g. Class 5 — Student or Mathematics Teacher"
                        required
                      />
                    </div>

                    <div className="admin-form-field">
                      <label htmlFor="birth_date" className="admin-form-label">
                        Date of Birth *
                      </label>
                      <input
                        id="birth_date"
                        type="date"
                        value={formData.birth_date}
                        onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                        className="admin-form-input"
                        required
                      />
                    </div>

                    <div className="admin-form-field">
                      <label className="admin-form-label">Photo (Optional)</label>
                      <div className="admin-upload-area">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="admin-upload-input"
                          id="birthday-image"
                        />
                        <label htmlFor="birthday-image" className="admin-upload-label">
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
                  </div>
                </div>

                <div className="admin-modal-actions">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="admin-modal-cancel-btn"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="admin-modal-submit-btn" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="animate-spin" size={18} />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>{editingBirthday ? 'Update Birthday' : 'Add Birthday'}</span>
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
