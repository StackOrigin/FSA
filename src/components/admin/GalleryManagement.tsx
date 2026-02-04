import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
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

interface GalleryManagementProps {
  onBack?: () => void;
}

export function GalleryManagement({ onBack }: GalleryManagementProps) {
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

  const categories = ['all', 'academics', 'facilities', 'arts', 'sports', 'events', 'campus'];

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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
          <div className="p-2.5 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl shadow-lg">
            <ImageIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Gallery
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage your images
            </p>
          </div>
        </div>
        <Button
          onClick={openAddModal}
          className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-xl h-10 px-4 shadow-md"
        >
          <ImagePlus className="w-4 h-4 mr-2" />
          Add Image
        </Button>
      </div>

      {/* Stats */}
      {images.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300 rounded-full text-sm font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            {images.length} Image{images.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Filters */}
      <Card className="p-3 rounded-xl border-0 shadow-sm bg-white dark:bg-gray-800">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex-1 w-full sm:max-w-xs">
            <div className="flex items-center h-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 px-3 gap-2 focus-within:ring-2 focus-within:ring-pink-500 focus-within:border-pink-500 focus-within:bg-white">
              <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 h-full bg-transparent outline-none text-sm text-gray-900 dark:text-white placeholder:text-gray-400"
              />
            </div>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-lg text-xs h-8 px-3 flex-shrink-0 ${
                  selectedCategory === category
                    ? 'bg-pink-500 hover:bg-pink-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Images Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
        </div>
      ) : filteredImages.length === 0 ? (
        <Card className="p-10 text-center rounded-xl border-0 shadow-sm bg-white dark:bg-gray-800">
          <div className="w-14 h-14 bg-pink-50 dark:bg-pink-900/20 rounded-xl flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-7 h-7 text-pink-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {searchTerm || selectedCategory !== 'all' ? 'No images found' : 'No images yet'}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 max-w-xs mx-auto">
            {searchTerm || selectedCategory !== 'all'
              ? 'Try adjusting your search or filter.'
              : 'Add your first image to get started.'}
          </p>
          {!searchTerm && selectedCategory === 'all' && (
            <Button
              onClick={openAddModal}
              className="bg-pink-500 hover:bg-pink-600 text-white rounded-xl"
            >
              <ImagePlus className="w-4 h-4 mr-2" />
              Add Image
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
            >
              <Card className="overflow-hidden group hover:shadow-lg transition-all rounded-xl border-0 shadow-sm bg-white dark:bg-gray-800">
                <div
                  className="aspect-square relative cursor-pointer overflow-hidden"
                  onClick={() => setFullScreenPreview(image.image_url)}
                >
                  <img
                    src={image.image_url}
                    alt={image.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://via.placeholder.com/300?text=Error';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ExternalLink className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm text-gray-900 dark:text-white truncate">
                    {image.title}
                  </h3>
                  <div className="mt-2 flex items-center justify-between">
                    {image.category && (
                      <span className="text-xs text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/20 px-2 py-0.5 rounded-full">
                        {image.category}
                      </span>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg ml-auto"
                      onClick={() => handleDelete(image.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </Card>
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col"
              style={{ backgroundColor: '#ffffff', maxHeight: '85vh' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0" style={{ backgroundColor: '#ffffff' }}>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500">
                    <ImagePlus className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Add Image
                  </h2>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={closeModal}
                  className="rounded-lg h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Modal Body */}
              <div 
                className="overflow-y-auto flex-1 min-h-0" 
                style={{ 
                  backgroundColor: '#ffffff',
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#e5e7eb #f9fafb'
                }}
              >
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                {/* Title */}
                <div>
                  <Label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Title *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="mt-1.5 h-10 rounded-lg"
                    placeholder="Image title"
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Image *
                  </Label>
                  
                  {!selectedFile && !previewImage ? (
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`mt-1.5 border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                        isDragging
                          ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-pink-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      <Upload className={`w-8 h-8 mx-auto mb-2 ${isDragging ? 'text-pink-500' : 'text-gray-400'}`} />
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Drop image here or click to browse
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG up to 5MB
                      </p>
                    </div>
                  ) : (
                    <div className="mt-1.5 space-y-2">
                      <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                        <div className="w-full" style={{ maxHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '150px' }}>
                          <img
                            src={previewImage || ''}
                            alt="Preview"
                            className="w-full object-contain"
                            style={{ maxHeight: '200px' }}
                          />
                        </div>
                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            onClick={clearSelectedFile}
                            className="rounded-lg bg-white hover:bg-gray-100 text-gray-900"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Change Image
                          </Button>
                        </div>
                      </div>
                      {selectedFile && (
                        <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                          <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                          <span className="text-sm text-green-700 dark:text-green-300 truncate">{selectedFile.name}</span>
                          <span className="text-xs text-green-600 dark:text-green-400 ml-auto flex-shrink-0">
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
                    className="hidden"
                  />
                </div>

                {/* OR URL */}
                {!selectedFile && (
                  <>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-200 dark:border-gray-700" />
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-white dark:bg-gray-800 px-3 text-xs text-gray-400">
                          or paste URL
                        </span>
                      </div>
                    </div>

                    <Input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      className="h-10 rounded-lg"
                    />
                  </>
                )}

                {/* Category */}
                <div>
                  <Label htmlFor="category" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Category
                  </Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full mt-1.5 h-10 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="">Select category</option>
                    <option value="academics">Academics</option>
                    <option value="facilities">Facilities</option>
                    <option value="arts">Arts</option>
                    <option value="sports">Sports</option>
                    <option value="events">Events</option>
                    <option value="campus">Campus</option>
                  </select>
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={2}
                    className="mt-1.5 rounded-lg resize-none text-sm"
                    placeholder="Optional description..."
                  />
                </div>

                {/* Upload Progress */}
                {submitting && uploadProgress > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-pink-500 to-rose-500"
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
              <div className="flex gap-3 p-4 border-t border-gray-100 flex-shrink-0" style={{ backgroundColor: '#f9fafb' }}>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-10 rounded-lg"
                  onClick={closeModal}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  className="flex-1 h-10 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white"
                  disabled={submitting || (!selectedFile && !formData.imageUrl) || !formData.title}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading
                    </>
                  ) : (
                    'Add Image'
                  )}
                </Button>
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
            className="fixed inset-0 bg-black z-[9999] flex items-center justify-center p-4 cursor-pointer"
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/10 rounded-xl z-10"
              onClick={(e) => {
                e.stopPropagation();
                setFullScreenPreview(null);
              }}
            >
              <X className="w-5 h-5" />
            </Button>
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={fullScreenPreview}
                alt="Preview"
                className="max-w-full max-h-full object-contain rounded-lg"
                style={{ maxWidth: '90vw', maxHeight: '90vh' }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
