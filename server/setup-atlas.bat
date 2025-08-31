@echo off
echo Updating .env file with MongoDB Atlas connection...
echo # Server Configuration> .env
echo NODE_ENV=development>> .env
echo PORT=5000>> .env
echo.>> .env
echo # Database>> .env
echo MONGODB_URI=mongodb+srv://admin:admin123@cluster0.mongodb.net/ice-super-blog?retryWrites=true&w=majority>> .env
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
echo Environment file updated with MongoDB Atlas connection!
