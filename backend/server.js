const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 30147;
const corsOptions = {
  origin: "https://lunivasthd.me",
  credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import routes
const apiRoutes = require('./routes/api');

// Initialize database tables (auto-creates tables and seeds data)
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
  app.get('/api/health', (req, res) => {
    res.status(200).json({ status: "Backend running successfully" });
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
