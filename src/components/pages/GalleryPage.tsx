import { motion, AnimatePresence } from 'motion/react';
import { X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import '../../styles/pages/GalleryPage.css';

export function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [apiImages, setApiImages] = useState<Array<{ url: string; title: string; category: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/gallery');
        const data = await res.json();

        setApiImages(
          Array.isArray(data)
            ? data
                .filter((x: any) => x && x.image_url)
                .map((x: any) => ({
                  url: String(x.image_url),
                  title: String(x.title ?? 'Untitled'),
                  category: String(x.category ?? 'General'),
                }))
            : []
        );
      } catch (e) {
        console.error('Failed to load gallery from API', e);
        setApiImages([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  useEffect(() => {
    setSelectedImage(null);
  }, [selectedCategory]);

  const images = apiImages;

  const categories = ['all', 'classroom activity', 'sports', 'events', 'extra excursion', 'school program'];

  const filteredImages = selectedCategory === 'all'
    ? images
    : images.filter((img) => img.category === selectedCategory);

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="gallery-hero">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="gallery-hero-content"
        >
          <h1 className="gallery-hero-title">
            Gallery
          </h1>
          <p className="gallery-hero-description">
            Explore life at FutureSchool through images that capture our vibrant community.
          </p>
        </motion.div>
      </section>

      {/* Category Filter */}
      <section className="gallery-filter-section">
        <div className="gallery-filter-container">
          <div className="gallery-filter-buttons">
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category)}
                className={`gallery-filter-btn ${selectedCategory === category ? 'active' : ''}`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="gallery-grid-section">
        <div className="gallery-grid-container">
          {loading ? (
            <div className="gallery-loading">
              <Loader2 className="gallery-loading-icon" />
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="gallery-empty">
              <ImageIcon className="gallery-empty-icon" />
              <p className="gallery-empty-text">No images yet. Add some from the admin panel.</p>
            </div>
          ) : (
            <motion.div layout className="gallery-grid">
              <AnimatePresence mode="popLayout">
                {filteredImages.map((image, index) => (
                  <motion.div
                    key={`${image.url}-${index}`}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.4 }}
                    whileHover={{ scale: 1.05 }}
                    className="gallery-card"
                    onClick={() => setSelectedImage(index)}
                  >
                    <div className="gallery-card-inner">
                      <div className="gallery-card-image-wrapper">
                        <motion.img
                          src={image.url}
                          alt={image.title}
                          className="gallery-card-image"
                        />
                        <div className="gallery-card-overlay" />
                        <div className="gallery-card-info">
                          <h3 className="gallery-card-title">{image.title}</h3>
                          <div className="gallery-card-category">
                            {image.category}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0, 0, 0, 0.92)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedImage(null)}
              className="gallery-modal-close"
              style={{
                position: 'fixed',
                top: '1.5rem',
                right: '1.5rem',
                zIndex: 10001,
              }}
            >
              <X className="gallery-modal-close-icon" />
            </motion.button>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                maxWidth: '85vw',
                maxHeight: '85vh',
                cursor: 'default',
              }}
            >
              <img
                src={filteredImages[selectedImage].url}
                alt={filteredImages[selectedImage].title}
                style={{
                  display: 'block',
                  maxWidth: '85vw',
                  maxHeight: '75vh',
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain',
                  borderRadius: '0.5rem',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                }}
              />
              <div className="gallery-modal-info">
                <h3 className="gallery-modal-title">
                  {filteredImages[selectedImage].title}
                </h3>
                <div className="gallery-modal-category">
                  {filteredImages[selectedImage].category}
                </div>
              </div>
            </motion.div>

            {/* Navigation Arrows */}
            <div className="gallery-modal-nav">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage((prev) =>
                    prev === null ? null : (prev - 1 + filteredImages.length) % filteredImages.length
                  );
                }}
                className="gallery-modal-nav-btn"
              >
                <svg className="gallery-modal-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage((prev) =>
                    prev === null ? null : (prev + 1) % filteredImages.length
                  );
                }}
                className="gallery-modal-nav-btn"
              >
                <svg className="gallery-modal-nav-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
