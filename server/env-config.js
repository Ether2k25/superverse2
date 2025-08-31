// This file contains environment configuration for development
// Copy these values to your .env file

const envConfig = `# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb+srv://admin:admin123@cluster0.mongodb.net/ice-super-blog?retryWrites=true&w=majority

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=30d
JWT_COOKIE_EXPIRES_IN=30

# CORS
CLIENT_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100`;

console.log('Copy the following configuration to your .env file:');
console.log('==============================================');
console.log(envConfig);
console.log('==============================================');
console.log('Note: Make sure to replace the MONGODB_URI with your actual MongoDB Atlas connection string.');
