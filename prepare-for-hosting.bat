@echo off
echo ===================================================
echo Review App - Prepare for GoDaddy cPanel Hosting
echo ===================================================
echo.

echo Creating necessary directories...
mkdir hosting-package
mkdir hosting-package\frontend
mkdir hosting-package\admin
mkdir hosting-package\backend
echo.

echo Copying frontend files...
xcopy /E /I /Y frontend\* hosting-package\frontend\
echo.

echo Copying admin files...
xcopy /E /I /Y admin\* hosting-package\admin\
echo.

echo Copying backend files...
xcopy /E /I /Y backend\* hosting-package\backend\
echo.

echo Creating ZIP files for easy upload...
powershell Compress-Archive -Path hosting-package\frontend\* -DestinationPath hosting-package\frontend.zip -Force
powershell Compress-Archive -Path hosting-package\admin\* -DestinationPath hosting-package\admin.zip -Force
powershell Compress-Archive -Path hosting-package\backend\* -DestinationPath hosting-package\backend.zip -Force
echo.

echo Creating a modified .env file for production...
(
echo # Server Configuration
echo PORT=8080
echo NODE_ENV=production
echo.
echo # MongoDB Connection
echo MONGODB_URI=mongodb+srv://aarratia:^<biondi11^>@cluster0.ri6eh.mongodb.net/?retryWrites=true^&w=majority^&appName=Cluster0
echo.
echo # JWT Secret for Authentication
echo JWT_SECRET=your_jwt_secret_key_here
echo JWT_EXPIRES_IN=7d
echo.
echo # Mailchimp Configuration
echo MAILCHIMP_API_KEY=your_mailchimp_api_key
echo MAILCHIMP_LIST_ID=your_mailchimp_list_id
echo.
echo # Email Configuration
echo EMAIL_SERVICE=gmail
echo EMAIL_USER=your_email@gmail.com
echo EMAIL_PASSWORD=your_email_password
echo EMAIL_FROM=your_email@gmail.com
echo.
echo # Firebase Configuration (Alternative to MongoDB)
echo FIREBASE_API_KEY=your_firebase_api_key
echo FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
echo FIREBASE_PROJECT_ID=your_firebase_project_id
echo FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
echo FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
echo FIREBASE_APP_ID=your_firebase_app_id
) > hosting-package\backend\.env
echo.

echo Creating a sample CORS update file...
(
echo // Update this in your server.js file
echo // Replace the current CORS setup with this:
echo.
echo app.use(cors({
echo   origin: ['https://yourdomain.com', 'https://admin.yourdomain.com', 'http://yourdomain.com', 'http://admin.yourdomain.com'],
echo   credentials: true
echo }));
) > hosting-package\cors-update.txt
echo.

echo ===================================================
echo Package prepared successfully!
echo.
echo Your files are ready in the "hosting-package" directory:
echo  - frontend.zip: Upload to your main website directory
echo  - admin.zip: Upload to your admin subdirectory
echo  - backend.zip: Upload to your Node.js application directory
echo  - backend\.env: A template .env file for production
echo  - cors-update.txt: CORS configuration to update in server.js
echo.
echo Please refer to hosting-guide.md for detailed instructions
echo on how to upload and configure these files on GoDaddy cPanel.
echo ===================================================
echo.
echo Press any key to exit...
pause > nul
