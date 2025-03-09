# Hosting Guide for Review App on GoDaddy cPanel

This guide will walk you through the process of hosting your Review App on GoDaddy cPanel hosting.

## Application Overview

Your application consists of:
- **Frontend**: Static HTML, CSS, and JavaScript files
- **Admin Panel**: Static HTML, CSS, and JavaScript files
- **Backend**: Node.js Express server with MongoDB database connection

## Hosting Requirements

1. **GoDaddy cPanel Hosting Plan**: Make sure your hosting plan supports Node.js applications
2. **MongoDB Atlas Account**: Your application is configured to use MongoDB Atlas (cloud-hosted MongoDB)
3. **Domain Name**: You'll need a domain name to access your application

## Hosting Steps

### 1. Prepare Your Files

1. Create a ZIP file of your frontend and admin directories:
   ```
   frontend/
   admin/
   ```

2. Create a separate ZIP file for your backend:
   ```
   backend/
   ```

### 2. Set Up MongoDB Atlas (If Not Already Done)

Your `.env` file shows you're already using MongoDB Atlas with the connection string:
```
MONGODB_URI=mongodb+srv://aarratia:<biondi11>@cluster0.ri6eh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

Make sure:
- Your MongoDB Atlas cluster is properly configured
- Network access is set to allow connections from anywhere (0.0.0.0/0) or your GoDaddy server IP
- Your database user credentials are correct

### 3. Upload and Deploy Frontend and Admin Files

1. **Log in to GoDaddy cPanel**
2. **Navigate to File Manager**
3. **Go to the public_html directory** (or your preferred subdirectory)
4. **Create directories for your application**:
   - Create a directory called `review-app`
   - Inside `review-app`, create two subdirectories: `frontend` and `admin`
5. **Upload frontend files**:
   - Navigate to the `frontend` directory
   - Click "Upload" and select your frontend files or upload the ZIP and extract
   - Make sure `index.html` is in the root of the `frontend` directory
6. **Upload admin files**:
   - Navigate to the `admin` directory
   - Click "Upload" and select your admin files or upload the ZIP and extract
   - Make sure `index.html` is in the root of the `admin` directory

### 4. Set Up Node.js Backend

GoDaddy cPanel hosting offers Node.js application hosting through their "Setup Node.js App" feature:

1. **In cPanel, find and click on "Setup Node.js App"**
2. **Create a new Node.js application**:
   - **Application mode**: Production
   - **Application URL**: Choose your domain or subdomain (e.g., `api.yourdomain.com` or `yourdomain.com/api`)
   - **Application root**: Choose the directory where you'll upload your backend files
   - **Application startup file**: `server.js`
   - **Node.js version**: Choose a version compatible with your app (14.x or higher)
   - **Passenger log file**: Leave as default
3. **Click "Create" to set up the Node.js environment**
4. **Upload backend files**:
   - Navigate to the application root directory you specified
   - Upload your backend files or upload the ZIP and extract
5. **Create/modify the `.env` file**:
   - Make sure the MongoDB connection string is correct
   - Update the PORT variable if needed (GoDaddy may require a specific port)
   - Update any other environment variables as needed

### 5. Install Dependencies and Start the Application

1. **Access SSH Terminal** (if available in your GoDaddy plan):
   - In cPanel, find and click on "Terminal" or "SSH Access"
   - Navigate to your backend directory
   - Run `npm install` to install dependencies
   - If SSH access is not available, you may need to contact GoDaddy support for assistance

2. **Restart your Node.js application**:
   - In the "Setup Node.js App" section, find your application
   - Click "Restart" to apply changes and start the server

### 6. Configure Domain and Subdomain (if needed)

If you want to use different domains or subdomains for different parts of your application:

1. **In cPanel, go to "Domains" or "Subdomains"**
2. **Set up your domains/subdomains to point to the appropriate directories**:
   - Main domain → `review-app/frontend`
   - Admin subdomain (e.g., admin.yourdomain.com) → `review-app/admin`
   - API subdomain (e.g., api.yourdomain.com) → Node.js application root

### 7. Update Frontend and Admin API Endpoints

You'll need to update the API endpoints in your frontend and admin JavaScript files to point to your new backend URL:

1. **Modify frontend/src/js/main.js**:
   - Update any API calls to use your new backend URL
   - For example, change `http://localhost:3000/api/` to `https://api.yourdomain.com/` or `https://yourdomain.com/api/`

2. **Modify admin/src/js/admin.js**:
   - Update any API calls to use your new backend URL

### 8. Set Up HTTPS (Recommended)

For security, especially since you're handling user data:

1. **In cPanel, find and click on "SSL/TLS"**
2. **Install an SSL certificate** for your domain and subdomains
3. **Enable HTTPS redirection** to ensure all traffic uses HTTPS

### 9. Test Your Application

1. **Visit your domain** to ensure the frontend is working
2. **Visit your admin subdomain** to ensure the admin panel is working
3. **Test form submissions** to ensure the backend is properly connected

## Troubleshooting

### Common Issues:

1. **Backend not starting**:
   - Check the Node.js application logs in cPanel
   - Ensure all dependencies are installed
   - Verify the MongoDB connection string is correct
   - Make sure the PORT in your .env file matches what GoDaddy expects

2. **CORS errors**:
   - Update the CORS configuration in your backend to allow your new domain
   - In server.js, update the CORS settings:
     ```javascript
     app.use(cors({
       origin: ['https://yourdomain.com', 'https://admin.yourdomain.com']
     }));
     ```

3. **Database connection issues**:
   - Ensure MongoDB Atlas is configured to accept connections from your GoDaddy server
   - Check that your database credentials are correct
   - Verify the connection string format

4. **File permissions**:
   - If you encounter permission errors, you may need to adjust file permissions
   - In File Manager, select files/directories and click "Change Permissions"

## Additional Considerations

### Shared Hosting Limitations

If you're using GoDaddy's shared hosting:

1. **Resource limitations**: Node.js applications can be resource-intensive. Monitor your resource usage.
2. **Process management**: GoDaddy may restart your Node.js application periodically. Consider implementing proper error handling and restart logic.
3. **Long-running processes**: Some shared hosting plans may limit how long processes can run.

### Alternative Approach: Static Frontend with Separate Backend Hosting

If you encounter issues with Node.js on GoDaddy, consider:

1. **Host only the frontend and admin files on GoDaddy**
2. **Host the backend separately** on a platform optimized for Node.js:
   - Heroku
   - Render
   - Railway
   - DigitalOcean
   - AWS Elastic Beanstalk
   - Vercel

Then update your frontend and admin files to point to your separately hosted backend.

## Support

If you encounter issues specific to GoDaddy's hosting environment, contact their support team for assistance.
