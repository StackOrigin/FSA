import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Download, Calendar, Tag, Search, Filter, Bell, Loader2 } from 'lucide-react';
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
      <div className="notice-text">Notice</div>
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
                        <img src={notice.image_url} alt={notice.title} crossOrigin="anonymous" />
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

    </div>
  );
}
