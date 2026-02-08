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
  Bell,
  Calendar,
  Tag,
  Upload,
  Image as ImageIcon,
} from 'lucide-react';

interface Notice {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: string;
  image_url?: string;
  download_url?: string;
  created_at: string;
  updated_at: string;
}

interface NoticesManagementProps {
  onBack: () => void;
}

export function NoticesManagement({ onBack }: NoticesManagementProps) {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'General',
    priority: 'medium',
    download_url: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const categories = ['General', 'Academic', 'Administrative', 'Event', 'Exam', 'Holiday'];
  const priorities = ['low', 'medium', 'high'];

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await fetch('/api/notices');
      const data = await response.json();
      setNotices(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching notices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingNotice
        ? `/api/notices/${editingNotice.id}`
        : '/api/notices';
      const method = editingNotice ? 'PUT' : 'POST';

      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('category', formData.category);
      submitData.append('priority', formData.priority);
      if (formData.download_url) {
        submitData.append('download_url', formData.download_url);
      }

      if (selectedFile) {
        submitData.append('image', selectedFile);
      }

      const response = await fetch(url, {
        method,
        body: submitData,
      });

      if (response.ok) {
        fetchNotices();
        closeModal();
      }
    } catch (error) {
      console.error('Error saving notice:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this notice?')) return;

    try {
      const response = await fetch(`/api/notices/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchNotices();
      }
    } catch (error) {
      console.error('Error deleting notice:', error);
    }
  };

  const handleEdit = (notice: Notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      description: notice.description,
      category: notice.category,
      priority: notice.priority,
      download_url: notice.download_url || '',
    });
    setImagePreview(notice.image_url || null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingNotice(null);
    setFormData({
      title: '',
      description: '',
      category: 'General',
      priority: 'medium',
      download_url: '',
    });
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

  const filteredNotices = notices.filter((notice) => {
    const matchesSearch =
      notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-orange-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
              Notices
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="admin-management-subtitle"
            >
              Create and manage school notices
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
            Add Notice
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
          placeholder="Search notices..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="admin-search-input"
        />
      </motion.div>

      {/* Notices List */}
      {loading ? (
        <div className="admin-loading">
          <Loader2 className="admin-loading-icon" />
        </div>
      ) : filteredNotices.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="admin-empty-state">
            <Bell className="admin-empty-icon" />
            <h3 className="admin-empty-title">
              {searchTerm ? 'No notices found' : 'No notices yet'}
            </h3>
            <p className="admin-empty-text">
              {searchTerm ? 'Try adjusting your search terms.' : 'Get started by adding your first notice!'}
            </p>
            {!searchTerm && (
              <button onClick={() => setShowModal(true)} className="admin-add-btn" style={{ marginTop: '1.5rem' }}>
                <Plus />
                Add Your First Notice
              </button>
            )}
          </div>
        </motion.div>
      ) : (
        <div className="admin-cards-grid" style={{ gridTemplateColumns: '1fr' }}>
          {filteredNotices.map((notice, index) => (
            <motion.div
              key={notice.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="admin-item-card">
                <div className="admin-item-content">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span className={`notice-priority-badge ${notice.priority}`}>
                      {notice.priority === 'high' ? 'Urgent' : notice.priority}
                    </span>
                    <span className="contacts-info-badge">
                      <Tag style={{ width: '0.875rem', height: '0.875rem' }} />
                      {notice.category}
                    </span>
                  </div>
                  <h3 className="admin-item-title" style={{ fontSize: '1.125rem' }}>
                    {notice.title}
                  </h3>
                  {notice.description && (
                    <p className="admin-item-meta" style={{ marginTop: '0.5rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {notice.description}
                    </p>
                  )}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}>
                    <span className="contacts-info-badge">
                      <Calendar style={{ width: '1rem', height: '1rem', color: '#3b82f6' }} />
                      {formatDate(notice.created_at)}
                    </span>
                  </div>
                </div>
                <div className="admin-item-actions">
                  <button className="admin-item-btn edit" onClick={() => handleEdit(notice)}>
                    <Pencil />
                    Edit
                  </button>
                  <button className="admin-item-btn delete" onClick={() => handleDelete(notice.id)}>
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
                  {editingNotice ? 'Edit Notice' : 'Add New Notice'}
                </h2>
                <button onClick={closeModal} className="admin-modal-close">
                  <X />
                </button>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                <div className="admin-modal-body">
                  <div className="admin-modal-form">
                    <div className="admin-form-field">
                      <label htmlFor="title" className="admin-form-label">Notice Title *</label>
                      <input
                        id="title"
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="admin-form-input"
                        placeholder="Enter notice title"
                        required
                      />
                    </div>

                    <div className="admin-form-field">
                      <label htmlFor="description" className="admin-form-label">Description *</label>
                      <textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="admin-form-textarea"
                        placeholder="Describe the notice..."
                        rows={4}
                        required
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="admin-form-field">
                        <label htmlFor="category" className="admin-form-label">Category</label>
                        <select
                          id="category"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          className="admin-form-input"
                        >
                          {categories.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="admin-form-field">
                        <label htmlFor="priority" className="admin-form-label">Priority</label>
                        <select
                          id="priority"
                          value={formData.priority}
                          onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                          className="admin-form-input"
                        >
                          {priorities.map((priority) => (
                            <option key={priority} value={priority}>
                              {priority.charAt(0).toUpperCase() + priority.slice(1)}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="admin-form-field">
                      <label htmlFor="download_url" className="admin-form-label">Download URL (Optional)</label>
                      <input
                        id="download_url"
                        type="text"
                        value={formData.download_url}
                        onChange={(e) => setFormData({ ...formData, download_url: e.target.value })}
                        className="admin-form-input"
                        placeholder="https://..."
                      />
                    </div>

                    <div className="admin-form-field">
                      <label className="admin-form-label">Attachment (Image/Document)</label>
                      <div className="admin-upload-area">
                        <input
                          type="file"
                          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                          onChange={handleImageChange}
                          className="admin-upload-input"
                          id="notice-image"
                        />
                        <label htmlFor="notice-image" className="admin-upload-label">
                          {imagePreview ? (
                            <div className="admin-upload-preview">
                              <img src={imagePreview} alt="Preview" onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://placehold.co/400x300?text=Document';
                              }} />
                              <div className="admin-upload-overlay">
                                <Upload size={24} />
                                <span>Change File</span>
                              </div>
                            </div>
                          ) : (
                            <div className="admin-upload-placeholder">
                              <ImageIcon size={32} />
                              <span>Click to upload file</span>
                              <span className="admin-upload-hint">Images, PDF, DOC up to 10MB</span>
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
                      <span>{editingNotice ? 'Update Notice' : 'Add Notice'}</span>
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
