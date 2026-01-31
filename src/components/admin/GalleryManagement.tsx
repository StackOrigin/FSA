import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import {
  Plus,
  Trash2,
  Image as ImageIcon,
  X,
  Search,
  Loader2,
  ExternalLink,
  ImagePlus,
  Filter,
  Sparkles,
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

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

      const response = await fetch('/api/gallery', {
        method: 'POST',
        body: submitData,
      });

      if (response.ok) {
        fetchImages();
        closeModal();
      }
    } catch (error) {
      console.error('Error adding image:', error);
    } finally {
      setSubmitting(false);
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
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl shadow-lg">
            <ImageIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Gallery Management
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-0.5">
              Manage gallery images for the website
            </p>
          </div>
        </div>
        <Button
          onClick={openAddModal}
          className="!bg-black hover:!bg-gray-800 !text-white rounded-xl h-11 px-5 shadow-md hover:shadow-lg transition-all"
        >
          <ImagePlus className="w-5 h-5 mr-2" />
          Add Image
        </Button>
      </div>

      {/* Stats Badge */}
      {images.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-pink-50 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300 rounded-full text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            {images.length} Image{images.length !== 1 ? 's' : ''} in Gallery
          </span>
        </div>
      )}

      {/* Filters */}
      <Card className="p-4 rounded-xl border-0 shadow-md bg-white dark:bg-gray-800">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 h-11 rounded-xl border-gray-200 focus:border-pink-500 focus:ring-pink-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400 mr-1" />
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-xl transition-all ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-pink-600 to-rose-600 border-0 shadow-md'
                      : 'border-gray-200 hover:border-pink-300 hover:bg-pink-50'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Images Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <Loader2 className="w-10 h-10 animate-spin text-pink-500 mx-auto mb-4" />
            <p className="text-gray-500">Loading gallery...</p>
          </div>
        </div>
      ) : filteredImages.length === 0 ? (
        <Card className="p-12 text-center rounded-xl border-0 shadow-md bg-white dark:bg-gray-800">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/30 dark:to-rose-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ImageIcon className="w-8 h-8 text-pink-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {searchTerm || selectedCategory !== 'all' ? 'No images found' : 'No images yet'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
            {searchTerm || selectedCategory !== 'all'
              ? 'Try adjusting your search or filter to find what you\'re looking for.'
              : 'Start building your gallery by adding your first image.'}
          </p>
          {!searchTerm && selectedCategory === 'all' && (
            <Button
              onClick={openAddModal}
              className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white rounded-xl px-6"
            >
              <ImagePlus className="w-4 h-4 mr-2" />
              Add Your First Image
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
            >
              <Card className="overflow-hidden group hover:shadow-xl transition-all rounded-xl border-0 shadow-md bg-white dark:bg-gray-800">
                <div
                  className="aspect-video relative cursor-pointer overflow-hidden"
                  onClick={() => setPreviewImage(image.image_url)}
                >
                  <img
                    src={image.image_url}
                    alt={image.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://via.placeholder.com/400x300?text=Image+Not+Found';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                    <span className="flex items-center gap-2 text-white text-sm font-medium">
                      <ExternalLink className="w-4 h-4" />
                      View Full Size
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                    {image.title}
                  </h3>
                  {image.description && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
                      {image.description}
                    </p>
                  )}
                  <div className="mt-3 flex items-center justify-between">
                    {image.category && (
                      <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 text-pink-600 dark:text-pink-400 border border-pink-200 dark:border-pink-800">
                        {image.category}
                      </span>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl h-9 w-9 p-0 border-gray-200 hover:border-red-300 hover:bg-red-50 text-red-500 transition-all ml-auto"
                      onClick={() => handleDelete(image.id)}
                    >
                      <Trash2 className="w-4 h-4" />
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
              style={{ backgroundColor: 'white' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500">
                    <ImagePlus className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Add New Image
                    </h2>
                    <p className="text-sm text-gray-500">Upload to your gallery</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={closeModal}
                  className="rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label htmlFor="title" className="text-sm font-medium text-gray-700 dark:text-gray-300">Image Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                    className="mt-1.5 h-12 rounded-xl border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                    placeholder="Give your image a title"
                  />
                </div>

                <div>
                  <Label htmlFor="imageFile" className="text-sm font-medium text-gray-700 dark:text-gray-300">Upload Image</Label>
                  <div className="mt-1.5">
                    <Input
                      id="imageFile"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setSelectedFile(file);
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setPreviewImage(reader.result as string);
                          };
                          reader.readAsDataURL(file);
                          setFormData({ ...formData, imageUrl: '' });
                        }
                      }}
                      className="cursor-pointer h-12 rounded-xl border-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-pink-50 file:text-pink-700 file:font-medium hover:file:bg-pink-100"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5">
                    Upload an image from your computer (max 5MB)
                  </p>
                  {previewImage && (
                    <div className="mt-3 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-full h-36 object-cover"
                      />
                    </div>
                  )}
                </div>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white dark:bg-gray-800 px-3 text-gray-400 font-medium">
                      Or provide a URL
                    </span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="imageUrl" className="text-sm font-medium text-gray-700 dark:text-gray-300">Image URL</Label>
                  <Input
                    id="imageUrl"
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => {
                      setFormData({ ...formData, imageUrl: e.target.value });
                      if (e.target.value) {
                        setSelectedFile(null);
                        setPreviewImage(null);
                      }
                    }}
                    placeholder="https://example.com/image.jpg"
                    disabled={!!selectedFile}
                    className="mt-1.5 h-12 rounded-xl border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                  />
                  {formData.imageUrl && !selectedFile && (
                    <div className="mt-3 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="w-full h-36 object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="category" className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full mt-1.5 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select a category</option>
                    <option value="academics">Academics</option>
                    <option value="facilities">Facilities</option>
                    <option value="arts">Arts</option>
                    <option value="sports">Sports</option>
                    <option value="events">Events</option>
                    <option value="campus">Campus</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                    className="mt-1.5 rounded-xl border-gray-200 focus:border-pink-500 focus:ring-pink-500 resize-none"
                    placeholder="Add a description for this image..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 h-12 rounded-xl border-gray-200 hover:bg-gray-50"
                    onClick={closeModal}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-12 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white shadow-md hover:shadow-lg transition-all"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Image
                      </>
                    )}
                  </Button>
                </div>
              </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {previewImage && !showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4"
            onClick={() => setPreviewImage(null)}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-6 right-6 text-white hover:bg-white/10 rounded-xl h-12 w-12"
              onClick={() => setPreviewImage(null)}
            >
              <X className="w-6 h-6" />
            </Button>
            <motion.img
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
