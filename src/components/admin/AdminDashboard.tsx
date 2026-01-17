import { motion } from 'motion/react';
import { Card } from '../ui/card';
import {
  Calendar,
  Image,
  Mail,
  UserPlus,
  TrendingUp,
  Users,
  Eye,
  ArrowRight,
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
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
    },
    {
      id: 'gallery',
      title: 'Gallery Images',
      value: stats.gallery,
      icon: Image,
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
    },
    {
      id: 'contacts',
      title: 'Contact Messages',
      value: stats.contacts,
      icon: Mail,
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20',
    },
    {
      id: 'admissions',
      title: 'Applications',
      value: stats.admissions,
      icon: UserPlus,
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
    },
  ];

  const quickActions = [
    { id: 'events', label: 'Add Event', icon: Calendar, color: 'bg-blue-500' },
    { id: 'gallery', label: 'Upload Image', icon: Image, color: 'bg-purple-500' },
    { id: 'contacts', label: 'View Messages', icon: Mail, color: 'bg-orange-500' },
    { id: 'admissions', label: 'Review Applications', icon: UserPlus, color: 'bg-green-500' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Welcome back! Here's an overview of your school website.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                className={`p-6 cursor-pointer hover:shadow-lg transition-all bg-gradient-to-br ${stat.bgGradient}`}
                onClick={() => onNavigate(stat.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">
                      {loading ? '...' : stat.value}
                    </p>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.gradient} flex items-center justify-center`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="flex items-center mt-4 text-sm text-gray-500 dark:text-gray-400">
                  <ArrowRight className="w-4 h-4 mr-1" />
                  <span>View details</span>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                onClick={() => onNavigate(action.id)}
                className="flex flex-col items-center gap-3 p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all"
              >
                <div
                  className={`w-12 h-12 rounded-full ${action.color} flex items-center justify-center`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {action.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Website Overview
            </h3>
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your school website content from this dashboard. Add events, 
            upload gallery images, respond to contact inquiries, and process 
            admission applications all in one place.
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Need Help?
            </h3>
          </div>
          <p className="text-gray-500 dark:text-gray-400">
            Use the navigation menu on the left to access different sections. 
            Each section allows you to create, view, edit, and delete content 
            for the school website.
          </p>
        </Card>
      </div>
    </div>
  );
}
