import { useState, useEffect } from 'react';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';
import { AdminNavigation } from './AdminNavigation';
import { EventsManagement } from './EventsManagement';
import { GalleryManagement } from './GalleryManagement';
import { ContactsManagement } from './ContactsManagement';
import { AdmissionsManagement } from './AdmissionsManagement';
import { HomeContentManagement } from './HomeContentManagement';

export function AdminApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [adminUser, setAdminUser] = useState(null as string | null);

  useEffect(() => {
    // Check for existing session
    const savedAuth = localStorage.getItem('adminAuth');
    const savedUser = localStorage.getItem('adminUser');
    if (savedAuth === 'true' && savedUser) {
      setIsAuthenticated(true);
      setAdminUser(savedUser);
    }
  }, []);

  const handleLogin = (username: string) => {
    setIsAuthenticated(true);
    setAdminUser(username);
    localStorage.setItem('adminAuth', 'true');
    localStorage.setItem('adminUser', username);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminUser(null);
    setCurrentPage('dashboard');
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminUser');
  };

  const goToDashboard = () => setCurrentPage('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <AdminDashboard onNavigate={setCurrentPage} />;
      case 'events':
        return <EventsManagement onBack={goToDashboard} />;
      case 'gallery':
        return <GalleryManagement onBack={goToDashboard} />;
      case 'contacts':
        return <ContactsManagement onBack={goToDashboard} />;
      case 'admissions':
        return <AdmissionsManagement onBack={goToDashboard} />;
      case 'home-content':
        return <HomeContentManagement onBack={goToDashboard} />;
      default:
        return <AdminDashboard onNavigate={setCurrentPage} />;
    }
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800">
      <AdminNavigation
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        adminUser={adminUser}
        onLogout={handleLogout}
      />
      <main className="lg:ml-72 min-h-screen pt-16 lg:pt-0">
        <div className="p-4 lg:p-8">
          {renderPage()}
        </div>
      </main>
    </div>
  );
}
