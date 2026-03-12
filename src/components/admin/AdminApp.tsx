import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';
import { AdminNavigation } from './AdminNavigation';
import { EventsManagement } from './EventsManagement';
import { GalleryManagement } from './GalleryManagement';
import { ContactsManagement } from './ContactsManagement';
import { AdmissionsManagement } from './AdmissionsManagement';
import { HomeContentManagement } from './HomeContentManagement';
import { NoticesManagement } from './NoticesManagement';
import { BirthdaysManagement } from './BirthdaysManagement';
import { SchoolHousesManagement } from './SchoolHousesManagement';
import { SchoolLeadersManagement } from './SchoolLeadersManagement';
import '../../styles/admin/Admin.css';

function ProtectedRoute({ isAuthenticated, children }: { isAuthenticated: boolean; children: React.ReactNode }) {
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }
  return <>{children}</>;
}

export function AdminApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState(null as string | null);
  const [authChecked, setAuthChecked] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedAuth = localStorage.getItem('adminAuth');
    const savedUser = localStorage.getItem('adminUser');
    if (savedAuth === 'true' && savedUser) {
      setIsAuthenticated(true);
      setAdminUser(savedUser);
    }
    setAuthChecked(true);
  }, []);

  const handleLogin = (username: string) => {
    setIsAuthenticated(true);
    setAdminUser(username);
    localStorage.setItem('adminAuth', 'true');
    localStorage.setItem('adminUser', username);
    navigate('/admin', { replace: true });
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminUser(null);
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminUser');
    navigate('/admin/login', { replace: true });
  };

  if (!authChecked) return null;

  return (
    <Routes>
      <Route
        path="login"
        element={
          isAuthenticated
            ? <Navigate to="/admin" replace />
            : <AdminLogin onLogin={handleLogin} />
        }
      />
      <Route
        path="*"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <div className="admin-app">
              <AdminNavigation
                adminUser={adminUser}
                onLogout={handleLogout}
              />
              <main className="admin-main">
                <div className="admin-main-content">
                  <Routes>
                    <Route index element={<AdminDashboard />} />
                    <Route path="events" element={<EventsManagement />} />
                    <Route path="gallery" element={<GalleryManagement />} />
                    <Route path="contacts" element={<ContactsManagement />} />
                    <Route path="admissions" element={<AdmissionsManagement />} />
                    <Route path="home-content" element={<HomeContentManagement />} />
                    <Route path="notices" element={<NoticesManagement />} />
                    <Route path="birthdays" element={<BirthdaysManagement />} />
                    <Route path="school-houses" element={<SchoolHousesManagement />} />
                    <Route path="school-leaders" element={<SchoolLeadersManagement />} />
                    <Route path="*" element={<Navigate to="/admin" replace />} />
                  </Routes>
                </div>
              </main>
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
