import { useState, useEffect } from 'react';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import '../styles/Navigation.css';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export function Navigation({ currentPage, onNavigate, darkMode, toggleDarkMode }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'notice', label: 'Notice' },
    { id: 'admissions', label: 'Admissions' },
    { id: 'events', label: 'Events' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'contact', label: 'Contact' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`navigation ${isScrolled ? 'scrolled' : 'transparent'}`}
    >
      <div className="nav-container">
        <div className="nav-content">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="nav-logo"
            onClick={() => onNavigate('home')}
          >
            <div className="nav-logo-icon">
              <span>FS</span>
            </div>
            <div>
              <div className="nav-logo-text">FutureSchool</div>
              <div className="nav-logo-subtitle">Shaping Tomorrow</div>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="nav-desktop">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>{item.label}</span>
                {currentPage === item.id && (
                  <motion.div
                    layoutId="activeNav"
                    className="nav-item-bg"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Dark Mode Toggle & Mobile Menu */}
          <div className="nav-actions">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <button
                onClick={toggleDarkMode}
                className="nav-toggle-btn"
              >
                <AnimatePresence mode="wait">
                  {darkMode ? (
                    <motion.div
                      key="sun"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Sun />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Moon />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="nav-menu-btn">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="nav-toggle-btn"
              >
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </motion.div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="nav-mobile"
            >
              <div className="nav-mobile-inner">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      onNavigate(item.id);
                      setIsMenuOpen(false);
                    }}
                    className={`nav-mobile-item ${currentPage === item.id ? 'active' : ''}`}
                  >
                    {item.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
