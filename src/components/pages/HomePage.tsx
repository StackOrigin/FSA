import { motion, useScroll, useTransform } from 'motion/react';
import { BookOpen, Users, Award, Globe, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import '../../styles/pages/HomePage.css';

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
                  scale: 1,
                  y: [0, -15, 0]
                }}
                transition={{
                  opacity: { duration: 0.8, delay: 0.4 },
                  scale: { duration: 0.8, delay: 0.4 },
                  y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                }}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <img src="/images/mainphoto1.jpg" alt="School life" />
              </motion.div>

              <motion.div
                className="hero-image-item hero-img-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: [0, -20, 0]
                }}
                transition={{
                  opacity: { duration: 0.8, delay: 0.5 },
                  scale: { duration: 0.8, delay: 0.5 },
                  y: { duration: 5, repeat: Infinity, ease: "easeInOut" }
                }}
                whileHover={{ scale: 1.1, rotate: -5 }}
              >
                <img src="/images/mainphoto2.jpg" alt="Students" />
              </motion.div>

              <motion.div
                className="hero-image-item hero-img-3"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: [0, -18, 0]
                }}
                transition={{
                  opacity: { duration: 0.8, delay: 0.6 },
                  scale: { duration: 0.8, delay: 0.6 },
                  y: { duration: 4.5, repeat: Infinity, ease: "easeInOut" }
                }}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <img src="/images/about.jpg" alt="Learning" />
              </motion.div>

              <motion.div
                className="hero-image-item hero-img-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  y: [0, -22, 0]
                }}
                transition={{
                  opacity: { duration: 0.8, delay: 0.7 },
                  scale: { duration: 0.8, delay: 0.7 },
                  y: { duration: 5.5, repeat: Infinity, ease: "easeInOut" }
                }}
                whileHover={{ scale: 1.1, rotate: -5 }}
              >
                <img src="/images/principal.jpg" alt="Principal" />
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
          whileHover={{ scale: 1.1, rotate: 360 }}
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
                    <p className="feature-description">{feature.description}</p>
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
    <section className="testimonials-section">
      <div className="testimonials-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="testimonials-header"
        >
          <h2 className="testimonials-title">
            Message from our Principal
          </h2>
          <p className="testimonials-subtitle">
            A word of inspiration and guidance for our school community
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="principal-card">
            <div className="principal-grid">
              <div className="principal-image-container">
                <div className="principal-image-wrapper">
                  <div className="principal-image-glow" />
                  <motion.img
                    src='/images/principal.jpg'
                    className="principal-image"
                    alt="Principal"
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
                  <span className="principal-label-text">Principal's Message</span>
                </div>
                <motion.p
                  className="principal-message"
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  As the Principal, I am proud to lead a school community that is committed to academic excellence, character development, and the holistic growth of every student. We strive to create a safe, supportive, and inspiring environment where students are encouraged to explore their potential, think critically, and develop lifelong values. Together with our dedicated teachers, supportive parents, and motivated students, we work as a team to shape responsible, confident, and compassionate individuals who are prepared to face the challenges of the future.
                </motion.p>
                <motion.div
                  className="principal-footer"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <p className="principal-name">School Principal</p>
                  <p className="principal-school">Future Stars School</p>
                </motion.div>
              </div>
            </div>
          </div>

        </motion.div>

        
        

        
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
              className="btn-outline"
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
