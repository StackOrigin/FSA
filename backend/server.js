const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
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
  console.log('');
  console.log('═══════════════════════════════════════════');
  console.log('   🏫 Future Stars School Website Backend');
  console.log('═══════════════════════════════════════════');
  
  // Initialize database
  const dbReady = await initDb();
  
  if (!dbReady) {
    console.error('');
    console.error('⚠️  Server starting without database connection.');
    console.error('   Some features may not work properly.');
    console.error('');
  }

  // Use routes
  app.use('/api', apiRoutes);

  // Health check route
  app.get('/', (req, res) => {
    res.json({ 
      message: 'School Website Backend API is running!',
      status: 'healthy',
      timestamp: new Date().toISOString()
    });
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Something went wrong!' });
  });

  // Start server
  app.listen(PORT, () => {
    console.log('');
    console.log('═══════════════════════════════════════════');
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log('═══════════════════════════════════════════');
    console.log('');
    console.log('Available endpoints:');
    console.log(`  📋 API:     http://localhost:${PORT}/api`);
    console.log(`  🖼️  Uploads: http://localhost:${PORT}/uploads`);
    console.log('');
  });
};

startServer();
