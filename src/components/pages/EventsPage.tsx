import { motion, AnimatePresence } from 'motion/react';
import { Calendar, MapPin, Clock, ChevronLeft, ChevronRight, Tag, Loader2, Newspaper } from 'lucide-react';
import { useEffect, useState } from 'react';
import '../../styles/pages/EventsPage.css';

type FeaturedEvent = {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string | null;
  category: string;
  gradient: string;
};

type UpcomingEvent = {
  date: string;
  title: string;
  time: string;
  location: string;
  category: string;
};

type NewsItem = {
  date: string;
  title: string;
  excerpt: string;
  image: string;
};

export function EventsPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [featuredEvents, setFeaturedEvents] = useState<FeaturedEvent[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);

  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingUpcoming, setLoadingUpcoming] = useState(true);
  const [loadingNews, setLoadingNews] = useState(true);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const res = await fetch('/api/events?featured=true');
        const data = await res.json();

        const mapped: FeaturedEvent[] = Array.isArray(data)
          ? data.map((e: any) => {
              const rawDate = String(e.event_date ?? '');
              const parsed = rawDate.includes('T') ? new Date(rawDate) : new Date(`${rawDate}T00:00:00`);
              const longDate = isNaN(parsed.getTime())
                ? rawDate
                : parsed.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

              return {
                title: String(e.title ?? 'Untitled Event'),
                date: longDate,
                time: String(e.event_time ?? 'TBA'),
                location: String(e.location ?? 'TBA'),
                description: String(e.description ?? ''),
                image: e.image_url ? String(e.image_url) : null,
                category: String(e.category ?? 'Community'),
                gradient: String(e.gradient ?? 'from-blue-500 to-purple-600'),
              };
            })
          : [];

        setFeaturedEvents(mapped);
        setCurrentSlide(0);
      } catch (err) {
        console.error('Failed to load featured events', err);
        setFeaturedEvents([]);
      } finally {
        setLoadingFeatured(false);
      }
    };

    const loadUpcoming = async () => {
      try {
        const res = await fetch('/api/events');
        const data = await res.json();

        const mapped: UpcomingEvent[] = Array.isArray(data)
          ? data.map((e: any) => {
              const rawDate = String(e.event_date ?? '');
              const parsed = rawDate.includes('T') ? new Date(rawDate) : new Date(`${rawDate}T00:00:00`);
              const shortDate = isNaN(parsed.getTime())
                ? rawDate
                : parsed.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

              return {
                date: shortDate,
                title: String(e.title ?? 'Untitled Event'),
                time: String(e.event_time ?? 'TBA'),
                location: String(e.location ?? 'TBA'),
                category: String(e.category ?? 'Community'),
              };
            })
          : [];

        setUpcomingEvents(mapped);
      } catch (err) {
        console.error('Failed to load events from API', err);
        setUpcomingEvents([]);
      } finally {
        setLoadingUpcoming(false);
      }
    };

    const loadNews = async () => {
      try {
        const res = await fetch('/api/content/events_news');
        const data = await res.json();
        setNewsItems(Array.isArray(data?.newsItems) ? data.newsItems : []);
      } catch (err) {
        console.error('Failed to load events news content', err);
        setNewsItems([]);
      } finally {
        setLoadingNews(false);
      }
    };

    loadFeatured();
    loadUpcoming();
    loadNews();
  }, []);

  const categories = ['all', ...Array.from(new Set(upcomingEvents.map((e) => e.category).filter(Boolean)))];

  const filteredEvents = selectedCategory === 'all' 
    ? upcomingEvents 
    : upcomingEvents.filter(event => event.category === selectedCategory);

  const nextSlide = () => {
    if (featuredEvents.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % featuredEvents.length);
  };

  const prevSlide = () => {
    if (featuredEvents.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + featuredEvents.length) % featuredEvents.length);
  };

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="events-hero">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="events-hero-content"
        >
          <h1 className="events-hero-title">
            Events & News
          </h1>
          <p className="events-hero-description">
            Stay connected with what's happening at FutureSchool. From academic showcases to community celebrations, there's always something exciting going on!
          </p>
        </motion.div>
      </section>

      {/* Featured Events Carousel */}
      <section className="events-featured-section">
        <div className="events-featured-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="events-featured-header"
          >
            <h2 className="events-featured-title">Featured Events</h2>
            <p className="events-featured-subtitle">Don't miss these upcoming highlights</p>
          </motion.div>

          <div className="events-carousel-wrapper">
            {loadingFeatured ? (
              <div className="events-loading">
                <Loader2 className="events-loading-icon" />
              </div>
            ) : featuredEvents.length === 0 ? (
              <div className="events-empty-card">
                <Calendar className="events-empty-icon" />
                <p className="events-empty-text">No featured events yet. Mark events as featured in the admin panel.</p>
              </div>
            ) : (
              <>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="events-carousel-card">
                      <div className="events-carousel-grid">
                        <div className="events-carousel-image-wrapper">
                          <div 
                            className="events-carousel-gradient"
                            style={{ background: `linear-gradient(to bottom right, ${featuredEvents[currentSlide].gradient.replace('from-', '').replace(' to-', ', ')})` }}
                          />
                          {featuredEvents[currentSlide].image ? (
                            <img
                              src={featuredEvents[currentSlide].image ?? ''}
                              alt={featuredEvents[currentSlide].title}
                              className="events-carousel-image"
                            />
                          ) : (
                            <div className="events-carousel-placeholder">
                              <Calendar className="events-carousel-placeholder-icon" />
                            </div>
                          )}
                          <div 
                            className="events-carousel-badge"
                            style={{ background: `linear-gradient(to right, ${featuredEvents[currentSlide].gradient.replace('from-', '').replace(' to-', ', ')})` }}
                          >
                            {featuredEvents[currentSlide].category}
                          </div>
                        </div>
                        <div className="events-carousel-content">
                          <h3 className="events-carousel-title">{featuredEvents[currentSlide].title}</h3>
                          <div className="events-carousel-details">
                            <div className="events-carousel-detail">
                              <Calendar className="events-carousel-detail-icon" />
                              <span>{featuredEvents[currentSlide].date}</span>
                            </div>
                            <div className="events-carousel-detail">
                              <Clock className="events-carousel-detail-icon" />
                              <span>{featuredEvents[currentSlide].time}</span>
                            </div>
                            <div className="events-carousel-detail">
                              <MapPin className="events-carousel-detail-icon" />
                              <span>{featuredEvents[currentSlide].location}</span>
                            </div>
                          </div>
                          <p className="events-carousel-description">{featuredEvents[currentSlide].description}</p>
                          <button className="events-carousel-btn">
                            Learn More
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Carousel Controls */}
                <div className="events-carousel-controls">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={prevSlide}
                    className="events-carousel-nav-btn"
                  >
                    <ChevronLeft className="events-carousel-nav-icon" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={nextSlide}
                    className="events-carousel-nav-btn"
                  >
                    <ChevronRight className="events-carousel-nav-icon" />
                  </motion.button>
                </div>

                {/* Carousel Indicators */}
                <div className="events-carousel-indicators">
                  {featuredEvents.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`events-carousel-indicator ${index === currentSlide ? 'active' : ''}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="events-upcoming-section">
        <div className="events-upcoming-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="events-upcoming-header"
          >
            <h2 className="events-upcoming-title">Upcoming Events</h2>
            <p className="events-upcoming-subtitle">Filter by category</p>
            
            {/* Category Filter */}
            <div className="events-filter-buttons">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`events-filter-btn ${selectedCategory === category ? 'active' : ''}`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </motion.button>
              ))}
            </div>
          </motion.div>

          <div className="events-grid">
            {loadingUpcoming ? (
              <div className="events-grid-loading">
                <Loader2 className="events-grid-loading-icon" />
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="events-grid-empty">
                <div className="events-empty-card">
                  <Calendar className="events-empty-icon" />
                  <p className="events-empty-text">No upcoming events yet.</p>
                </div>
              </div>
            ) : (
              <AnimatePresence mode="popLayout">
                {filteredEvents.map((event) => (
                  <motion.div
                    key={event.title}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="events-card">
                      <div className="events-card-content">
                        <div className="events-card-date-wrapper">
                          <div className="events-card-date-badge">
                            <div className="events-card-date-number">{String(event.date).split(' ')[1] ?? ''}</div>
                          </div>
                          <div className="events-card-date-month">{String(event.date).split(' ')[0] ?? ''}</div>
                        </div>
                        <div className="events-card-info">
                          <div className="events-card-category">
                            <Tag className="events-card-category-icon" />
                            <span className="events-card-category-text">{event.category}</span>
                          </div>
                          <h3 className="events-card-title">{event.title}</h3>
                          <div className="events-card-details">
                            <div className="events-card-detail">
                              <Clock className="events-card-detail-icon" />
                              <span>{event.time}</span>
                            </div>
                            <div className="events-card-detail">
                              <MapPin className="events-card-detail-icon" />
                              <span>{event.location}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
