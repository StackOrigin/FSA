import { motion } from 'motion/react';
import { Card } from '../ui/card';
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
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const [stats, setStats] = useState<Stats>({
    events: 0,
    gallery: 0,
    contacts: 0,
    admissions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [eventsRes, contactsRes, admissionsRes, galleryRes] = await Promise.all([
        fetch('/api/events'),
        fetch('/api/contact'),
        fetch('/api/admissions'),
        fetch('/api/gallery'),
      ]);

      const events = await eventsRes.json();
      const contacts = await contactsRes.json();
      const admissions = await admissionsRes.json();
      const gallery = await galleryRes.json();

      setStats({
        events: Array.isArray(events) ? events.length : 0,
        gallery: Array.isArray(gallery) ? gallery.length : 0,
        contacts: Array.isArray(contacts) ? contacts.length : 0,
        admissions: Array.isArray(admissions) ? admissions.length : 0,
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
      gradient: 'from-blue-500 to-cyan-400',
      bgColor: 'bg-blue-500/10',
      iconBg: 'bg-blue-500',
    },
    {
      id: 'gallery',
      title: 'Gallery Images',
      value: stats.gallery,
      icon: Image,
      gradient: 'from-purple-500 to-pink-400',
      bgColor: 'bg-purple-500/10',
      iconBg: 'bg-purple-500',
    },
    {
      id: 'contacts',
      title: 'Messages',
      value: stats.contacts,
      icon: Mail,
      gradient: 'from-orange-500 to-amber-400',
      bgColor: 'bg-orange-500/10',
      iconBg: 'bg-orange-500',
    },
    {
      id: 'admissions',
      title: 'Applications',
      value: stats.admissions,
      icon: UserPlus,
      gradient: 'from-emerald-500 to-teal-400',
      bgColor: 'bg-emerald-500/10',
      iconBg: 'bg-emerald-500',
    },
  ];

  const quickActions = [
    { id: 'home-content', label: 'Edit Home Page', icon: Home, gradient: 'from-indigo-500 to-purple-500' },
    { id: 'events', label: 'Add Event', icon: Calendar, gradient: 'from-blue-500 to-cyan-500' },
    { id: 'gallery', label: 'Upload Image', icon: Image, gradient: 'from-purple-500 to-pink-500' },
    { id: 'contacts', label: 'View Messages', icon: Mail, gradient: 'from-orange-500 to-amber-500' },
    { id: 'admissions', label: 'Review Applications', icon: UserPlus, gradient: 'from-emerald-500 to-teal-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-900 dark:text-white"
          >
            Dashboard
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 dark:text-gray-400 mt-1"
          >
            Welcome back! Here's an overview of your school website.
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20"
        >
          <Sparkles className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </span>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className="relative overflow-hidden cursor-pointer group hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-slate-800"
                onClick={() => onNavigate(stat.id)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {stat.title}
                      </p>
                      <p className="text-4xl font-bold mt-2 text-gray-900 dark:text-white">
                        {loading ? (
                          <span className="inline-block w-16 h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        ) : (
                          stat.value
                        )}
                      </p>
                    </div>
                    <div
                      className={`w-14 h-14 rounded-2xl ${stat.iconBg} flex items-center justify-center shadow-lg`}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center mt-4 text-sm text-gray-500 dark:text-gray-400 group-hover:text-blue-500 transition-colors">
                    <span>View details</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
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
                className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-white dark:bg-slate-800 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all group"
              >
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
                  {action.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6 border-0 bg-white dark:bg-slate-800">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Website Overview
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Manage your school website content from this dashboard. Add events, 
              upload gallery images, respond to contact inquiries, and process 
              admission applications all in one place.
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card className="p-6 border-0 bg-white dark:bg-slate-800">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Need Help?
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Use the navigation menu on the left to access different sections. 
              Each section allows you to create, view, edit, and delete content 
              for the school website.
            </p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
