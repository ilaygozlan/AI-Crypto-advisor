@echo off
echo Starting Moveo Crypto AI Advisor Frontend (Standalone Mode)
echo.
echo This will start the frontend with mock API data - no backend required!
echo.
echo Copying standalone environment file...
copy env.standalone .env
echo.
echo Installing dependencies...
npm install
echo.
echo Starting development server...
npm run dev
