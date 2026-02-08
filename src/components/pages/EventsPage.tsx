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
  gradient: string;
  
};

type UpcomingEvent = {
  date: string;
  title: string;
  time: string;
  location: string;
  description: string;
  image: string | null;
  month: string;
  parsedDate: Date;
};

type NewsItem = {
  date: string;
  title: string;
  excerpt: string;
  image: string;
};

export function EventsPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const [featuredEvents, setFeaturedEvents] = useState<FeaturedEvent[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);

  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [loadingUpcoming, setLoadingUpcoming] = useState(true);
  

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
                gradient: String(e.gradient ?? 'from-blue-500 to-purple-600'),
                category: String(e.category ?? 'Community'),
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
              const month = isNaN(parsed.getTime())
                ? 'Unknown'
                : parsed.toLocaleDateString(undefined, { year: 'numeric', month: 'long' });

              return {
                date: shortDate,
                title: String(e.title ?? 'Untitled Event'),
                time: String(e.event_time ?? 'TBA'),
                location: String(e.location ?? 'TBA'),
                description: String(e.description ?? ''),
                image: e.image_url ? String(e.image_url) : null,
                month,
                parsedDate: parsed,
              };
            }).sort((a, b) => a.parsedDate.getTime() - b.parsedDate.getTime())
          : [];

        setUpcomingEvents(mapped);
      } catch (err) {
        console.error('Failed to load events from API', err);
        setUpcomingEvents([]);
      } finally {
        setLoadingUpcoming(false);
      }
    };

    loadFeatured();
    loadUpcoming();
  }, []);

  const groupedEvents = upcomingEvents.reduce((acc, event) => {
    const month = event.month;
    if (!acc[month]) {
      acc[month] = [];
    }
    acc[month].push(event);
    return acc;
  }, {} as Record<string, UpcomingEvent[]>);

  const sortedMonths = Object.keys(groupedEvents).sort((a, b) => {
    const dateA = groupedEvents[a][0]?.parsedDate;
    const dateB = groupedEvents[b][0]?.parsedDate;
    return dateA.getTime() - dateB.getTime();
  });

  const nextSlide = () => {
    if (featuredEvents.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % featuredEvents.length);
  };

  const prevSlide = () => {
    if (featuredEvents.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + featuredEvents.length) % featuredEvents.length);
  };

  return (
    <div className="pt-18">
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
          </motion.div>

          {loadingUpcoming ? (
            <div className="events-grid-loading">
              <Loader2 className="events-grid-loading-icon" />
            </div>
          ) : upcomingEvents.length === 0 ? (
            <div className="events-grid-empty">
              <div className="events-empty-card">
                <Calendar className="events-empty-icon" />
                <p className="events-empty-text">No upcoming events yet.</p>
              </div>
            </div>
          ) : (
            sortedMonths.map((month) => (
              <div key={month} className="events-month-section">
                <h3 className="events-month-title">{month}</h3>
                <div className="events-grid">
                  <AnimatePresence mode="popLayout">
                    {groupedEvents[month].map((event) => (
                      <motion.div
                        key={event.title}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                        whileHover={{ y: -4 }}
                        className="events-card-wrapper"
                      >
                        <div className="events-card-horizontal">
                          <div className="events-card-image-container">
                            {event.image ? (
                              <img
                                src={event.image}
                                alt={event.title}
                                className="events-card-image"
                              />
                            ) : (
                              <div className="events-card-image-placeholder">
                                <Calendar className="events-card-placeholder-icon" />
                              </div>
                            )}
                            <div className="events-card-date-overlay">
                              <span className="events-card-date-day">{String(event.date).split(' ')[1] ?? ''}</span>
                              <span className="events-card-date-month-label">{String(event.date).split(' ')[0] ?? ''}</span>
                            </div>
                          </div>
                          <div className="events-card-body">
                            <h3 className="events-card-title">{event.title}</h3>
                            <p className="events-card-description">{event.description}</p>
                            <div className="events-card-meta">
                              <div className="events-card-meta-item">
                                <Clock className="events-card-meta-icon" />
                                <span>{event.time}</span>
                              </div>
                              <div className="events-card-meta-item">
                                <MapPin className="events-card-meta-icon" />
                                <span>{event.location}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

    </div>
  );
}
