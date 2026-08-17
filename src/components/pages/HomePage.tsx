import { motion, useScroll, useTransform } from 'motion/react';
import { BookOpen, Users, Award, Globe, ArrowRight, Sparkles, Loader2, Image, FlaskConical, Palette, Lightbulb, Rocket } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import { ScrollSequence } from '../ScrollSequence';
import { getGalleryItems } from '../../lib/api';
import '../../styles/pages/HomePage.css';
import pMessageImg from '../images/pmessage.jpeg';
import img2025 from '../images/2025.jpg';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

const STATS = [
  { id: 1, value: 700, suffix: '+', label: 'Students', icon: 'Users' },
  { id: 2, value: 30, suffix: '+', label: 'Expert Teachers', icon: 'BookOpen' },
  { id: 3, value: 95, suffix: '%', label: 'Success Rate', icon: 'Award' },
  { id: 4, value: 24, suffix: '+', label: 'Years of Trust', icon: 'Globe' },
];

const FEATURES = [
  {
    title: 'Modern Curriculum',
    description: "Cutting-edge courses designed for the digital age, preparing students for tomorrow's challenges.",
    gradient: 'from-blue-500 to-cyan-500',
    image: './images/kidGraduation.png',
  },
  {
    title: 'Expert Educators',
    description: 'Learn from passionate teachers who inspire curiosity and foster critical thinking.',
    gradient: 'from-purple-500 to-pink-500',
    image: './images/teachers.jpg',
  },
  {
    title: 'State-of-the-Art Facilities',
    description: 'World-class laboratories, studios, and technology that bring learning to life.',
    gradient: 'from-orange-500 to-red-500',
    image: 'https://images.unsplash.com/photo-1602052577122-f73b9710adba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
  },
];

export function HomePage({ onNavigate }: HomePageProps) {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);


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
      <StatsSection />

      {/* 2025 State-of-the-Art Milestone */}
      <Milestone2025Section onNavigate={onNavigate} />

      {/* Features Section */}
      <FeaturesSection onNavigate={onNavigate} />

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* Achievements Section */}
      <AchievementsSection />

      {/* Gallery Section */}
      <GallerySection />

      {/* Scroll-Driven Animation */}
      <ScrollSequence />

      {/* CTA Section */}
      <CTASection onNavigate={onNavigate} />
    </div>
    
  );
}

