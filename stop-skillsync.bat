@echo off
echo Stopping SkillSync Services...

REM Stop MongoDB container
echo Stopping MongoDB...
docker-compose down
if %ERRORLEVEL% NEQ 0 (
  echo Warning: Failed to stop MongoDB containers properly.
)

REM Kill Node.js processes (frontend and backend)
echo Stopping Node.js servers...
taskkill /F /IM node.exe
if %ERRORLEVEL% NEQ 0 (
  echo Warning: No Node.js processes were running or could not be terminated.
)

echo All services stopped!
pause 