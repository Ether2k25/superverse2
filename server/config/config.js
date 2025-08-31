require('dotenv').config();

const env = process.env.NODE_ENV || 'development';

const baseConfig = {
  // Server configuration
  env,
  port: process.env.PORT || 5000,
  nodeEnv: env,
  isProduction: env === 'production',
  isDevelopment: env === 'development',
  isTest: env === 'test',
  
  // API configuration
  api: {
    prefix: '/api/v1',
    version: '1.0.0',
    name: 'ICE SUPER Blog API',
    description: 'API for ICE SUPER iGaming Blog',
  },
  
  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_key',
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
    cookieExpiresIn: process.env.JWT_COOKIE_EXPIRES_IN || 30, // days
  },
  
  // Rate limiting
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  },
  
  // CORS configuration
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  },
  
  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'dev',
  },
};

const envConfig = {
  development: {
    // Development-specific configurations
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ice-super-blog-dev',
    // Add other development-specific configs here
  },
  
  production: {
    // Production-specific configurations
    mongoUri: process.env.MONGODB_URI, // Must be set in production
    // Add other production-specific configs here
  },
  
  test: {
    // Test-specific configurations
    mongoUri: process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017/ice-super-blog-test',
    // Add other test-specific configs here
  },
};

// Merge base config with environment-specific config
const config = {
  ...baseConfig,
  ...(envConfig[env] || envConfig.development), // Default to development if env is not set
};

// Validate required production environment variables
if (config.isProduction) {
  const requiredEnvVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
  ];
  
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
}

module.exports = config;
