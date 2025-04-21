@echo off
echo Starting SkillSync Services...

REM Start MongoDB with Docker Compose
echo Starting MongoDB...
docker-compose up -d
if %ERRORLEVEL% NEQ 0 (
  echo Failed to start MongoDB!
  pause
  exit /b %ERRORLEVEL%
)
echo MongoDB started successfully!

REM Start the backend server in a new window
echo Starting backend server...
start cmd /k "cd skillsync-backend && npm run dev"

REM Start the frontend server in a new window
echo Starting frontend server...
start cmd /k "cd skillsync-frontend && npm start"

echo All services started!
echo Frontend: http://localhost:4200
echo Backend: http://localhost:3000
echo MongoDB: mongodb://localhost:27017/skillsync

pause 