import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { HomePage } from './components/pages/HomePage';
import { AboutPage } from './components/pages/AboutPage';
import {NoticePage} from './components/pages/NoticePage';
import { AdmissionsPage } from './components/pages/AdmissionsPage';
import { EventsPage } from './components/pages/EventsPage';
import { GalleryPage } from './components/pages/GalleryPage';
import { ContactPage } from './components/pages/ContactPage';
import { AdminApp } from './components/admin/AdminApp';
import './styles/App.css';

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', String(newDarkMode));
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleNavigate = (page: string) => {
    const path = page === 'home' ? '/' : `/${page}`;
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get current page from path
  const getCurrentPage = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    return path.slice(1); // Remove leading slash
  };

  // If on admin page, render only the admin app
  if (location.pathname === '/admin') {
    return <AdminApp />;
  }

  return (
    <div className="app-container">
      <Navigation
        currentPage={getCurrentPage()}
        onNavigate={handleNavigate}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />
      
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomePage onNavigate={handleNavigate} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/notice" element={<NoticePage />} />
          <Route path="/admissions" element={<AdmissionsPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<AdminApp />} />
        </Routes>
      </AnimatePresence>
      
      <Footer onNavigate={handleNavigate} />
      <ScrollToTop />
    </div>
  );
}