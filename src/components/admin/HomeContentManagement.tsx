import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Save,
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

const gradientOptions = [
  { value: 'from-blue-500 to-cyan-500', label: 'Blue to Cyan' },
  { value: 'from-purple-500 to-pink-500', label: 'Purple to Pink' },
  { value: 'from-orange-500 to-red-500', label: 'Orange to Red' },
  { value: 'from-green-500 to-emerald-500', label: 'Green to Emerald' },
  { value: 'from-indigo-500 to-violet-500', label: 'Indigo to Violet' },
  { value: 'from-teal-500 to-cyan-500', label: 'Teal to Cyan' },
];

interface HomeContentManagementProps {
  onBack: () => void;
}

export function HomeContentManagement({ onBack }: HomeContentManagementProps) {
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
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-500">Loading content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
            <Layout className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Home Page Content
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-0.5">
              Manage the "Why Choose Us" section features
            </p>
          </div>
        </div>
        <Button
          onClick={openAddFeatureModal}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl h-11 px-5 shadow-md hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Feature
        </Button>
      </div>

      {/* Features Count Badge */}
      {homeContent && homeContent.features.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            {homeContent.features.length} Feature{homeContent.features.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Features List */}
      <div className="grid gap-4">
        {homeContent?.features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="p-5 rounded-xl border-0 shadow-md hover:shadow-lg transition-all bg-white dark:bg-gray-800">
              <div className="flex items-start gap-4">
                {/* Order Controls */}
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xs font-medium text-gray-400 mb-1">#{index + 1}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => moveFeature(index, 'up')}
                    disabled={index === 0 || saving}
                    className="h-8 w-8 p-0 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => moveFeature(index, 'down')}
                    disabled={index === homeContent!.features.length - 1 || saving}
                    className="h-8 w-8 p-0 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </div>

                {/* Image Preview */}
                <div className="relative w-36 h-28 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-20`}
                  />
                  {feature.image ? (
                    <img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                      <ImageIcon className="w-10 h-10 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 py-1">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white truncate">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1.5 leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r ${feature.gradient} text-white shadow-sm`}
                    >
                      <span className="w-2 h-2 bg-white/40 rounded-full" />
                      {gradientOptions.find((g) => g.value === feature.gradient)?.label ||
                        'Custom'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditFeatureModal(index)}
                    disabled={saving}
                    className="rounded-xl h-10 w-10 p-0 border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
                  >
                    <Pencil className="w-4 h-4 text-gray-600" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteFeature(index)}
                    disabled={saving}
                    className="rounded-xl h-10 w-10 p-0 border-gray-200 hover:border-red-300 hover:bg-red-50 text-red-600 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}

        {homeContent?.features.length === 0 && (
          <Card className="p-12 text-center rounded-xl border-0 shadow-md bg-white dark:bg-gray-800">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Layout className="w-8 h-8 text-purple-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No features yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
              Add features to showcase in the "Why Choose Us" section of your homepage.
            </p>
            <Button
              onClick={openAddFeatureModal}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl px-6"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Feature
            </Button>
          </Card>
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
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={closeFeatureModal}
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-2 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-xs max-h-[70vh] overflow-y-auto rounded-lg shadow-2xl pointer-events-auto"
                style={{ backgroundColor: 'white' }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-2.5 bg-white dark:bg-gray-800 rounded-lg">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-sm font-bold text-gray-900 dark:text-white">
                      {editingIndex !== null ? 'Edit Feature' : 'Add Feature'}
                    </h2>
                    <button 
                      type="button"
                      onClick={closeFeatureModal}
                      className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={handleFeatureSubmit} className="space-y-1.5">
                    <div>
                      <Label htmlFor="title" className="text-[11px] font-medium text-gray-700 dark:text-gray-300">Title</Label>
                      <Input
                        id="title"
                        value={featureForm.title}
                        onChange={(e) =>
                          setFeatureForm({ ...featureForm, title: e.target.value })
                        }
                        placeholder="e.g., Modern Curriculum"
                        required
                        className="mt-0.5 h-7 rounded text-xs px-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description" className="text-[11px] font-medium text-gray-700 dark:text-gray-300">Description</Label>
                      <Textarea
                        id="description"
                        value={featureForm.description}
                        onChange={(e) =>
                          setFeatureForm({ ...featureForm, description: e.target.value })
                        }
                        placeholder="Describe this feature..."
                        rows={2}
                        required
                        className="mt-0.5 rounded text-[11px] px-2 py-1 resize-none"
                      />
                    </div>

                    <div>
                      <Label htmlFor="image" className="text-[11px] font-medium text-gray-700 dark:text-gray-300">Image</Label>
                      <input
                        ref={fileInputRef}
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <div className="mt-0.5">
                        {(imagePreview || featureForm.image) ? (
                          <div className="relative w-full h-16 rounded overflow-hidden border border-gray-200 dark:border-gray-700 group">
                            <img
                              src={imagePreview || featureForm.image}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                                className="bg-white text-gray-900 hover:bg-gray-100 rounded h-6 px-2 text-[10px] flex items-center"
                              >
                                {uploading ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Upload className="w-3 h-3" />
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setImagePreview(null);
                                  setFeatureForm({ ...featureForm, image: '' });
                                  if (fileInputRef.current) fileInputRef.current.value = '';
                                }}
                                className="bg-red-500 text-white hover:bg-red-600 rounded h-6 px-2 text-[10px]"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                            {uploading && (
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <Loader2 className="w-4 h-4 animate-spin text-white" />
                              </div>
                            )}
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="w-full h-16 rounded border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-purple-400 transition-colors flex items-center justify-center gap-2 bg-gray-50 dark:bg-gray-800/50"
                          >
                            {uploading ? (
                              <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
                            ) : (
                              <>
                                <Upload className="w-4 h-4 text-purple-500" />
                                <span className="text-[10px] text-gray-500">Upload image</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="gradient" className="text-[11px] font-medium text-gray-700 dark:text-gray-300">Color</Label>
                      <select
                        id="gradient"
                        value={featureForm.gradient}
                        onChange={(e) =>
                          setFeatureForm({ ...featureForm, gradient: e.target.value })
                        }
                        className="w-full mt-0.5 px-2 py-1 text-[11px] border border-gray-200 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
                      >
                        {gradientOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      <div
                        className={`mt-0.5 h-2 rounded bg-gradient-to-r ${featureForm.gradient}`}
                      />
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={closeFeatureModal}
                        className="flex-1 h-7 rounded border border-gray-200 hover:bg-gray-50 text-[11px]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={saving || uploading || !featureForm.image}
                        className="flex-1 h-7 rounded bg-purple-600 hover:bg-purple-700 text-white text-[11px] disabled:opacity-50 flex items-center justify-center"
                      >
                        {saving ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          editingIndex !== null ? 'Update' : 'Add'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
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
            className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3"
          >
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="font-medium">Saving changes...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
