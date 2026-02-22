import { motion } from 'motion/react';
import {
  Calendar,
  Image,
  Mail,
  UserPlus,
  TrendingUp,
  Users,
  ArrowRight,
  Sparkles,
  Home,
  Bell,
  Cake,
  Flag,
  Crown,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

interface Stats {
  events: number;
  gallery: number;
  contacts: number;
  admissions: number;
  notices: number;
  birthdays: number;
  schoolHouses: number;
  schoolLeaders: number;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [stats, setStats] = useState<Stats>({
    events: 0,
    gallery: 0,
    contacts: 0,
    admissions: 0,
    notices: 0,
    birthdays: 0,
    schoolHouses: 0,
    schoolLeaders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [eventsRes, contactsRes, admissionsRes, galleryRes, noticesRes, birthdaysRes, housesRes, leadersRes] = await Promise.all([
        fetch('/api/events'),
        fetch('/api/contact'),
        fetch('/api/admissions'),
        fetch('/api/gallery'),
        fetch('/api/notices'),
        fetch('/api/birthdays'),
        fetch('/api/school-houses'),
        fetch('/api/school-leaders'),
      ]);

      const events = await eventsRes.json();
      const contacts = await contactsRes.json();
      const admissions = await admissionsRes.json();
      const gallery = await galleryRes.json();
      const notices = await noticesRes.json();
      const birthdays = await birthdaysRes.json();
      const schoolHouses = await housesRes.json();
      const schoolLeaders = await leadersRes.json();

      setStats({
        events: Array.isArray(events) ? events.length : 0,
        gallery: Array.isArray(gallery) ? gallery.length : 0,
        contacts: Array.isArray(contacts) ? contacts.length : 0,
        admissions: Array.isArray(admissions) ? admissions.length : 0,
        notices: Array.isArray(notices) ? notices.length : 0,
        birthdays: Array.isArray(birthdays) ? birthdays.length : 0,
        schoolHouses: Array.isArray(schoolHouses) ? schoolHouses.length : 0,
        schoolLeaders: Array.isArray(schoolLeaders) ? schoolLeaders.length : 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      id: 'events',
      title: 'Total Events',
      value: stats.events,
      icon: Calendar,
      gradient: 'linear-gradient(to bottom right, #3b82f6, #22d3ee)',
      iconBg: '#3b82f6',
    },
    {
      id: 'notices',
      title: 'Active Notices',
      value: stats.notices,
      icon: Bell,
      gradient: 'linear-gradient(to bottom right, #eab308, #f59e0b)',
      iconBg: '#eab308',
    },
    {
      id: 'gallery',
      title: 'Gallery Images',
      value: stats.gallery,
      icon: Image,
      gradient: 'linear-gradient(to bottom right, #a855f7, #ec4899)',
      iconBg: '#a855f7',
    },
    {
      id: 'contacts',
      title: 'Messages',
      value: stats.contacts,
      icon: Mail,
      gradient: 'linear-gradient(to bottom right, #f97316, #fbbf24)',
      iconBg: '#f97316',
    },
    {
      id: 'admissions',
      title: 'Applications',
      value: stats.admissions,
      icon: UserPlus,
      gradient: 'linear-gradient(to bottom right, #10b981, #14b8a6)',
      iconBg: '#10b981',
    },
    {
      id: 'birthdays',
      title: 'Birthdays',
      value: stats.birthdays,
      icon: Cake,
      gradient: 'linear-gradient(to bottom right, #ec4899, #f43f5e)',
      iconBg: '#ec4899',
    },
    {
      id: 'school-houses',
      title: 'School Houses',
      value: stats.schoolHouses,
      icon: Flag,
      gradient: 'linear-gradient(to bottom right, #ef4444, #f97316)',
      iconBg: '#ef4444',
    },
    {
      id: 'school-leaders',
      title: 'School Leaders',
      value: stats.schoolLeaders,
      icon: Crown,
      gradient: 'linear-gradient(to bottom right, #6366f1, #8b5cf6)',
      iconBg: '#6366f1',
    },
  ];

  const quickActions = [
    { id: 'home-content', label: 'Edit Home Page', icon: Home, gradient: 'linear-gradient(to bottom right, #6366f1, #a855f7)' },
    { id: 'events', label: 'Add Event', icon: Calendar, gradient: 'linear-gradient(to bottom right, #3b82f6, #06b6d4)' },
    { id: 'notices', label: 'Post Notice', icon: Bell, gradient: 'linear-gradient(to bottom right, #eab308, #f59e0b)' },
    { id: 'gallery', label: 'Upload Image', icon: Image, gradient: 'linear-gradient(to bottom right, #a855f7, #ec4899)' },
    { id: 'contacts', label: 'View Messages', icon: Mail, gradient: 'linear-gradient(to bottom right, #f97316, #fbbf24)' },
    { id: 'admissions', label: 'Review Applications', icon: UserPlus, gradient: 'linear-gradient(to bottom right, #10b981, #14b8a6)' },
    { id: 'birthdays', label: 'Manage Birthdays', icon: Cake, gradient: 'linear-gradient(to bottom right, #ec4899, #f43f5e)' },
    { id: 'school-houses', label: 'Manage Houses', icon: Flag, gradient: 'linear-gradient(to bottom right, #ef4444, #f97316)' },
    { id: 'school-leaders', label: 'Manage Leaders', icon: Crown, gradient: 'linear-gradient(to bottom right, #6366f1, #8b5cf6)' },
  ];

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="admin-dashboard-header">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="admin-dashboard-title"
          >
            Dashboard
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="admin-dashboard-subtitle"
          >
            Welcome back! Here's an overview of your school website.
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="admin-dashboard-date"
        >
          <span className="admin-dashboard-date-text">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </span>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="admin-stats-grid">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div
                className="admin-stat-card"
                onClick={() => onNavigate(stat.id)}
              >
                <div className="admin-stat-card-gradient" style={{ background: stat.gradient }} />
                <div className="admin-stat-card-content">
                  <div className="admin-stat-card-header">
                    <div>
                      <p className="admin-stat-card-label">{stat.title}</p>
                      <p className="admin-stat-card-value">
                        {loading ? (
                          <span className="admin-stat-card-loading" />
                        ) : (
                          stat.value
                        )}
                      </p>
                    </div>
                    <div
                      className="admin-stat-card-icon"
                      style={{ backgroundColor: stat.iconBg }}
                    >
                      <Icon />
                    </div>
                  </div>
                  <div className="admin-stat-card-footer">
                    <span>View details</span>
                    <ArrowRight className="admin-stat-card-arrow" />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="admin-quick-actions"
      >
        <h2 className="admin-quick-actions-title">Quick Actions</h2>
        <div className="admin-quick-actions-grid">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate(action.id)}
                className="admin-quick-action-btn"
              >
                <div
                  className="admin-quick-action-icon"
                  style={{ background: action.gradient }}
                >
                  <Icon />
                </div>
                <span className="admin-quick-action-label">{action.label}</span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Info Cards */}
      <div className="admin-info-cards">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="admin-info-card">
            <div className="admin-info-card-header">
              <div className="admin-info-card-icon" style={{ background: 'linear-gradient(to bottom right, #3b82f6, #06b6d4)' }}>
                <TrendingUp />
              </div>
              <h3 className="admin-info-card-title">Website Overview</h3>
            </div>
            <p className="admin-info-card-text">
              Manage your school website content from this dashboard. Add events, 
              upload gallery images, respond to contact inquiries, and process 
              admission applications all in one place.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="admin-info-card">
            <div className="admin-info-card-header">
              <div className="admin-info-card-icon" style={{ background: 'linear-gradient(to bottom right, #10b981, #14b8a6)' }}>
                <Users />
              </div>
              <h3 className="admin-info-card-title">Need Help?</h3>
            </div>
            <p className="admin-info-card-text">
              Use the navigation menu on the left to access different sections. 
              Each section allows you to create, view, edit, and delete content 
              for the school website.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