function StatsSection() {
  const iconMap: Record<string, any> = { Users, BookOpen, Award, Globe };

  return (
    <section className="stats-section">
      
      <div className="stats-container">
        <div className="stats-grid">
          {STATS.map((stat, index) => (
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

function Milestone2025Section({ onNavigate }: { onNavigate: (page: string) => void }) {
  const MILESTONE_BADGES = [
    { icon: FlaskConical, label: 'Smart Labs' },
    { icon: Palette, label: 'Creative Studios' },
    { icon: Lightbulb, label: 'Innovation Hub' },
    { icon: Rocket, label: 'Future-Ready' },
  ];

  return (
    <section className="milestone2025-section">
      {/* Ambient background orbs */}
      <div className="milestone2025-orbs" aria-hidden="true">
        <div className="milestone2025-orb milestone2025-orb-1" />
        <div className="milestone2025-orb milestone2025-orb-2" />
        <div className="milestone2025-orb milestone2025-orb-3" />
      </div>

      <div className="milestone2025-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="milestone2025-header"
        >
          <div className="milestone2025-kicker">
            <Sparkles size={16} />
            <span>Milestone 2025</span>
          </div>
          <h2 className="milestone2025-big-title">
            The Year Education
            <span className="milestone2025-big-title-gradient"> Went Next-Gen</span>
          </h2>
          <p className="milestone2025-big-subtitle">
            A landmark for our campus — state-of-the-art, everywhere you look
          </p>
        </motion.div>

        <div className="milestone2025-grid">
          {/* Visual / Photo */}
          <motion.div
            className="milestone2025-visual"
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="milestone2025-glow" />
            <motion.div
              className="milestone2025-frame"
              animate={{ rotate: [0, 2.5, 0, -2.5, 0] }}
              transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
              whileHover={{ scale: 1.03 }}
            >
              <motion.img
                src={img2025}
                alt="2025 State-of-the-art Future Stars campus"
                whileHover={{ scale: 1.07 }}
                transition={{ duration: 0.6 }}
              />
              <div className="milestone2025-frame-shine" />
              <div className="milestone2025-frame-border" />
            </motion.div>

            <motion.div
              className="milestone2025-year-badge"
              initial={{ scale: 0, rotate: -20 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 220, damping: 15, delay: 0.7 }}
              whileHover={{ scale: 1.1, rotate: 3 }}
            >
              <Sparkles size={18} className="milestone2025-year-badge-icon" />
              <span className="milestone2025-year-badge-year">2025</span>
              <span className="milestone2025-year-badge-label">Milestone</span>
            </motion.div>

            <motion.div
              className="milestone2025-float-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 1 }}
            >
              <motion.div
                className="milestone2025-float-card-inner"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <span className="milestone2025-float-card-icon">✦</span>
                <div>
                  <strong>State-of-the-Art</strong>
                  <small>Facilities · 2025</small>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Content */}
          <motion.div
            className="milestone2025-content"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.35 }}
          >
            <div className="milestone2025-title-row">
              <span className="milestone2025-title-accent" />
              <h3 className="milestone2025-title">2025 Expo Showcase</h3>
            </div>
            <p className="milestone2025-description">
              Step into the 2025 photo story — world-class labs, immersive studios,
              and intelligent learning spaces that bring every dream to life.
              This is where the future of Future Stars begins.
            </p>

            <div className="milestone2025-badges-grid">
              {MILESTONE_BADGES.map((badge, index) => (
                <motion.div
                  key={badge.label}
                  className="milestone2025-badge-item"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  whileHover={{ y: -4 }}
                >
                  <badge.icon size={22} className="milestone2025-badge-icon" />
                  <span>{badge.label}</span>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="milestone2025-cta"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.9 }}
            >
              <motion.button
                onClick={() => onNavigate('about')}
                className="btn-primary-gradient"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                Explore the Campus
                <ArrowRight />
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection({
  onNavigate,
}: {
  onNavigate: (page: string) => void;
}) {
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
          {FEATURES.map((feature, index) => (
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
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {

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
                    <span className="principal-label-text">Founder's Message</span>
                  </div>
                  <motion.p
                    className="principal-message"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    When we started Future Stars, our dream was simple to create a school where every child feels valued, inspired, and empowered. Education is not just about textbooks; it's about nurturing curiosity, building character, and preparing young minds for a world full of possibilities. I am grateful to see our vision come alive every day through the smiles and achievements of our students.
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
                    <span className="principal-label-text">Principal's Message</span>
                  </div>
                  <motion.p
                    className="principal-message"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    At Future Stars, we believe that every child carries a spark of greatness. Our mission has always been to create an environment where that spark is ignited through dedicated mentorship, innovative teaching, and a culture of kindness. Watching our students grow into confident, compassionate leaders is the greatest reward of this journey.
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

const ACHIEVEMENTS = [
  {
    title: 'Academic Excellence',
    description: 'Consistently ranked among the top schools in the region with outstanding board exam results year after year.',
    gradient: 'linear-gradient(135deg, #f59e0b, #f97316)',
  },
  {
    title: 'Sports Champions',
    description: 'Our students have brought home numerous district and national level trophies in athletics, football, and cricket.',
    gradient: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
  },
  {
    title: 'Cultural Achievements',
    description: 'Celebrated for outstanding performances in music, dance, and drama at inter-school competitions.',
    gradient: 'linear-gradient(135deg, #ec4899, #f43f5e)',
  },
  {
    title: 'Innovation & Science',
    description: 'Young innovators from our school have excelled in science fairs and technology exhibitions with creative projects.',
    gradient: 'linear-gradient(135deg, #10b981, #14b8a6)',
  },
];

function AchievementsSection() {
  return (
    <section className="achievements-section">
      <div className="achievements-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="achievements-header"
        >
          <h2 className="achievements-title">Achievements & Highlights</h2>
          <p className="achievements-subtitle">
            Celebrating the milestones and successes that make our school community proud
          </p>
        </motion.div>

        <div className="achievements-grid">
          {ACHIEVEMENTS.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              whileHover={{ y: -8 }}
            >
              <div className="achievement-card">
                <div
                  className="achievement-card-accent"
                  style={{ background: achievement.gradient }}
                />
                <div className="achievement-card-body">
                  <div className="achievement-photo-placeholder" />
                  <h3 className="achievement-title">{achievement.title}</h3>
                  <p className="achievement-description">{achievement.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface GalleryImage {
  id: number;
  title: string;
  image_url: string;
  category: string;
  description: string;
  created_at: string;
}

function GallerySection() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        // Fetch gallery items from site-data endpoint
        const items = await getGalleryItems();
        const flatImages: GalleryImage[] = (items ?? []).map((item, index) => ({
          id: index,
          title: item?.alt ?? 'Gallery',
          image_url: item?.src ?? '',
          category: item?.category ?? 'General',
          description: '',
          created_at: '',
        }));
        setImages(flatImages.filter(img => img.image_url));
      } catch (e) {
        console.error('Failed to load gallery images', e);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  if (loading) {
    return (
      <section className="gallery-section" aria-label="Gallery">
        <div className="gallery-container">
          <div className="gallery-header">
            <div className="gallery-header-content">
              <div className="gallery-icon-wrapper">
                <Image className="gallery-icon" size={28} />
              </div>
              <div>
                <h2 className="gallery-title">Gallery</h2>
                <p className="gallery-subtitle">Moments that define our journey</p>
              </div>
            </div>
          </div>
          <div className="gallery-grid" role="list">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="gallery-card skeleton" role="listitem">
                <div className="gallery-image-wrapper">
                  <div className="gallery-skeleton-image" />
                </div>
                <div className="gallery-content">
                  <div className="gallery-skeleton-text" />
                  <div className="gallery-skeleton-text short" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (images.length === 0) {
    return (
      <section className="gallery-section" aria-label="Gallery">
        <div className="gallery-container">
          <div className="gallery-header">
            <div className="gallery-header-content">
              <div className="gallery-icon-wrapper">
                <Image className="gallery-icon" size={28} />
              </div>
              <div>
                <h2 className="gallery-title">Gallery</h2>
                <p className="gallery-subtitle">Moments that define our journey</p>
              </div>
            </div>
          </div>
          <div className="gallery-empty">
            <Image className="gallery-empty-icon" size={48} />
            <p className="gallery-empty-text">No images in gallery yet</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="gallery-section" aria-label="Gallery">
      <div className="gallery-container">
        <div className="gallery-header">
          <div className="gallery-header-content">
            <div className="gallery-icon-wrapper">
              <Image className="gallery-icon" size={28} />
            </div>
            <div>
              <h2 className="gallery-title">Gallery</h2>
              <p className="gallery-subtitle">Moments that define our journey</p>
            </div>
          </div>
        </div>
        <div className="gallery-grid" role="list">
          {images.map((image, index) => (
            <motion.article
              key={image.id}
              className="gallery-card"
              role="listitem"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <div className="gallery-image-wrapper">
                <img
                  src={image.image_url}
                  alt={image.title || `Gallery image ${index + 1}`}
                  className="gallery-image"
                  loading="lazy"
                />
                <div className="gallery-overlay">
                  <span className="gallery-view-text">View</span>
                  <Image className="gallery-expand-icon" size={20} />
                </div>
              </div>
              <div className="gallery-content">
                <span className="gallery-category">{image.category}</span>
                <h3 className="gallery-image-title">{image.title}</h3>
                {image.description && (
                  <p className="gallery-description">{image.description}</p>
                )}
              </div>
            </motion.article>
          ))}
        </div>
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