# Product Review App

A web application for collecting customer reviews and offering promotions. This application allows customers to submit feedback about products they've purchased and receive promotions in return. It also includes an admin dashboard for managing products, promotions, and viewing submissions.

## Features

### Customer-Facing Form
- Multi-step form with progress indicator
- Product selection
- Platform selection (Amazon, Walmart, eBay)
- Order number validation
- Satisfaction rating
- Promotion selection
- Personal information collection
- Newsletter opt-in
- Confirmation page with review links

### Admin Dashboard
- Secure login
- Product management (CRUD operations)
- Promotion management (CRUD operations)
- Submission viewing and filtering
- Data export (CSV, Excel)
- Analytics and reporting
- User management
- Email settings configuration

## Technology Stack

### Frontend
- HTML5
- CSS3
- JavaScript (ES6+)
- Responsive design

### Backend
- Node.js
- Express.js
- MongoDB (database)
- JWT (authentication)
- Nodemailer (email)
- Mailchimp API (newsletter)

## Project Structure

```
├── frontend/             # Customer-facing form
│   ├── index.html        # Main HTML file
│   └── src/              # Source files
│       ├── css/          # CSS styles
│       ├── js/           # JavaScript files
│       └── assets/       # Images and other assets
│
├── admin/                # Admin dashboard
│   ├── index.html        # Main HTML file
│   └── src/              # Source files
│       ├── css/          # CSS styles
│       ├── js/           # JavaScript files
│       └── assets/       # Images and other assets
│
├── backend/              # Server-side code
│   ├── server.js         # Main server file
│   ├── package.json      # Dependencies
│   └── src/              # Source files
│       ├── controllers/  # Route controllers
│       ├── models/       # Database models
│       ├── routes/       # API routes
│       ├── services/     # External services
│       ├── utils/        # Utility functions
│       └── config/       # Configuration files
│
└── README.md             # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/product-review-app.git
   cd product-review-app
   ```

2. Install backend dependencies:
   ```
   cd backend
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the backend directory
   - Add the following variables:
     ```
     PORT=3000
     NODE_ENV=development
     MONGODB_URI=mongodb://localhost:27017/review-app
     JWT_SECRET=your_jwt_secret_key_here
     JWT_EXPIRES_IN=7d
     MAILCHIMP_API_KEY=your_mailchimp_api_key
     MAILCHIMP_LIST_ID=your_mailchimp_list_id
     EMAIL_SERVICE=gmail
     EMAIL_USER=your_email@gmail.com
     EMAIL_PASSWORD=your_email_password
     EMAIL_FROM=your_email@gmail.com
     ```

4. Start the server:
   ```
   npm start
   ```

5. Open the application:
   - Customer form: http://localhost:3000
   - Admin dashboard: http://localhost:3000/admin

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PATCH /api/auth/update-password` - Update password

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get a single product
- `POST /api/products` - Create a new product
- `PATCH /api/products/:id` - Update a product
- `DELETE /api/products/:id` - Delete a product (soft delete)
- `DELETE /api/products/:id/hard` - Hard delete a product (admin only)

### Promotions
- `GET /api/promotions` - Get all promotions
- `GET /api/promotions/:id` - Get a single promotion
- `POST /api/promotions` - Create a new promotion
- `PATCH /api/promotions/:id` - Update a promotion
- `DELETE /api/promotions/:id` - Delete a promotion (soft delete)
- `DELETE /api/promotions/:id/hard` - Hard delete a promotion (admin only)

### Submissions
- `GET /api/submissions` - Get all submissions
- `GET /api/submissions/:id` - Get a single submission
- `POST /api/submissions` - Create a new submission
- `GET /api/submissions/stats` - Get submission statistics
- `GET /api/submissions/export/csv` - Export submissions as CSV
- `DELETE /api/submissions/:id` - Delete a submission

## Deployment

This application can be deployed on GoDaddy hosting with the following steps:

1. Set up a MongoDB database (either locally or using a cloud service like MongoDB Atlas)
2. Configure environment variables for production
3. Build and deploy the application to GoDaddy

## License

This project is licensed under the MIT License - see the LICENSE file for details.
