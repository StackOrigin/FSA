import { motion, useScroll, useTransform } from 'motion/react';
import { BookOpen, Users, Award, Globe, ArrowRight, Sparkles, Loader2, Cake, Calendar } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import { ScrollSequence } from '../ScrollSequence';
import '../../styles/pages/HomePage.css';
import pMessageImg from '../images/pmessage.jpeg';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  const iconMap: Record<string, any> = { Users, BookOpen, Award, Globe };
  const [homeContent, setHomeContent] = useState<any>(null);
  const [homeLoading, setHomeLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/content/home');
        const data = await res.json();
        setHomeContent(data);
      } catch (e) {
        console.error('Failed to load home content', e);
        setHomeContent(null);
      } finally {
        setHomeLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="home-page" >
      <section ref={heroRef} className="hero-section">
        {/* Background Video */}
        <video
          className="hero-bg-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="./video/hero.mp4" type="video/mp4" />
        </video>
        <div className="hero-bg-overlay" />

        <div className="hero-container">
          {/* Left Column - Text Content */}
          <motion.div
            className="hero-content-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hero-title"
            >

              Where Every Child's
              <br />
              Potential Is Celebrated
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="hero-subtitle"
            >
              Empowering Stars, Igniting Futures.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="hero-actions"
            >
              <motion.button
                onClick={() => onNavigate('admissions')}
                className="btn-primary-gradient"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                Apply Now
                <ArrowRight />
              </motion.button>
              <motion.button
                onClick={() => onNavigate('about')}
                className="btn-outline"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                Learn More
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Column - Image Grid */}
          <div className="hero-images-right">
            <motion.div
              className="hero-image-grid"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <motion.div
                className="hero-image-item hero-img-1"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: 1
                }}
                transition={{
                  opacity: { duration: 0.8, delay: 0.4 },
                  scale: { duration: 0.8, delay: 0.4 }
                }}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <img src="./images/mainphoto1.jpg" alt="School life" />
              </motion.div>

              <motion.div
                className="hero-image-item hero-img-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: 1
                }}
                transition={{
                  opacity: { duration: 0.8, delay: 0.5 },
                  scale: { duration: 0.8, delay: 0.5 }
                }}
                whileHover={{ scale: 1.1, rotate: -5 }}
              >
                <img src="./images/mainphoto2.jpg" alt="Students" />
              </motion.div>

              <motion.div
                className="hero-image-item hero-img-3"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: 1
                }}
                transition={{
                  opacity: { duration: 0.8, delay: 0.6 },
                  scale: { duration: 0.8, delay: 0.6 }
                }}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <img src="./images/about.jpg" alt="Learning" />
              </motion.div>

              <motion.div
                className="hero-image-item hero-img-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: 1
                }}
                transition={{
                  opacity: { duration: 0.8, delay: 0.7 },
                  scale: { duration: 0.8, delay: 0.7 }
                }}
                whileHover={{ scale: 1.1, rotate: -5 }}
              >
                <img src="./images/mainphoto.png" alt="Principal" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <StatsSection loading={homeLoading} iconMap={iconMap} stats={homeContent?.stats} />

      {/* Features Section */}
      <FeaturesSection onNavigate={onNavigate} loading={homeLoading} features={homeContent?.features} />

      {/* Testimonials Section */}
      <TestimonialsSection loading={homeLoading} testimonials={homeContent?.testimonials} />

      {/* Birthday Section */}
      <BirthdaySection />

      {/* School Houses Section */}
      <SchoolHousesSection />

      {/* School Leaders Section */}
      <SchoolLeadersSection />

      {/* Scroll-Driven Animation */}
      <ScrollSequence />

      {/* CTA Section */}
      <CTASection onNavigate={onNavigate} />
    </div>
    
  );
}

