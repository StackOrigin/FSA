import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Image as ImageIcon,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Layout,
  Upload,
  ArrowLeft,
} from 'lucide-react';

interface Feature {
  title: string;
  description: string;
  gradient: string;
  image: string;
}

interface HomeContent {
  stats: Array<{
    id: number;
    value: number;
    suffix: string;
    label: string;
    icon: string;
  }>;
  features: Feature[];
  testimonials: Array<{
    name: string;
    role: string;
    content: string;
    avatar: string;
  }>;
}





export function HomeContentManagement() {
  const navigate = useNavigate();
  const onBack = () => navigate('/admin');
  const [homeContent, setHomeContent] = useState<HomeContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [featureForm, setFeatureForm] = useState<Feature>({
    title: '',
    description: '',
    gradient: 'from-blue-500 to-cyan-500',
    image: '',
  });
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchHomeContent();
  }, []);

  const fetchHomeContent = async () => {
    try {
      const response = await fetch('/api/content/home');
      if (response.ok) {
        const data = await response.json();
        setHomeContent(data);
      }
    } catch (error) {
      console.error('Error fetching home content:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveHomeContent = async (updatedContent: HomeContent) => {
    setSaving(true);
    try {
      const response = await fetch('/api/content/home', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedContent),
      });

      if (response.ok) {
        setHomeContent(updatedContent);
      } else {
        console.error('Failed to save content');
      }
    } catch (error) {
      console.error('Error saving home content:', error);
    } finally {
      setSaving(false);
    }
  };

  const openAddFeatureModal = () => {
    setEditingIndex(null);
    setFeatureForm({
      title: '',
      description: '',
      gradient: 'from-blue-500 to-cyan-500',
      image: '',
    });
    setShowFeatureModal(true);
  };

  const openEditFeatureModal = (index: number) => {
    if (!homeContent) return;
    setEditingIndex(index);
    setFeatureForm({ ...homeContent.features[index] });
    setImagePreview(homeContent.features[index].image || null);
    setShowFeatureModal(true);
  };

  const closeFeatureModal = () => {
    setShowFeatureModal(false);
    setEditingIndex(null);
    setFeatureForm({
      title: '',
      description: '',
      gradient: 'from-blue-500 to-cyan-500',
      image: '',
    });
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to server
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload/feature', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setFeatureForm({ ...featureForm, image: data.imageUrl });
      } else {
        console.error('Failed to upload image');
        alert('Failed to upload image. Please try again.');
        setImagePreview(featureForm.image || null);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error uploading image. Please try again.');
      setImagePreview(featureForm.image || null);
    } finally {
      setUploading(false);
    }
  };

  const handleFeatureSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!homeContent) return;

    const updatedFeatures = [...homeContent.features];

    if (editingIndex !== null) {
      updatedFeatures[editingIndex] = featureForm;
    } else {
      updatedFeatures.push(featureForm);
    }

    const updatedContent = {
      ...homeContent,
      features: updatedFeatures,
    };

    await saveHomeContent(updatedContent);
    closeFeatureModal();
  };

  const handleDeleteFeature = async (index: number) => {
    if (!homeContent) return;
    if (!confirm('Are you sure you want to delete this feature?')) return;

    const updatedFeatures = homeContent.features.filter((_, i) => i !== index);
    const updatedContent = {
      ...homeContent,
      features: updatedFeatures,
    };

    await saveHomeContent(updatedContent);
  };

  const moveFeature = async (index: number, direction: 'up' | 'down') => {
    if (!homeContent) return;
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= homeContent.features.length) return;

    const updatedFeatures = [...homeContent.features];
    [updatedFeatures[index], updatedFeatures[newIndex]] = [
      updatedFeatures[newIndex],
      updatedFeatures[index],
    ];

    const updatedContent = {
      ...homeContent,
      features: updatedFeatures,
    };

    await saveHomeContent(updatedContent);
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <Loader2 className="admin-loading-icon feature-loading" />
        <p className="admin-loading-text">Loading content...</p>
      </div>
    );
  }

  return (
    <div className="admin-management">
      {/* Header */}
      <div className="admin-management-header">
        <div className="admin-management-header-left">
          <button onClick={onBack} className="admin-back-btn">
            <ArrowLeft />
          </button>
          <div className="feature-header-icon">
            <Layout />
          </div>
          <div>
            <h1 className="admin-management-title">Home Page Content</h1>
            <p className="admin-management-subtitle">
              Manage the "Why Choose Us" section features
            </p>
          </div>
        </div>
        <button onClick={openAddFeatureModal} className="admin-add-btn feature-add-btn">
          <Plus />
          Add Feature
        </button>
      </div>

      {/* Features Count Badge */}
      {homeContent && homeContent.features.length > 0 && (
        <div className="feature-stats">
          <span className="feature-stats-badge">
            {homeContent.features.length} Feature{homeContent.features.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Features List */}
      <div className="feature-list">
        {homeContent?.features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="feature-card">
              <div className="feature-card-inner">
                {/* Order Controls */}
                <div className="feature-order-controls">
                  <span className="feature-order-number">#{index + 1}</span>
                  <button
                    onClick={() => moveFeature(index, 'up')}
                    disabled={index === 0 || saving}
                    className="feature-order-btn"
                  >
                    <ChevronUp />
                  </button>
                  <button
                    onClick={() => moveFeature(index, 'down')}
                    disabled={index === homeContent!.features.length - 1 || saving}
                    className="feature-order-btn"
                  >
                    <ChevronDown />
                  </button>
                </div>

                {/* Image Preview */}
                <div className="feature-image-preview">
                  <div 
                    className="feature-image-gradient"
                   
                  />
                  {feature.image ? (
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="feature-image"
                    />
                  ) : (
                    <div className="feature-image-placeholder">
                      <ImageIcon />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="feature-content">
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                  
                </div>

                {/* Actions */}
                <div className="feature-actions">
                  <button
                    onClick={() => openEditFeatureModal(index)}
                    disabled={saving}
                    className="feature-action-btn edit"
                  >
                    <Pencil />
                  </button>
                  <button
                    onClick={() => handleDeleteFeature(index)}
                    disabled={saving}
                    className="feature-action-btn delete"
                  >
                    <Trash2 />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {homeContent?.features.length === 0 && (
          <div className="admin-empty-state">
            <div className="feature-empty-icon">
              <Layout />
            </div>
            <h3 className="admin-empty-title">No features yet</h3>
            <p className="admin-empty-text">
              Add features to showcase in the "Why Choose Us" section of your homepage.
            </p>
            <button onClick={openAddFeatureModal} className="admin-add-btn feature-add-btn" style={{ marginTop: '1.5rem' }}>
              <Plus />
              Add Your First Feature
            </button>
          </div>
        )}
      </div>

      {/* Feature Modal */}
      <AnimatePresence>
        {showFeatureModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="feature-modal-backdrop"
              onClick={closeFeatureModal}
            />
            <div className="feature-modal-container">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="feature-modal"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="feature-modal-header">
                  <h2 className="feature-modal-title">
                    {editingIndex !== null ? 'Edit Feature' : 'Add Feature'}
                  </h2>
                  <button type="button" onClick={closeFeatureModal} className="feature-modal-close">
                    <X />
                  </button>
                </div>

                <form onSubmit={handleFeatureSubmit} className="feature-modal-form">
                  <div className="feature-modal-field">
                    <label htmlFor="title" className="feature-modal-label">Title</label>
                    <input
                      id="title"
                      value={featureForm.title}
                      onChange={(e) => setFeatureForm({ ...featureForm, title: e.target.value })}
                      placeholder="e.g., Modern Curriculum"
                      required
                      className="feature-modal-input"
                    />
                  </div>

                  <div className="feature-modal-field">
                    <label htmlFor="description" className="feature-modal-label">Description</label>
                    <textarea
                      id="description"
                      value={featureForm.description}
                      onChange={(e) => setFeatureForm({ ...featureForm, description: e.target.value })}
                      placeholder="Describe this feature..."
                      rows={2}
                      required
                      className="feature-modal-textarea"
                    />
                  </div>

                  <div className="feature-modal-field">
                    <label htmlFor="image" className="feature-modal-label">Image</label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                    <div className="feature-upload-area">
                      {(imagePreview || featureForm.image) ? (
                        <div className="feature-upload-preview">
                          <img
                            src={imagePreview || featureForm.image}
                            alt="Preview"
                            className="feature-upload-image"
                          />
                          <div className="feature-upload-overlay">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              disabled={uploading}
                              className="feature-upload-change-btn"
                            >
                              {uploading ? <Loader2 className="feature-spinner" /> : <Upload />}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setImagePreview(null);
                                setFeatureForm({ ...featureForm, image: '' });
                                if (fileInputRef.current) fileInputRef.current.value = '';
                              }}
                              className="feature-upload-remove-btn"
                            >
                              <Trash2 />
                            </button>
                          </div>
                          {uploading && (
                            <div className="feature-upload-loading">
                              <Loader2 className="feature-spinner" />
                            </div>
                          )}
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}
                          className="feature-upload-btn"
                        >
                          {uploading ? (
                            <Loader2 className="feature-spinner" />
                          ) : (
                            <>
                              <Upload />
                              <span>Upload image</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="feature-modal-actions">
                    <button type="button" onClick={closeFeatureModal} className="feature-modal-cancel-btn">
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving || uploading || !featureForm.image}
                      className="feature-modal-submit-btn"
                    >
                      {saving ? (
                        <Loader2 className="feature-spinner" />
                      ) : (
                        editingIndex !== null ? 'Update' : 'Add'
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Saving Indicator */}
      <AnimatePresence>
        {saving && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="saving-indicator"
          >
            <Loader2 />
            <span>Saving changes...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
