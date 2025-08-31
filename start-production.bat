@echo off
echo Starting ICE SUPER Blog in production mode...
echo.

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    echo.
)

REM Build the project
echo Building project...
npm run build
echo.

REM Initialize data
echo Setting up data files...
npm run setup
echo.

REM Start the server
echo Starting production server...
npm start
