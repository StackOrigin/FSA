import { motion } from 'motion/react';
import {
  LayoutDashboard,
  Calendar,
  Image,
  Mail,
  UserPlus,
  LogOut,
  Menu,
  X,
  GraduationCap,
  Home,
  ChevronRight,
  Bell,
  Cake,
  Flag,
  Crown,
} from 'lucide-react';
import { useState, type ComponentType } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface AdminNavigationProps {
  adminUser: string | null;
  onLogout: () => void;
}

export function AdminNavigation({
  adminUser,
  onLogout,
}: AdminNavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Derive current page from URL path
  const pathSegment = location.pathname.replace('/admin', '').replace('/', '');
  const currentPage = pathSegment || 'dashboard';

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'home-content', label: 'Home Content', icon: Home },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'notices', label: 'Notices', icon: Bell },
    { id: 'birthdays', label: 'Birthdays', icon: Cake },
    { id: 'gallery', label: 'Gallery', icon: Image },
    { id: 'contacts', label: 'Messages', icon: Mail },
    { id: 'admissions', label: 'Admissions', icon: UserPlus },
    { id: 'school-houses', label: 'School Houses', icon: Flag },
    { id: 'school-leaders', label: 'School Leaders', icon: Crown },
  ];

  const handleNavigate = (page: string) => {
    const path = page === 'dashboard' ? '/admin' : `/admin/${page}`;
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="admin-mobile-header">
        <div className="admin-mobile-logo">
          <span className="admin-mobile-logo-text">Admin</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="admin-mobile-menu-btn"
        >
          {mobileMenuOpen ? <X className="admin-mobile-menu-icon" /> : <Menu className="admin-mobile-menu-icon" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="admin-mobile-overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside className="admin-sidebar">
        <SidebarContent
          navItems={navItems}
          currentPage={currentPage}
          onNavigate={handleNavigate}
          adminUser={adminUser}
          onLogout={onLogout}
        />
      </aside>

      {/* Mobile Sidebar */}
      <motion.aside
        initial={{ x: '-100%' }}
        animate={{ x: mobileMenuOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="admin-mobile-sidebar"
      >
        <SidebarContent
          navItems={navItems}
          currentPage={currentPage}
          onNavigate={handleNavigate}
          adminUser={adminUser}
          onLogout={onLogout}
        />
      </motion.aside>

      {/* Mobile top padding */}
      <div className="admin-mobile-spacer" />
    </>
  );
}

interface SidebarContentProps {
  navItems: { id: string; label: string; icon: ComponentType<{ className?: string }> }[];
  currentPage: string;
  onNavigate: (page: string) => void;
  adminUser: string | null;
  onLogout: () => void;
}

function SidebarContent({
  navItems,
  currentPage,
  onNavigate,
  adminUser,
  onLogout,
}: SidebarContentProps) {
  return (
    <div className="admin-sidebar-content">
      {/* Logo */}
      <div className="admin-sidebar-logo">
        <div className="admin-sidebar-logo-inner">
          <div className="admin-sidebar-logo-icon">
            <GraduationCap />
          </div>
          <div>
            <h2 className="admin-sidebar-logo-title">FSA</h2>
            <p className="admin-sidebar-logo-subtitle">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="admin-sidebar-nav">
        <p className="admin-sidebar-nav-label">Menu</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`admin-nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon className="admin-nav-item-icon" />
              <span className="admin-nav-item-label">{item.label}</span>
              {isActive && <ChevronRight className="admin-nav-item-chevron" />}
            </motion.button>
          );
        })}
      </nav>

      {/* User & Logout */}
      <div className="admin-sidebar-footer">
        <div className="admin-user-info">
          <div className="admin-user-avatar">
            {adminUser?.charAt(0).toUpperCase()}
          </div>
          <div className="admin-user-details">
            <p className="admin-user-name">{adminUser}</p>
            <p className="admin-user-role">Administrator</p>
          </div>
        </div>
        <button className="admin-logout-btn" onClick={onLogout}>
          <LogOut className="admin-logout-icon" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
