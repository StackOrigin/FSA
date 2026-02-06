import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { Download, Calendar, Tag, Search, Filter, Bell, Loader2 } from 'lucide-react';
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

  return (
    <div className="notice-page">

      {/* Filter and Search Section */}
      <section className="notice-filter-section">
        <div className="notice-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="notice-filter-wrapper"
          >
            {/* Search Bar */}
            <div className="notice-search-bar">
              <Search className="notice-search-icon" size={20} />
              <input
                type="text"
                placeholder="Search notices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="notice-search-input"
              />
            </div>

            {/* Category Filter */}
            <div className="notice-category-filter">
              <Filter size={20} className="notice-filter-icon" />
              <div className="notice-category-buttons">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`notice-category-btn ${selectedCategory === category ? 'active' : ''}`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
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
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className={`notice-card ${getPriorityColor(notice.priority)}`}
                  >
                    {notice.image_url && (
                      <div className="notice-card-image">
                        <img src={notice.image_url} alt={notice.title} />
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
                        
                        {(notice.download_url || notice.image_url) && (
                          <a 
                            href={notice.download_url || notice.image_url}
                            target="_blank"
                            rel="noopener noreferrer" 
                            className="notice-download-btn"
                            download
                          >
                            <Download size={18} />
                            <span>Download</span>
                          </a>
                        )}
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

      {/* Important Notice Banner */}
      <section className="notice-banner-section">
        <div className="notice-container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="notice-important-banner"
          >
            <div className="notice-banner-icon">
              <Bell size={32} />
            </div>
            <div className="notice-banner-content">
              <h3>Stay Connected</h3>
              <p>Subscribe to receive instant notifications for important updates and announcements</p>
            </div>
            <button className="notice-banner-btn">Subscribe Now</button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
