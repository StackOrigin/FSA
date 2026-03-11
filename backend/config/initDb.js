const { connectDB } = require('./db');

// Import all models
const Event = require('../models/Event');
const SiteContent = require('../models/SiteContent');
const Notice = require('../models/Notice');
const SchoolHouse = require('../models/SchoolHouse');
const SchoolLeader = require('../models/SchoolLeader');

const initDatabase = async () => {
  console.log('');
  console.log('🚀 Starting database initialization...');
  console.log('');

  // Connect to MongoDB
  const connected = await connectDB();
  if (!connected) {
    console.error('❌ Cannot initialize database - connection failed');
    return false;
  }

  try {
    console.log('✅ MongoDB collections will be auto-created by Mongoose');
    console.log('');

    // ==========================================
    // SEED INITIAL DATA (only if collections are empty)
    // ==========================================

    console.log('📦 Checking and seeding initial data...');

    // Seed sample events
    const eventCount = await Event.countDocuments();
    if (eventCount === 0) {
      await Event.insertMany([
        {
          title: 'Annual Sports Day',
          description: 'Join us for our annual sports day celebration with exciting competitions and activities for all students.',
          event_date: new Date('2026-02-15'),
          event_time: '9:00 AM',
          location: 'School Grounds',
          category: 'Sports',
          image_url: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
          gradient: 'from-orange-500 to-red-500',
          is_featured: true,
        },
        {
          title: 'Parent-Teacher Meeting',
          description: 'Quarterly parent-teacher conference to discuss student progress and development.',
          event_date: new Date('2026-02-20'),
          event_time: '2:00 PM',
          location: 'School Auditorium',
          category: 'Community',
          image_url: null,
          gradient: 'from-blue-500 to-cyan-500',
          is_featured: false,
        },
        {
          title: 'Science Fair',
          description: 'Students showcase their innovative science projects and experiments.',
          event_date: new Date('2026-03-10'),
          event_time: '10:00 AM',
          location: 'Main Hall',
          category: 'Academic',
          image_url: 'https://images.unsplash.com/photo-1602052577122-f73b9710adba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
          gradient: 'from-blue-500 to-cyan-500',
          is_featured: true,
        },
      ]);
      console.log('  ✅ Sample events added');
    } else {
      console.log('  ℹ️  Events already exist, skipping seed');
    }

    // Seed home content
    const homeExists = await SiteContent.findOne({ key: 'home' });
    if (!homeExists) {
      await SiteContent.create({
        key: 'home',
        content: {
          stats: [
            { id: 1, value: 700, suffix: '+', label: 'Students', icon: 'Users' },
            { id: 2, value: 30, suffix: '+', label: 'Expert Teachers', icon: 'BookOpen' },
            { id: 3, value: 95, suffix: '%', label: 'Success Rate', icon: 'Award' },
            { id: 4, value: 24, suffix: '+', label: 'Years of Trust', icon: 'Globe' },
          ],
          features: [
            {
              title: 'Modern Curriculum',
              description: "Cutting-edge courses designed for the digital age, preparing students for tomorrow's challenges.",
              gradient: 'from-blue-500 to-cyan-500',
              image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
            },
            {
              title: 'Expert Educators',
              description: 'Learn from passionate teachers who inspire curiosity and foster critical thinking.',
              gradient: 'from-purple-500 to-pink-500',
              image: 'https://images.unsplash.com/photo-1655800466797-8ab2598b4274?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
            },
            {
              title: 'State-of-the-Art Facilities',
              description: 'World-class laboratories, studios, and technology that bring learning to life.',
              gradient: 'from-orange-500 to-red-500',
              image: 'https://images.unsplash.com/photo-1602052577122-f73b9710adba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
            },
          ],
          testimonials: [
            {
              name: 'Sarah Johnson',
              role: 'Parent',
              content: "The transformation in my daughter has been incredible. She's more confident, curious, and excited about learning than ever before.",
              avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
            },
            {
              name: 'Michael Chen',
              role: 'Alumni',
              content: 'This school gave me the foundation I needed to succeed. The skills and values I learned here continue to guide me every day.',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
            },
            {
              name: 'Emily Rodriguez',
              role: 'Teacher',
              content: 'Teaching here is a joy. The support, resources, and collaborative environment make it possible to truly make a difference.',
              avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
            },
          ],
        },
      });
      console.log('  ✅ Home page content added');
    } else {
      console.log('  ℹ️  Home content already exists, skipping seed');
    }

    // Seed contact content
    const contactExists = await SiteContent.findOne({ key: 'contact' });
    if (!contactExists) {
      await SiteContent.create({
        key: 'contact',
        content: {
          cards: [
            { icon: 'Phone', title: 'Phone', details: ['015580754', '9761692981','9841281367'], color: 'from-blue-500 to-cyan-500' },
            { icon: 'Mail', title: 'Email', details: ['futurestarsacd@gmail.com'], color: 'from-purple-500 to-violet-500' },
            { icon: 'MapPin', title: 'Address', details: ['Lubhu, Lalitpur'], color: 'from-pink-500 to-rose-500' },
            { icon: 'Clock', title: 'Office Hours', details: ['Sun - Fri: 9:00 AM - 4:00 PM'], color: 'from-orange-500 to-amber-500' },
          ],
        },
      });
      console.log('  ✅ Contact page content added');
    } else {
      console.log('  ℹ️  Contact content already exists, skipping seed');
    }

    // Seed events_news content
    const newsExists = await SiteContent.findOne({ key: 'events_news' });
    if (!newsExists) {
      await SiteContent.create({
        key: 'events_news',
        content: {
          newsItems: [
            {
              date: 'January 10, 2026',
              title: 'FutureSchool Wins National Robotics Championship',
              excerpt: 'Our robotics team secured first place at the National Robotics Competition, showcasing exceptional engineering skills and teamwork.',
              image: 'https://images.unsplash.com/photo-1655800466797-8ab2598b4274?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
            },
            {
              date: 'January 5, 2026',
              title: 'New STEM Building Opens',
              excerpt: 'We are thrilled to unveil our state-of-the-art STEM facility, featuring cutting-edge laboratories and innovation spaces.',
              image: 'https://images.unsplash.com/photo-1760510088582-3ca0631ad84f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
            },
            {
              date: 'December 15, 2025',
              title: 'Students Raise $50,000 for Local Charity',
              excerpt: 'Through various fundraising initiatives, our students demonstrated incredible compassion and community spirit.',
              image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
            },
          ],
        },
      });
      console.log('  ✅ Events & News content added');
    } else {
      console.log('  ℹ️  Events/News content already exists, skipping seed');
    }

    // Seed sample notices
    const noticeCount = await Notice.countDocuments();
    if (noticeCount === 0) {
      await Notice.insertMany([
        {
          title: 'Mid-Term Examination Schedule',
          description: 'The mid-term examinations will commence from March 1st, 2026. Students are required to check their individual schedules on the school portal. Make sure to prepare well and follow the examination guidelines.',
          category: 'Exam',
          priority: 'high',
          image_url: '/images/vacancy3.jpg',
          download_url: '#',
          created_at: new Date('2026-02-05'),
        },
        {
          title: 'Annual Sports Day Event',
          description: 'Annual Sports Day will be held on February 20th, 2026. All students are encouraged to participate in various sporting activities. Registration forms are available at the sports office.',
          category: 'Event',
          priority: 'medium',
          image_url: '/images/vacancy3.jpg',
          download_url: '#',
          created_at: new Date('2026-02-04'),
        },
        {
          title: 'Library Hours Extended',
          description: 'Library will remain open until 8 PM during the examination period starting from February 15th. Students can utilize this extended time for study and research purposes.',
          category: 'Administrative',
          priority: 'low',
          image_url: null,
          download_url: '#',
          created_at: new Date('2026-02-03'),
        },
        {
          title: 'Parent-Teacher Meeting',
          description: 'Parent-teacher meetings are scheduled for all grades on February 15th, 2026. Parents are requested to attend and discuss their child\'s academic progress with respective class teachers.',
          category: 'Academic',
          priority: 'high',
          image_url: '/images/vacancy.jpg',
          download_url: '#',
          created_at: new Date('2026-02-02'),
        },
        {
          title: 'Holiday Notice - Maha Shivaratri',
          description: 'The school will remain closed on February 26th, 2026, on the occasion of Maha Shivaratri. Regular classes will resume on February 27th, 2026.',
          category: 'Holiday',
          priority: 'medium',
          image_url: null,
          download_url: '#',
          created_at: new Date('2026-02-01'),
        },
        {
          title: 'Science Exhibition Registration',
          description: 'Registration is now open for the Annual Science Exhibition scheduled for March 15th, 2026. Students interested in participating should submit their project proposals by February 12th. Last date for registration.',
          category: 'Academic',
          priority: 'medium',
          image_url: null,
          download_url: '#',
          created_at: new Date('2026-01-30'),
        },
      ]);
      console.log('  ✅ Sample notices added');
    } else {
      console.log('  ℹ️  Notices already exist, skipping seed');
    }

    // Seed school houses
    const houseCount = await SchoolHouse.countDocuments();
    if (houseCount === 0) {
      await SchoolHouse.insertMany([
        { name: 'Red House', color: '#EF4444', border: 'rgba(239, 68, 68, 0.3)', captain_name: 'Bisakha', vice_captain_name: 'Rusab', sort_order: 1 },
        { name: 'Green House', color: '#22C55E', border: 'rgba(34, 197, 94, 0.3)', captain_name: 'Ananta', vice_captain_name: 'Deepraj', sort_order: 2 },
        { name: 'Blue House', color: '#3B82F6', border: 'rgba(59, 130, 246, 0.3)', captain_name: 'Swekshya', vice_captain_name: 'Suprim', sort_order: 3 },
        { name: 'Yellow House', color: '#EAB308', border: 'rgba(234, 179, 8, 0.3)', captain_name: 'Samar', vice_captain_name: 'Ankit', sort_order: 4 },
      ]);
      console.log('  ✅ School houses added');
    } else {
      console.log('  ℹ️  School houses already exist, skipping seed');
    }

    // Seed school leaders
    const leaderCount = await SchoolLeader.countDocuments();
    if (leaderCount === 0) {
      await SchoolLeader.insertMany([
        { role: 'Captain', name: 'Sabin', color: '#6366F1', sort_order: 1 },
        { role: 'Vice Captain', name: 'Ritika', color: '#8B5CF6', sort_order: 2 },
        { role: 'School Prefect (Girl)', name: 'Anuska', color: '#EC4899', sort_order: 3 },
        { role: 'School Prefect (Boy)', name: 'Supun', color: '#3B82F6', sort_order: 4 },
        { role: 'School Representative', name: 'Salina', color: '#10B981', sort_order: 5 },
      ]);
      console.log('  ✅ School leaders added');
    } else {
      console.log('  ℹ️  School leaders already exist, skipping seed');
    }

    console.log('');
    console.log('═══════════════════════════════════════════');
    console.log('✅ Database initialization complete!');
    console.log('═══════════════════════════════════════════');
    console.log('');

    return true;
  } catch (error) {
    console.error('');
    console.error('❌ Error initializing database:', error.message);
    console.error('');
    return false;
  }
};

// Allow running directly: node config/initDb.js
if (require.main === module) {
  initDatabase().then((success) => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = initDatabase;
