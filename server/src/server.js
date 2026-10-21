require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB, then start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`  AdmitWise Server Running`);
      console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`  Port:        ${PORT}`);
      console.log(`  API Base:    http://localhost:${PORT}/api`);
      console.log(`  Health:      http://localhost:${PORT}/api/health`);
      console.log(`====================================================`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize server:', err.message);
  });
