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
  AlertCircle,
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
  const [filterCategory, setFilterCategory] = useState('all');
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
    const matchesCategory = filterCategory === 'all' || notice.category === filterCategory;
    return matchesSearch && matchesCategory;
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
    <div className="admin-page">
      {/* Header */}
      <div className="admin-page-header">
        <button onClick={onBack} className="admin-back-btn">
          <ArrowLeft />
          <span>Back to Dashboard</span>
        </button>
        <div className="admin-page-header-content">
          <div>
            <h1 className="admin-page-title">
              <Bell className="admin-page-icon" />
              Notices Management
            </h1>
            <p className="admin-page-subtitle">
              Create and manage school notices and announcements
            </p>
          </div>
          <button onClick={() => setShowModal(true)} className="admin-btn-primary">
            <Plus />
            <span>Add Notice</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-filters">
        <div className="admin-search-box">
          <Search className="admin-search-icon" />
          <input
            type="text"
            placeholder="Search notices..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="admin-search-input"
          />
        </div>
        <div className="admin-filter-group">
          <label className="admin-filter-label">Category:</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="admin-filter-select"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Notices List */}
      <div className="admin-content">
        {loading ? (
          <div className="admin-loading">
            <Loader2 className="admin-loading-spinner" />
            <p>Loading notices...</p>
          </div>
        ) : filteredNotices.length === 0 ? (
          <div className="admin-empty">
            <Bell size={64} />
            <h3>No notices found</h3>
            <p>
              {searchTerm || filterCategory !== 'all'
                ? 'Try adjusting your filters'
                : 'Get started by creating your first notice'}
            </p>
          </div>
        ) : (
          <div className="admin-cards-grid">
            {filteredNotices.map((notice, index) => (
              <motion.div
                key={notice.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="admin-notice-card"
              >
                {notice.image_url && (
                  <div className="admin-notice-image">
                    <img src={notice.image_url} alt={notice.title} />
                  </div>
                )}
                <div className="admin-notice-content">
                  <div className="admin-notice-header">
                    <span className={`admin-priority-badge ${notice.priority}`}>
                      {notice.priority === 'high' ? 'Urgent' : notice.priority}
                    </span>
                    <span className="admin-category-badge">
                      <Tag size={14} />
                      {notice.category}
                    </span>
                  </div>
                  <h3 className="admin-notice-title">{notice.title}</h3>
                  <p className="admin-notice-description">{notice.description}</p>
                  <div className="admin-notice-footer">
                    <div className="admin-notice-date">
                      <Calendar size={14} />
                      <span>{formatDate(notice.created_at)}</span>
                    </div>
                    <div className="admin-notice-actions">
                      <button
                        onClick={() => handleEdit(notice)}
                        className="admin-icon-btn admin-icon-btn-edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(notice.id)}
                        className="admin-icon-btn admin-icon-btn-delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

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
                  {editingNotice ? 'Edit Notice' : 'Create New Notice'}
                </h2>
                <button onClick={closeModal} className="admin-modal-close">
                  <X />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="admin-modal-form">
                <div className="admin-form-group">
                  <label className="admin-form-label">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="admin-form-input"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="admin-form-textarea"
                    rows={4}
                    required
                  />
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="admin-form-select"
                    >
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label className="admin-form-label">Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      className="admin-form-select"
                    >
                      {priorities.map((priority) => (
                        <option key={priority} value={priority}>
                          {priority.charAt(0).toUpperCase() + priority.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Download URL (Optional)</label>
                  <input
                    type="text"
                    value={formData.download_url}
                    onChange={(e) => setFormData({ ...formData, download_url: e.target.value })}
                    className="admin-form-input"
                    placeholder="https://..."
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-form-label">Image (Optional)</label>
                  <div className="admin-upload-area">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="admin-upload-input"
                      id="notice-image"
                    />
                    <label htmlFor="notice-image" className="admin-upload-label">
                      {imagePreview ? (
                        <div className="admin-upload-preview">
                          <img src={imagePreview} alt="Preview" />
                          <div className="admin-upload-overlay">
                            <Upload size={24} />
                            <span>Change Image</span>
                          </div>
                        </div>
                      ) : (
                        <div className="admin-upload-placeholder">
                          <ImageIcon size={32} />
                          <span>Click to upload image</span>
                          <span className="admin-upload-hint">PNG, JPG up to 5MB</span>
                        </div>
                      )}
                    </label>
                  </div>
                </div>

                <div className="admin-modal-actions">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="admin-btn-secondary"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="admin-btn-primary" disabled={submitting}>
                    {submitting ? (
                      <>
                        <Loader2 className="admin-btn-spinner" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>{editingNotice ? 'Update Notice' : 'Create Notice'}</span>
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
