const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 30147;
const corsOptions = {
  origin: ["https://lunivastha.me", "https://www.lunivastha.me"],
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import routes
const apiRoutes = require('./routes/api');

// Initialize database (connects to MongoDB, auto-creates collections and seeds data)
const initDb = require('./config/initDb');

// Start server after database initialization
const startServer = async () => {
  if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
  }
  
  // Initialize database
  const dbReady = await initDb();
  if (!dbReady && process.env.NODE_ENV !== "production") {
    console.error('⚠️  Server starting without database connection. Some features may not work properly.');
  }

  // Use routes
  app.use('/api', apiRoutes);

  // Health check route
  const mongoose = require('mongoose');

  // Debug: view all collection counts and data
  app.get('/api/db-overview', async (req, res) => {
    try {
      const Event = require('./models/Event');
      const SiteContent = require('./models/SiteContent');
      const Notice = require('./models/Notice');
      const Contact = require('./models/Contact');
      const Admission = require('./models/Admission');
      const Gallery = require('./models/Gallery');
      const Birthday = require('./models/Birthday');
      const SchoolHouse = require('./models/SchoolHouse');
      const SchoolLeader = require('./models/SchoolLeader');

      const [events, content, notices, contacts, admissions, gallery, birthdays, houses, leaders] = await Promise.all([
        Event.find().sort({ event_date: 1 }),
        SiteContent.find(),
        Notice.find().sort({ created_at: -1 }),
        Contact.find().sort({ created_at: -1 }),
        Admission.find().sort({ created_at: -1 }),
        Gallery.find().sort({ created_at: -1 }),
        Birthday.find(),
        SchoolHouse.find().sort({ sort_order: 1 }),
        SchoolLeader.find().sort({ sort_order: 1 }),
      ]);

      res.json({
        counts: {
          events: events.length,
          siteContent: content.length,
          notices: notices.length,
          contacts: contacts.length,
          admissions: admissions.length,
          gallery: gallery.length,
          birthdays: birthdays.length,
          schoolHouses: houses.length,
          schoolLeaders: leaders.length,
        },
        data: { events, content, notices, contacts, admissions, gallery, birthdays, houses, leaders },
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/health', async (req, res) => {
    const dbState = mongoose.connection.readyState;
    const dbStatus = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
    
    // Test actual DB operations
    let dbTest = null;
    if (dbState === 1) {
      try {
        const Event = require('./models/Event');
        const count = await Event.countDocuments();
        dbTest = { success: true, eventCount: count };
      } catch (err) {
        dbTest = { success: false, error: err.message, code: err.code, codeName: err.codeName };
      }
    }

    // Show the URI being used (mask password)
    const { connectDB, getURI } = require('./config/db');
    let usedURI = '(unknown)';
    try {
      usedURI = getURI().replace(/:([^@:]+)@/, ':****@');
    } catch (e) {
      usedURI = '(error getting URI)';
    }

    // If disconnected, try to reconnect
    let reconnectError = null;
    if (dbState === 0) {
      try {
        await mongoose.connect(getURI());
      } catch (err) {
        reconnectError = err.message;
      }
    }
    
    res.status(200).json({
      status: "Backend running successfully",
      database: dbStatus[mongoose.connection.readyState] || 'unknown',
      uri_used: usedURI,
      dbTest,
      reconnectError,
      node_env: process.env.NODE_ENV,
    });
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    if (process.env.NODE_ENV === "production") {
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.status(500).json({ error: err.message, stack: err.stack });
    }
  });

  // Start server
  app.listen(PORT, () => {
    if (process.env.NODE_ENV !== "production") {
      console.log(`Server running on port ${PORT}`);
    }
  });
};

startServer();
