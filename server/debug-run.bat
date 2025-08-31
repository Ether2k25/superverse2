@echo off
echo Starting ICE SUPER Blog Server in debug mode...
set NODE_ENV=development
set DEBUG=*
node server.js
if %errorlevel% neq 0 (
    echo Server failed to start with error level %errorlevel%
    pause
) else (
    echo Server stopped normally
)
