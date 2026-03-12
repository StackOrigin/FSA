import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Trash2,
  Image as ImageIcon,
  X,
  Search,
  Loader2,
  ExternalLink,
  ImagePlus,
  Filter,
  Sparkles,
  ArrowLeft,
  Upload,
  CheckCircle2,
} from 'lucide-react';

interface GalleryImage {
  id: number;
  title: string;
  image_url: string;
  category: string;
  description: string;
  created_at: string;
}

export function GalleryManagement() {
  const navigate = useNavigate();
  const onBack = () => navigate('/admin');
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    category: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [fullScreenPreview, setFullScreenPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['all', 'classroom activity', 'sports', 'events', 'extra excursion', 'school program'];

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await fetch('/api/gallery');
      const data = await response.json();
      setImages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      setFormData(prev => ({ ...prev, imageUrl: '' }));
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, [handleFileSelect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setUploadProgress(0);

    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('category', formData.category);
      submitData.append('description', formData.description);
      
      if (selectedFile) {
        submitData.append('image', selectedFile);
      } else if (formData.imageUrl) {
        submitData.append('imageUrl', formData.imageUrl);
      }

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      const response = await fetch('/api/gallery', {
        method: 'POST',
        body: submitData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.ok) {
        setTimeout(() => {
          fetchImages();
          closeModal();
        }, 500);
      }
    } catch (error) {
      console.error('Error adding image:', error);
    } finally {
      setSubmitting(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const response = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchImages();
      }
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const openAddModal = () => {
    setFormData({
      title: '',
      imageUrl: '',
      category: '',
      description: '',
    });
    setSelectedFile(null);
    setPreviewImage(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({
      title: '',
      imageUrl: '',
      category: '',
      description: '',
    });
    setSelectedFile(null);
    setPreviewImage(null);
    setUploadProgress(0);
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const filteredImages = images.filter((image) => {
    const matchesSearch =
      image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' ||
      image.category?.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="admin-management">
      {/* Header */}
      <div className="admin-management-header">
        <div className="admin-management-header-left">
          {onBack && (
            <button onClick={onBack} className="admin-back-btn">
              <ArrowLeft />
            </button>
          )}
          <div className="gallery-header-icon">
            <ImageIcon />
          </div>
          <div>
            <h1 className="admin-management-title">Gallery</h1>
            <p className="admin-management-subtitle">Manage your images</p>
          </div>
        </div>
        <button onClick={openAddModal} className="admin-add-btn gallery-add-btn">
          <ImagePlus />
          Add Image
        </button>
      </div>

      {/* Stats */}
      {images.length > 0 && (
        <div className="gallery-stats">
          <span className="gallery-stats-badge">
            <Sparkles />
            {images.length} Image{images.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Filters */}
      <div className="gallery-filters-card">
        <div className="gallery-filters-inner">
          <div className="gallery-search-wrapper">
            <Search className="gallery-search-icon" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="gallery-search-input"
            />
          </div>
          <div className="gallery-category-filters">
            <Filter className="gallery-filter-icon" />
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`gallery-category-btn ${selectedCategory === category ? 'active' : ''}`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Images Grid */}
      {loading ? (
        <div className="admin-loading">
          <Loader2 className="admin-loading-icon gallery-loading" />
        </div>
      ) : filteredImages.length === 0 ? (
        <div className="admin-empty-state">
          <div className="gallery-empty-icon">
            <ImageIcon />
          </div>
          <h3 className="admin-empty-title">
            {searchTerm || selectedCategory !== 'all' ? 'No images found' : 'No images yet'}
          </h3>
          <p className="admin-empty-text">
            {searchTerm || selectedCategory !== 'all'
              ? 'Try adjusting your search or filter.'
              : 'Add your first image to get started.'}
          </p>
          {!searchTerm && selectedCategory === 'all' && (
            <button onClick={openAddModal} className="admin-add-btn gallery-add-btn" style={{ marginTop: '1.25rem' }}>
              <ImagePlus />
              Add Image
            </button>
          )}
        </div>
      ) : (
        <div className="gallery-grid">
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
            >
              <div className="gallery-card">
                <div
                  className="gallery-card-image-wrapper"
                  onClick={() => setFullScreenPreview(image.image_url)}
                >
                  <img
                    src={image.image_url}
                    alt={image.title}
                    className="gallery-card-image"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://via.placeholder.com/300?text=Error';
                    }}
                  />
                  <div className="gallery-card-overlay">
                    <ExternalLink />
                  </div>
                </div>
                <div className="gallery-card-content">
                  <h3 className="gallery-card-title">{image.title}</h3>
                  <div className="gallery-card-footer">
                    {image.category && (
                      <span className="gallery-category-tag">{image.category}</span>
                    )}
                    <button
                      className="gallery-delete-btn"
                      onClick={() => handleDelete(image.id)}
                    >
                      <Trash2 />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Image Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="admin-modal-overlay"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="admin-modal"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="admin-modal-header">
                <div className="admin-modal-title-wrapper">
                  <div className="admin-modal-icon">
                    <ImagePlus />
                  </div>
                  <h2 className="admin-modal-title">Add Image</h2>
                </div>
                <button onClick={closeModal} className="admin-modal-close">
                  <X />
                </button>
              </div>

              {/* Modal Body */}
              <div className="admin-modal-body gallery-modal-body">
                <form onSubmit={handleSubmit} className="admin-modal-form">

                  {/* Title */}
                  <div className="admin-form-field">
                    <label htmlFor="title" className="admin-form-label">Title *</label>
                    <input
                      id="title"
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter image title"
                      className="admin-form-input"
                      required
                    />
                  </div>

                  {/* Image Upload */}
                  <div className="admin-form-field">
                    <label className="admin-form-label">Image *</label>
                    
                    {!selectedFile && !previewImage ? (
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`gallery-dropzone ${isDragging ? 'dragging' : ''}`}
                      >
                        <Upload className={`gallery-dropzone-icon ${isDragging ? 'active' : ''}`} />
                        <p className="gallery-dropzone-text">Drop image here or click to browse</p>
                        <p className="gallery-dropzone-hint">PNG, JPG up to 5MB</p>
                      </div>
                    ) : (
                      <div className="gallery-preview-wrapper">
                        <div className="gallery-preview-container">
                          <img
                            src={previewImage || ''}
                            alt="Preview"
                            className="gallery-preview-image"
                          />
                          <div className="gallery-preview-overlay">
                            <button
                              type="button"
                              onClick={clearSelectedFile}
                              className="gallery-change-btn"
                            >
                              <X />
                              Change Image
                            </button>
                          </div>
                        </div>
                        {selectedFile && (
                          <div className="gallery-file-info">
                            <CheckCircle2 className="gallery-file-check" />
                            <span className="gallery-file-name">{selectedFile.name}</span>
                            <span className="gallery-file-size">
                              {(selectedFile.size / 1024).toFixed(1)} KB
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileSelect(file);
                      }}
                      style={{ display: 'none' }}
                    />
                  </div>

                  {/* OR URL */}
                  {!selectedFile && (
                    <>
                      <div className="gallery-divider">
                        <span className="gallery-divider-line"></span>
                        <span className="gallery-divider-text">or paste URL</span>
                        <span className="gallery-divider-line"></span>
                      </div>

                      <input
                        type="url"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                        className="admin-form-input"
                      />
                    </>
                  )}

                  {/* Category */}
                  <div className="admin-form-field">
                    <label htmlFor="category" className="admin-form-label">Category</label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="admin-form-select"
                    >
                      <option value="">Select category</option>
                      {categories.filter(c => c !== 'all').map(cat => (
                        <option key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>


                  {/* Upload Progress */}
                  {submitting && uploadProgress > 0 && (
                    <div className="gallery-progress">
                      <div className="gallery-progress-header">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="gallery-progress-bar">
                        <motion.div
                          className="gallery-progress-fill"
                          initial={{ width: 0 }}
                          animate={{ width: `${uploadProgress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>
                  )}
                </form>
              </div>

              {/* Modal Footer */}
              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-modal-cancel-btn"
                  onClick={closeModal}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="admin-modal-submit-btn gallery-submit-btn"
                  disabled={submitting || (!selectedFile && !formData.imageUrl) || !formData.title}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="admin-modal-submit-spinner" />
                      Uploading
                    </>
                  ) : (
                    'Add Image'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Screen Image Preview Modal */}
      <AnimatePresence>
        {fullScreenPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setFullScreenPreview(null)}
            className="gallery-fullscreen-overlay"
          >
            <button
              className="gallery-fullscreen-close"
              onClick={(e) => {
                e.stopPropagation();
                setFullScreenPreview(null);
              }}
            >
              <X />
            </button>
            <div className="gallery-fullscreen-content">
              <img
                src={fullScreenPreview}
                alt="Preview"
                className="gallery-fullscreen-image"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
