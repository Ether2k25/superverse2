@echo off
echo Creating .env file...
echo # Server Configuration> .env
echo NODE_ENV=development>> .env
echo PORT=5000>> .env
echo.>> .env
echo # Database>> .env
echo MONGODB_URI=mongodb://localhost:27017/ice-super-blog>> .env
echo.>> .env
echo # JWT>> .env
echo JWT_SECRET=your_jwt_secret_key_here>> .env
echo JWT_EXPIRES_IN=30d>> .env
echo JWT_COOKIE_EXPIRES_IN=30>> .env
echo.>> .env
echo # CORS>> .env
echo CLIENT_URL=http://localhost:3000>> .env
echo.>> .env
echo # Rate Limiting>> .env
echo RATE_LIMIT_WINDOW_MS=900000>> .env
echo RATE_LIMIT_MAX=100>> .env
echo.>> .env
echo # Cloudinary (optional)>> .env
echo # CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name>> .env
echo # CLOUDINARY_API_KEY=your_cloudinary_api_key>> .env
echo # CLOUDINARY_API_SECRET=your_cloudinary_api_secret>> .env
echo.>> .env
echo Environment file created successfully!
