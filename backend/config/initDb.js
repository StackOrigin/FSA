const { pool, testConnection } = require('./db');

const createTables = async () => {
  console.log('');
  console.log('🚀 Starting database initialization...');
  console.log('');

  // Test connection first
  const connected = await testConnection();
  if (!connected) {
    console.error('❌ Cannot initialize database - connection failed');
    return false;
  }

  try {
    // ==========================================
    // CREATE ALL TABLES
    // ==========================================

    // 1. Create contacts table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        subject VARCHAR(255) DEFAULT 'General Inquiry',
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Contacts table ready');

    // Ensure columns exist for existing installations
    await pool.query('ALTER TABLE contacts ADD COLUMN IF NOT EXISTS phone VARCHAR(50)');
    await pool.query("ALTER TABLE contacts ADD COLUMN IF NOT EXISTS subject VARCHAR(255) DEFAULT 'General Inquiry'");

    // 2. Create events table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        event_date DATE NOT NULL,
        event_time VARCHAR(50) DEFAULT 'TBA',
        location VARCHAR(255) DEFAULT 'TBA',
        category VARCHAR(100) DEFAULT 'Community',
        image_url TEXT,
        gradient VARCHAR(100),
        is_featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Events table ready');

    // Ensure columns exist for existing installations
    await pool.query("ALTER TABLE events ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT 'Community'");
    await pool.query('ALTER TABLE events ADD COLUMN IF NOT EXISTS image_url TEXT');
    await pool.query('ALTER TABLE events ADD COLUMN IF NOT EXISTS gradient VARCHAR(100)');
    await pool.query('ALTER TABLE events ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE');

    // 3. Create site content table (simple CMS)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS site_content (
        key VARCHAR(100) PRIMARY KEY,
        content JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Site content table ready');

    // 4. Create admissions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admissions (
        id SERIAL PRIMARY KEY,
        student_name VARCHAR(255) NOT NULL,
        parent_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50) NOT NULL,
        grade_applying VARCHAR(50) NOT NULL,
        message TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Admissions table ready');

    // 5. Create gallery table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS gallery (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        image_url TEXT NOT NULL,
        category VARCHAR(100),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Gallery table ready');

    // 6. Create notices table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notices (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        category VARCHAR(100) DEFAULT 'General',
        priority VARCHAR(50) DEFAULT 'medium',
        image_url TEXT,
        download_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Notices table ready');

    // 7. Create birthdays table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS birthdays (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL,
        birth_date DATE NOT NULL,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await pool.query('ALTER TABLE birthdays ADD COLUMN IF NOT EXISTS image_url TEXT');
    console.log('✅ Birthdays table ready');

    // ==========================================
    // SEED INITIAL DATA (only if tables are empty)
    // ==========================================

    console.log('');
    console.log('📦 Checking and seeding initial data...');

    // Seed sample events
    const checkEvents = await pool.query('SELECT COUNT(*) FROM events');
    if (parseInt(checkEvents.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO events (title, description, event_date, event_time, location, category, image_url, gradient, is_featured)
        VALUES 
          ('Annual Sports Day', 'Join us for our annual sports day celebration with exciting competitions and activities for all students.', '2026-02-15', '9:00 AM', 'School Grounds', 'Sports', 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', 'from-orange-500 to-red-500', TRUE),
          ('Parent-Teacher Meeting', 'Quarterly parent-teacher conference to discuss student progress and development.', '2026-02-20', '2:00 PM', 'School Auditorium', 'Community', NULL, 'from-blue-500 to-cyan-500', FALSE),
          ('Science Fair', 'Students showcase their innovative science projects and experiments.', '2026-03-10', '10:00 AM', 'Main Hall', 'Academic', 'https://images.unsplash.com/photo-1602052577122-f73b9710adba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', 'from-blue-500 to-cyan-500', TRUE)
      `);
      console.log('  ✅ Sample events added');
    } else {
      console.log('  ℹ️  Events already exist, skipping seed');
    }

    // Helper function to upsert content
    const upsertContent = async (key, content) => {
      await pool.query(
        `INSERT INTO site_content (key, content)
         VALUES ($1, $2)
         ON CONFLICT (key) DO NOTHING`,
        [key, content]
      );
    };

    // Check if home content exists
    const checkHome = await pool.query("SELECT COUNT(*) FROM site_content WHERE key = 'home'");
    if (parseInt(checkHome.rows[0].count) === 0) {
      await upsertContent('home', {
        stats: [
          { id: 1, value: 2500, suffix: '+', label: 'Students', icon: 'Users' },
          { id: 2, value: 150, suffix: '+', label: 'Expert Teachers', icon: 'BookOpen' },
          { id: 3, value: 95, suffix: '%', label: 'Success Rate', icon: 'Award' },
          { id: 4, value: 30, suffix: '+', label: 'Countries', icon: 'Globe' }
        ],
        features: [
          {
            title: 'Modern Curriculum',
            description: "Cutting-edge courses designed for the digital age, preparing students for tomorrow's challenges.",
            gradient: 'from-blue-500 to-cyan-500',
            image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
          },
          {
            title: 'Expert Educators',
            description: 'Learn from passionate teachers who inspire curiosity and foster critical thinking.',
            gradient: 'from-purple-500 to-pink-500',
            image: 'https://images.unsplash.com/photo-1655800466797-8ab2598b4274?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
          },
          {
            title: 'State-of-the-Art Facilities',
            description: 'World-class laboratories, studios, and technology that bring learning to life.',
            gradient: 'from-orange-500 to-red-500',
            image: 'https://images.unsplash.com/photo-1602052577122-f73b9710adba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
          }
        ],
        testimonials: [
          {
            name: 'Sarah Johnson',
            role: 'Parent',
            content: "The transformation in my daughter has been incredible. She's more confident, curious, and excited about learning than ever before.",
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop'
          },
          {
            name: 'Michael Chen',
            role: 'Alumni',
            content: 'This school gave me the foundation I needed to succeed. The skills and values I learned here continue to guide me every day.',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop'
          },
          {
            name: 'Emily Rodriguez',
            role: 'Teacher',
            content: 'Teaching here is a joy. The support, resources, and collaborative environment make it possible to truly make a difference.',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop'
          }
        ]
      });
      console.log('  ✅ Home page content added');
    } else {
      console.log('  ℹ️  Home content already exists, skipping seed');
    }

    // Check if contact content exists
    const checkContact = await pool.query("SELECT COUNT(*) FROM site_content WHERE key = 'contact'");
    if (parseInt(checkContact.rows[0].count) === 0) {
      await upsertContent('contact', {
        cards: [
          {
            icon: 'Phone',
            title: 'Phone',
            details: ['+1 (555) 123-4567', '+1 (555) 987-6543'],
            color: 'from-blue-500 to-cyan-500'
          },
          {
            icon: 'Mail',
            title: 'Email',
            details: ['info@futureschool.edu', 'admissions@futureschool.edu'],
            color: 'from-purple-500 to-violet-500'
          },
          {
            icon: 'MapPin',
            title: 'Address',
            details: ['123 Education Lane', 'Innovation City, ST 12345'],
            color: 'from-pink-500 to-rose-500'
          },
          {
            icon: 'Clock',
            title: 'Office Hours',
            details: ['Mon - Fri: 8:00 AM - 5:00 PM', 'Sat: 9:00 AM - 2:00 PM'],
            color: 'from-orange-500 to-amber-500'
          }
        ]
      });
      console.log('  ✅ Contact page content added');
    } else {
      console.log('  ℹ️  Contact content already exists, skipping seed');
    }

    // Check if events_news content exists
    const checkNews = await pool.query("SELECT COUNT(*) FROM site_content WHERE key = 'events_news'");
    if (parseInt(checkNews.rows[0].count) === 0) {
      await upsertContent('events_news', {
        newsItems: [
          {
            date: 'January 10, 2026',
            title: 'FutureSchool Wins National Robotics Championship',
            excerpt: 'Our robotics team secured first place at the National Robotics Competition, showcasing exceptional engineering skills and teamwork.',
            image: 'https://images.unsplash.com/photo-1655800466797-8ab2598b4274?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
          },
          {
            date: 'January 5, 2026',
            title: 'New STEM Building Opens',
            excerpt: 'We are thrilled to unveil our state-of-the-art STEM facility, featuring cutting-edge laboratories and innovation spaces.',
            image: 'https://images.unsplash.com/photo-1760510088582-3ca0631ad84f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
          },
          {
            date: 'December 15, 2025',
            title: 'Students Raise $50,000 for Local Charity',
            excerpt: 'Through various fundraising initiatives, our students demonstrated incredible compassion and community spirit.',
            image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080'
          }
        ]
      });
      console.log('  ✅ Events & News content added');
    } else {
      console.log('  ℹ️  Events/News content already exists, skipping seed');
    }

    // Seed sample notices
    const checkNotices = await pool.query('SELECT COUNT(*) FROM notices');
    if (parseInt(checkNotices.rows[0].count) === 0) {
      await pool.query(`
        INSERT INTO notices (title, description, category, priority, image_url, download_url, created_at)
        VALUES 
          (
            'Mid-Term Examination Schedule',
            'The mid-term examinations will commence from March 1st, 2026. Students are required to check their individual schedules on the school portal. Make sure to prepare well and follow the examination guidelines.',
            'Exam',
            'high',
            '/images/vacancy3.jpg',
            '#',
            '2026-02-05'
          ),
          (
            'Annual Sports Day Event',
            'Annual Sports Day will be held on February 20th, 2026. All students are encouraged to participate in various sporting activities. Registration forms are available at the sports office.',
            'Event',
            'medium',
            '/images/vacancy3.jpg',
            '#',
            '2026-02-04'
          ),
          (
            'Library Hours Extended',
            'Library will remain open until 8 PM during the examination period starting from February 15th. Students can utilize this extended time for study and research purposes.',
            'Administrative',
            'low',
            NULL,
            '#',
            '2026-02-03'
          ),
          (
            'Parent-Teacher Meeting',
            'Parent-teacher meetings are scheduled for all grades on February 15th, 2026. Parents are requested to attend and discuss their child''s academic progress with respective class teachers.',
            'Academic',
            'high',
            '/images/vacancy.jpg',
            '#',
            '2026-02-02'
          ),
          (
            'Holiday Notice - Maha Shivaratri',
            'The school will remain closed on February 26th, 2026, on the occasion of Maha Shivaratri. Regular classes will resume on February 27th, 2026.',
            'Holiday',
            'medium',
            NULL,
            '#',
            '2026-02-01'
          ),
          (
            'Science Exhibition Registration',
            'Registration is now open for the Annual Science Exhibition scheduled for March 15th, 2026. Students interested in participating should submit their project proposals by February 12th. Last date for registration.',
            'Academic',
            'medium',
            NULL,
            '#',
            '2026-01-30'
          )
      `);
      console.log('  ✅ Sample notices added');
    } else {
      console.log('  ℹ️  Notices already exist, skipping seed');
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
  createTables().then((success) => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = createTables;
