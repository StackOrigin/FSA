import { useState, useEffect } from 'react';
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
  const [currentPage, setCurrentPage] = useState('home');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check if URL has admin path
    if (window.location.pathname === '/admin' || window.location.hash === '#admin') {
      setCurrentPage('admin');
    }
    
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
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'about':
        return <AboutPage />;
      case 'notice':
        return <NoticePage />;
      case 'admissions':
        return <AdmissionsPage />;
      case 'events':
        return <EventsPage />;
      case 'gallery':
        return <GalleryPage />;
      case 'contact':
        return <ContactPage />;
      case 'admin':
        return <AdminApp />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  // If on admin page, render only the admin app
  if (currentPage === 'admin') {
    return <AdminApp />;
  }

  return (
    <div className="app-container">
      <Navigation
        currentPage={currentPage}
        onNavigate={handleNavigate}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />
      
      <AnimatePresence mode="wait">
        <div key={currentPage}>
          {renderPage()}
        </div>
      </AnimatePresence>
      
      <Footer onNavigate={handleNavigate} />
      <ScrollToTop />
    </div>
  );
}