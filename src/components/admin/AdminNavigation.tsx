import { motion } from 'motion/react';
import { Button } from '../ui/button';
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
} from 'lucide-react';
import { useState, type ComponentType } from 'react';

interface AdminNavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  adminUser: string | null;
  onLogout: () => void;
}

export function AdminNavigation({
  currentPage,
  onNavigate,
  adminUser,
  onLogout,
}: AdminNavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'home-content', label: 'Home Content', icon: Home },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'gallery', label: 'Gallery', icon: Image },
    { id: 'contacts', label: 'Messages', icon: Mail },
    { id: 'admissions', label: 'Admissions', icon: UserPlus },
  ];

  const handleNavigate = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Admin</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block fixed top-0 left-0 h-full w-72 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 z-30">
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
        className="lg:hidden fixed top-0 left-0 h-full w-72 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-gray-700 z-50 shadow-2xl"
        style={{ backgroundColor: 'white' }}
      >
        <div className="h-full bg-white dark:bg-slate-900">
          <SidebarContent
            navItems={navItems}
            currentPage={currentPage}
            onNavigate={handleNavigate}
            adminUser={adminUser}
            onLogout={onLogout}
          />
        </div>
      </motion.aside>

      {/* Mobile top padding */}
      <div className="lg:hidden h-16" />
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
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-xl text-gray-900 dark:text-white">
              FutureSchool
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Admin Panel
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2 space-y-1.5 overflow-y-auto">
        <p className="px-4 py-2 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
          Menu
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-blue-500'}`} />
              <span className="font-medium flex-1 text-left">{item.label}</span>
              {isActive && <ChevronRight className="w-4 h-4 text-white/70" />}
            </motion.button>
          );
        })}
      </nav>

      {/* User & Logout */}
      <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-xl bg-gray-50 dark:bg-gray-800/50">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
            {adminUser?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {adminUser}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl h-11"
          onClick={onLogout}
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
