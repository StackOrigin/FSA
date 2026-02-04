import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Calendar, MapPin, Clock, ChevronLeft, ChevronRight, Tag, Loader2, Newspaper } from 'lucide-react';
import { useEffect, useState } from 'react';

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
      <section className="py-20 px-4 text-center bg-gradient-to-b from-background via-muted/30 to-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Events & News
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Stay connected with what's happening at FutureSchool. From academic showcases to community celebrations, there's always something exciting going on!
          </p>
        </motion.div>
      </section>

      {/* Featured Events Carousel */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Featured Events</h2>
            <p className="text-lg text-muted-foreground">Don't miss these upcoming highlights</p>
          </motion.div>

          <div className="relative">
            {loadingFeatured ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
              </div>
            ) : featuredEvents.length === 0 ? (
              <Card className="p-12 text-center">
                <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No featured events yet. Mark events as featured in the admin panel.</p>
              </Card>
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
                    <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur">
                      <div className="grid md:grid-cols-2">
                        <div className="relative h-64 md:h-full">
                          <div className={`absolute inset-0 bg-gradient-to-br ${featuredEvents[currentSlide].gradient} opacity-20`} />
                          {featuredEvents[currentSlide].image ? (
                            <img
                              src={featuredEvents[currentSlide].image ?? ''}
                              alt={featuredEvents[currentSlide].title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-muted/30">
                              <Calendar className="w-12 h-12 text-muted-foreground/50" />
                            </div>
                          )}
                          <div className={`absolute top-4 left-4 px-4 py-2 rounded-full bg-gradient-to-r ${featuredEvents[currentSlide].gradient} text-white text-sm font-bold`}>
                            {featuredEvents[currentSlide].category}
                          </div>
                        </div>
                        <div className="p-8 md:p-12 flex flex-col justify-center">
                          <h3 className="text-3xl font-bold mb-4">{featuredEvents[currentSlide].title}</h3>
                          <div className="space-y-2 mb-6">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="w-5 h-5" />
                              <span>{featuredEvents[currentSlide].date}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Clock className="w-5 h-5" />
                              <span>{featuredEvents[currentSlide].time}</span>
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MapPin className="w-5 h-5" />
                              <span>{featuredEvents[currentSlide].location}</span>
                            </div>
                          </div>
                          <p className="text-muted-foreground mb-6">{featuredEvents[currentSlide].description}</p>
                          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-full w-fit">
                            Learn More
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                </AnimatePresence>

                {/* Carousel Controls */}
                <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-4 pointer-events-none">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={prevSlide}
                    className="pointer-events-auto w-12 h-12 rounded-full bg-background/80 backdrop-blur border border-border/50 flex items-center justify-center hover:shadow-lg transition-shadow"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={nextSlide}
                    className="pointer-events-auto w-12 h-12 rounded-full bg-background/80 backdrop-blur border border-border/50 flex items-center justify-center hover:shadow-lg transition-shadow"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </motion.button>
                </div>

                {/* Carousel Indicators */}
                <div className="flex justify-center gap-2 mt-6">
                  {featuredEvents.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === currentSlide ? 'w-8 bg-primary' : 'w-2 bg-muted-foreground/30'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 px-4 bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Upcoming Events</h2>
            <p className="text-lg text-muted-foreground mb-8">Filter by category</p>
            
            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </motion.button>
              ))}
            </div>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loadingUpcoming ? (
              <div className="col-span-full flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="col-span-full">
                <Card className="p-12 text-center">
                  <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No upcoming events yet.</p>
                </Card>
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
                    <Card className="p-6 hover:shadow-xl transition-shadow cursor-pointer border-border/50 bg-card/50 backdrop-blur h-full">
                      <div className="flex items-start gap-4">
                        <div className="text-center flex-shrink-0">
                          <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-1">
                            <div className="text-white font-bold text-lg">{String(event.date).split(' ')[1] ?? ''}</div>
                          </div>
                          <div className="text-xs text-muted-foreground">{String(event.date).split(' ')[0] ?? ''}</div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Tag className="w-4 h-4 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{event.category}</span>
                          </div>
                          <h3 className="font-bold mb-2">{event.title}</h3>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{event.time}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{event.location}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
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
