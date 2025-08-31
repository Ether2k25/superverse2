@echo off
echo Starting ICE SUPER Blog Server...
set NODE_ENV=development
set NODE_DEBUG=*
node -r dotenv/config server.js