function StatsSection({
  loading,
  stats,
  iconMap,
}: {
  loading: boolean;
  stats: any[] | undefined;
  iconMap: Record<string, any>;
}) {
  const safeStats = Array.isArray(stats) ? stats : [];

  return (
    <section className="stats-section">
      
      <div className="stats-container">
        {loading ? (
          <div className="stats-loading">
            <Loader2 />
          </div>
        ) : (
          <div className="stats-grid">
            {safeStats.map((stat, index) => (
              <StatCard
                key={stat.id ?? index}
                stat={{
                  ...stat,
                  icon: iconMap[String(stat.icon)] ?? Users,
                }}
                index={index}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

function StatCard({ stat, index }: { stat: any; index: number }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasAnimated) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setHasAnimated(true);
            const duration = 2000;
            const steps = 60;
            const increment = stat.value / steps;
            let current = 0;

            const timer = setInterval(() => {
              current += increment;
              if (current >= stat.value) {
                setCount(stat.value);
                clearInterval(timer);
              } else {
                setCount(Math.floor(current));
              }
            }, duration / steps);

            return () => clearInterval(timer);
          }
        },
        { threshold: 0.5 }
      );

      if (ref.current) {
        observer.observe(ref.current);
      }

      return () => observer.disconnect();
    }
  }, [stat.value, hasAnimated]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <div className="stat-card">
        <motion.div
          whileHover={{ scale: 1.1}}
          transition={{ duration: 0.5 }}
          className="stat-icon"
        >
          <stat.icon />
        </motion.div>
        <div className="stat-value">
          {count}{stat.suffix}
        </div>
        <div className="stat-label">{stat.label}</div>
      </div>
    </motion.div>
  );
}

