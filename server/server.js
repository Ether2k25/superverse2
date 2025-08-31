require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');
const { createDirectoryIfNotExists } = require('./utils/fileSystem');
const config = require('./config/config');
const { globalErrorHandler } = require('./middleware/error');

// Create Express app
const app = express();

// 1) GLOBAL MIDDLEWARES

// Set security HTTP headers
app.use(helmet());

// Enable CORS
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
  })
);

// Development logging
if (config.isDevelopment) {
  app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
  max: config.rateLimit.max,
  windowMs: config.rateLimit.windowMs,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  })
);

// Compression middleware
app.use(compression());

// Create uploads directory if it doesn't exist
createDirectoryIfNotExists(path.join(__dirname, 'uploads'));

// 2) ROUTES
// API Documentation
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Welcome to ICE SUPER Blog API',
    documentation: `${req.protocol}://${req.get('host')}${config.api.prefix}/docs`,
    version: config.api.version,
  });
});

// API Routes
app.use(`${config.api.prefix}`, require('./routes/api/v1'));

// Serve static files in production
if (config.isProduction) {
  // Set static folder
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
  });
}

// 3) ERROR HANDLING
// Handle 404 - Route not found
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

// Global error handling middleware
app.use(globalErrorHandler);

// 4) START SERVER
const PORT = config.port || 5000;

// Connect to MongoDB and start the server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s for local dev
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });
    console.log('✅ MongoDB connected successfully');

    // Start the server
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT} in ${config.env} mode`);
      console.log(`📄 API Documentation: http://localhost:${PORT}${config.api.prefix}/docs`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.error('UNHANDLED REJECTION! 💥 Shutting down...');
      console.error(err.name, err.message);
      server.close(() => {
        process.exit(1);
      });
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// Start the application
console.log('Starting server...');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('MongoDB URI:', process.env.MONGODB_URI);

startServer().catch(err => {
  console.error('Error starting server:', err);
  process.exit(1);
});

module.exports = app;
