import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { Download, Calendar, Tag, Search, Filter, Bell, Loader2, X } from 'lucide-react';
import { toPng } from 'html-to-image';
import { toast } from 'sonner';
import { Toaster } from '../ui/sonner';
import '../../styles/pages/NoticePage.css';

interface Notice {
  id: number;
  title: string;
  description: string;
  created_at: string;
  category: 'Academic' | 'Administrative' | 'Event' | 'Exam' | 'Holiday' | 'General';
  priority: 'high' | 'medium' | 'low';
  image_url?: string;
  download_url?: string;
}

export function NoticePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/notices');
      if (!response.ok) throw new Error('Failed to fetch notices');
      const data = await response.json();
      setNotices(data);
    } catch (error) {
      console.error('Error fetching notices:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', 'Academic', 'Administrative', 'Event', 'Exam', 'Holiday', 'General'];

  const filteredNotices = notices.filter(notice => {
    const matchesCategory = selectedCategory === 'all' || notice.category === selectedCategory;
    const matchesSearch = notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notice.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleDownloadNotice = async (e: React.MouseEvent, noticeId: number, noticeTitle: string) => {
    e.preventDefault();
    e.stopPropagation();

    if (downloadingId) return;

    const element = document.getElementById(`notice-card-${noticeId}`);
    if (!element) {
      toast.error("Notice element not found");
      return;
    }

    try {
      setDownloadingId(noticeId);
      toast.info("Preparing download...");
      
      // Small delay to allow toast to render and UI to update
      await new Promise(resolve => setTimeout(resolve, 100));

      const dataUrl = await toPng(element, {
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        filter: (node) => {
          // Filter out the download button from the image
          if (node instanceof HTMLElement && node.classList.contains('notice-download-btn')) {
            return false;
          }
          return true;
        }
      });
      
      const link = document.createElement('a');
      link.download = `${noticeTitle.replace(/\s+/g, '-').toLowerCase()}-notice.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Notice downloaded successfully");
    } catch (error: any) {
      console.error('Error generating notice image:', error);
      toast.error(`Failed to generate: ${error?.message || 'Unknown error'}`);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="notice-page">
      <Toaster />

      {/* Hero */}
      <section className="notice-hero">
        <div className="notice-hero-content">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="notice-hero-icon"
          >
            <Bell size={32} />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="notice-hero-title"
          >
            Notice Board
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="notice-hero-description"
          >
            Stay up-to-date with the latest announcements, events, and important updates from our school.
          </motion.p>
        </div>
      </section>

      {/* Notices Grid */}
      <section className="notice-grid-section">
        <div className="notice-container">
          {loading ? (
            <div className="notice-loading">
              <Loader2 className="notice-spinner" size={48} />
              <p>Loading notices...</p>
            </div>
          ) : (
            <>
              <div className="notice-grid">
                {filteredNotices.map((notice, index) => (
                  <motion.div
                    key={notice.id}
                    id={`notice-card-${notice.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`notice-card ${getPriorityColor(notice.priority)}`}
                  >
                    {notice.image_url && (
                      <div className="notice-card-image">
                        <img 
                          src={notice.image_url} 
                          alt={notice.title} 
                          crossOrigin="anonymous" 
                          onClick={() => setSelectedImage(notice.image_url || null)}
                          style={{ cursor: 'pointer' }}
                        />
                      </div>
                    )}
                    
                    <div className="notice-card-content">
                      <div className="notice-card-header">
                        <span className={`notice-priority-badge ${notice.priority}`}>
                          {notice.priority === 'high' ? 'Urgent' : notice.priority}
                        </span>
                        <span className="notice-category-badge">
                          <Tag size={14} />
                          {notice.category}
                        </span>
                      </div>

                      <h3 className="notice-card-title">{notice.title}</h3>
                      <p className="notice-card-description">{notice.description}</p>

                      <div className="notice-card-footer">
                        <div className="notice-date">
                          <Calendar size={16} />
                          <span>{formatDate(notice.created_at)}</span>
                        </div>
                        
                        <button 
                          className="notice-download-btn"
                          type="button"
                          disabled={downloadingId === notice.id}
                          onClick={(e) => handleDownloadNotice(e, notice.id, notice.title)}
                        >
                          {downloadingId === notice.id ? (
                            <Loader2 size={18} className="animate-spin" />
                          ) : (
                            <Download size={18} />
                          )}
                          <span>{downloadingId === notice.id ? 'Saving...' : 'Download'}</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {filteredNotices.length === 0 && !loading && (
                <div className="notice-empty-state">
                  <Bell size={64} />
                  <h3>No notices found</h3>
                  <p>Try adjusting your search or filter criteria</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Image Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          >
            {/* Close Button */}
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute right-4 top-4 p-2 text-white hover:text-white transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            {/* The Large Image Container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-[90vw] max-h-[85vh] w-full h-full bg-white rounded-2xl shadow-2xl overflow-hidden border-8 border-gray-100"
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: 'min(90vw, 1200px)', maxHeight: 'min(85vh, 800px)' }}
            >
              {/* Frame Inner Container */}
              <div className="w-full h-full p-4 flex items-center justify-center bg-gray-50" style={{ minHeight: '300px', minWidth: '400px' }}>
                <img
                  src={selectedImage}
                  alt="Enlarged notice"
                  className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                  style={{ maxWidth: '100%', maxHeight: '100%' }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