function FeaturesSection({
  onNavigate,
  loading,
  features,
}: {
  onNavigate: (page: string) => void;
  loading: boolean;
  features: any[] | undefined;
}) {
  const safeFeatures = Array.isArray(features) ? features : [];
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section className="features-section" >
      <div className="features-container" >
        <motion.div

          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="section-header"
        >
          <h2 className="section-title">Why Choose Us</h2>
          <p className="section-subtitle">
            Discover what makes our school the perfect place for your child's educational journey
          </p>
        </motion.div>

        <div className="features-grid">
          {loading ? (
            <div className="features-loading">
              <Loader2 />
            </div>
          ) : safeFeatures.length === 0 ? (
            <div className="features-empty">
              <div className="features-empty-card">
                <p className="text-muted-foreground">No features configured.</p>
              </div>
            </div>
          ) : (
            safeFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -8 }}
              >
                <div className="feature-card">
                  <div className="feature-image-container">
                    <motion.div
                      className="feature-gradient-overlay"
                      style={{background: `linear-gradient(to bottom right, ${feature.gradient})`}}
                    />
                    <motion.img
                      src={feature.image}
                      alt={feature.title}
                      className="feature-image"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <div className="feature-content">
                    <h3 className="feature-title">{feature.title}</h3>
                    <p className={`feature-description ${expandedIndex === index ? 'expanded' : ''}`}>
                      {feature.description}
                    </p>
                    {feature.description && feature.description.length > 80 && (
                      <button
                        className="read-more-btn"
                        onClick={(e) => toggleExpand(index, e)}
                      >
                        {expandedIndex === index ? 'Read Less' : 'Read More'}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection({
  loading,
  testimonials,
}: {
  loading: boolean;
  testimonials: any[] | undefined;
}) {
  const safeTestimonials = Array.isArray(testimonials) ? testimonials : [];

  return (
    <section className="familymessage-section">
      <div className="familymessage-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="familymessage-header"
        >
          <h2 className="familymessage-title">
            Message from our Family
          </h2>
          <p className="familymessage-subtitle">
            Words of vision and inspiration from the people who built Future Stars
          </p>
        </motion.div>

        <div className="founders-grid">
          {/* Founder 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="principal-card">
              <div className="founder-card-inner">
                <div className="principal-image-container">
                  <div className="principal-image-wrapper">
                    <div className="principal-image-glow" />
                    <motion.img
                      src='./images/mainphoto1.jpg'
                      className="principal-image"
                      alt="Founder"
                      initial={{ scale: 0.9, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8 }}
                      whileHover={{ scale: 1.05 }}
                    />
                  </div>
                </div>
                <div className="principal-content">
                  <div className="principal-label">
                    <motion.div
                      className="principal-label-line"
                      initial={{ width: 0 }}
                      whileInView={{ width: "3rem" }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    />
                    <span className="principal-label-text">Founder's Message</span>
                  </div>
                  <motion.p
                    className="principal-message"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    When we started Future Stars, our dream was simple — to create a school where every child feels valued, inspired, and empowered. Education is not just about textbooks; it's about nurturing curiosity, building character, and preparing young minds for a world full of possibilities. I am grateful to see our vision come alive every day through the smiles and achievements of our students.
                  </motion.p>
                 
                </div>
              </div>
            </div>
          </motion.div>

          {/* Founder 2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="principal-card">
              <div className="founder-card-inner">
                <div className="principal-image-container">
                  <div className="principal-image-wrapper">
                    <div className="principal-image-glow" />
                    <motion.img
                      src={pMessageImg}
                      className="principal-image"
                      alt="Founder"
                      initial={{ scale: 0.9, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8 }}
                      whileHover={{ scale: 1.05 }}
                    />
                  </div>
                </div>
                <div className="principal-content">
                  <div className="principal-label">
                    <motion.div
                      className="principal-label-line"
                      initial={{ width: 0 }}
                      whileInView={{ width: "3rem" }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    />
                    <span className="principal-label-text">Principal's Message</span>
                  </div>
                  <motion.p
                    className="principal-message"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    At Future Stars, we believe that every child carries a spark of greatness. Our mission has always been to create an environment where that spark is ignited — through dedicated mentorship, innovative teaching, and a culture of kindness. Watching our students grow into confident, compassionate leaders is the greatest reward of this journey.
                  </motion.p>
                 
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        
        

        
      </div>
    </section>
  );
}

interface BirthdayPerson {
  id: number;
  name: string;
  role: string;
  birth_date: string;
  image_url?: string;
}

function BirthdaySection() {
  const [birthdays, setBirthdays] = useState<BirthdayPerson[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBirthdays = async () => {
      try {
        const res = await fetch('/api/birthdays/today');
        const data = await res.json();
        setBirthdays(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Failed to load birthdays', e);
      } finally {
        setLoading(false);
      }
    };
    fetchBirthdays();
  }, []);

  // Don't render section if no birthdays today and not loading
  if (!loading && birthdays.length === 0) return null;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    return `${monthNames[d.getMonth()]} ${d.getDate()}`;
  };

  return (
    <section className="birthday-section">
      <div className="birthday-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="section-header"
        >
          <div className="birthday-label">
            <Cake className="birthday-label-icon" />
            <span>Celebrations</span>
          </div>
          <h2 className="section-title">Today's Birthdays</h2>
          <p className="section-subtitle">
            Wishing our member a day filled with joy and a year ahead full of success and happiness!
          </p>
        </motion.div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
            <Loader2 style={{ width: '2rem', height: '2rem', color: '#3b82f6', animation: 'spin 1s linear infinite' }} />
          </div>
        ) : (
          <div className="birthday-grid">
            {birthdays.map((person, index) => (
              <BirthdayCard key={person.id} person={person} index={index} formatDate={formatDate} />
            ))}</div>
        )}
      </div>
    </section>
  );
}

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function BirthdayCard({ person, index, formatDate }: { person: BirthdayPerson; index: number; formatDate: (d: string) => string }) {
  const accentColors = ['#3b82f6', '#9333ea', '#ec4899'];
  const accent = accentColors[index % accentColors.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -6 }}
      className="birthday-card"
    >
      <div className="birthday-card-body">
        <div className="birthday-avatar" style={person.image_url ? {} : { background: accent }}>
          {person.image_url ? (
            <img src={person.image_url} alt={person.name} className="birthday-avatar-img" />
          ) : (
            <span>{getInitials(person.name)}</span>
          )}
        </div>
        <h3 className="birthday-name">{person.name}</h3>
        <p className="birthday-role">{person.role}</p>
        <div className="birthday-date">
          <Calendar className="birthday-date-icon" />
          <span>{formatDate(person.birth_date)}</span>
        </div>
      </div>
    </motion.div>
  );
}

interface SchoolHouseData {
  id: number;
  name: string;
  color: string;
  border: string;
  captain_name: string;
  captain_image: string;
  vice_captain_name: string;
  vice_captain_image: string;
}

function SchoolHousesSection() {
  const [houses, setHouses] = useState<SchoolHouseData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const res = await fetch('/api/school-houses');
        const data = await res.json();
        setHouses(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Failed to load school houses', e);
      } finally {
        setLoading(false);
      }
    };
    fetchHouses();
  }, []);

  if (!loading && houses.length === 0) return null;

  return (
    <section className="school-houses-section">
      <div className="school-houses-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="section-header"
        >
          <h2 className="section-title">School House</h2>
          <p className="section-subtitle">
            Our four proud houses competing in spirit, sportsmanship, and excellence
          </p>
        </motion.div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
            <Loader2 style={{ width: '2rem', height: '2rem', color: '#3b82f6', animation: 'spin 1s linear infinite' }} />
          </div>
        ) : (
          <div className="school-houses-grid">
            {houses.map((house, index) => (
              <motion.div
                key={house.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                whileHover={{ y: -6 }}
                className="school-house-card"
                style={{ borderColor: house.border }}
              >
                <div
                  className="school-house-color-bar"
                  style={{ background: house.color }}
                />
                <h3 className="school-house-name" style={{ color: house.color }}>
                  {house.name}
                </h3>
                <div className="school-house-leaders">
                  {/* Captain */}
                  <div className="school-house-leader">
                    <div className="school-house-avatar">
                      {house.captain_image ? (
                        <img src={house.captain_image} alt={house.captain_name} />
                      ) : (
                        <Users style={{ width: '1.5rem', height: '1.5rem', color: house.color }} />
                      )}
                    </div>
                    <span className="school-house-leader-role">Captain</span>
                    <span className="school-house-leader-name">{house.captain_name || 'TBA'}</span>
                  </div>
                  {/* Vice Captain */}
                  <div className="school-house-leader">
                    <div className="school-house-avatar">
                      {house.vice_captain_image ? (
                        <img src={house.vice_captain_image} alt={house.vice_captain_name} />
                      ) : (
                        <Users style={{ width: '1.5rem', height: '1.5rem', color: house.color }} />
                      )}
                    </div>
                    <span className="school-house-leader-role">Vice Captain</span>
                    <span className="school-house-leader-name">{house.vice_captain_name || 'TBA'}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

interface SchoolLeaderData {
  id: number;
  role: string;
  name: string;
  image: string;
  color: string;
}

function SchoolLeadersSection() {
  const [leaders, setLeaders] = useState<SchoolLeaderData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const res = await fetch('/api/school-leaders');
        const data = await res.json();
        setLeaders(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error('Failed to load school leaders', e);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaders();
  }, []);

  if (!loading && leaders.length === 0) return null;

  return (
    <section className="school-leaders-section">
      <div className="school-leaders-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="section-header"
        >
          <h2 className="section-title">School Leaders</h2>
          <p className="section-subtitle">
            Student leaders who represent and inspire our school community
          </p>
        </motion.div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
            <Loader2 style={{ width: '2rem', height: '2rem', color: '#3b82f6', animation: 'spin 1s linear infinite' }} />
          </div>
        ) : (
          <div className="school-leaders-grid">
            {leaders.map((leader, index) => (
              <motion.div
                key={leader.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className="school-leader-card"
                style={{ borderColor: leader.color + '4D' }}
              >
                <div
                  className="school-leader-color-bar"
                  style={{ background: leader.color }}
                />
                <div
                  className="school-leader-avatar"
                  style={{ borderColor: leader.color }}
                >
                  {leader.image ? (
                    <img src={leader.image} alt={leader.name} />
                  ) : (
                    <Users style={{ width: '2rem', height: '2rem', color: leader.color }} />
                  )}
                </div>
                <span className="school-leader-role" style={{ color: leader.color }}>
                  {leader.role}
                </span>
                <span className="school-leader-name">
                  {leader.name || 'TBA'}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function CTASection({ onNavigate }: { onNavigate: (page: string) => void }) {
  return (
    <section className="cta-section">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="cta-container"
      >
        <div className="cta-card">
          <motion.h2
            className="cta-title"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            Ready to Begin Your Journey?
          </motion.h2>
          <p className="cta-subtitle">
            Join our community of learners and discover your potential
          </p>
          <div className="cta-actions">
            <motion.button
              onClick={() => onNavigate('admissions')}
              className="btn-primary-gradient"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              Start Application
            </motion.button>
            <motion.button
              onClick={() => onNavigate('contact')}
              className="btn-sav"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              Schedule a Visit
            </motion.button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}