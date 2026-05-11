# Local Business Platform - Setup Guide

## Features
- Browse and search local businesses
- View detailed business information and reviews
- User registration and authentication
- Admin dashboard for managing businesses, users, and reviews
- Star rating system
- Responsive design

## Database Setup

### Tables Created
1. **users** - User profiles and authentication
   - id, email, name, avatar_url, auth_id, is_admin, created_at

2. **businesses** - Business listings
   - id, name, description, category, address, city, state, zip_code, phone, website, image_url, rating, review_count, latitude, longitude, created_at, updated_at

3. **reviews** - User reviews
   - id, business_id, user_id, rating, title, content, helpful_count, created_at, updated_at

4. **admin_users** - Admin settings
   - id, user_id, dashboard_access, can_manage_businesses, can_manage_users, can_view_analytics, created_at

### Row Level Security (RLS)
- Public read access for businesses and reviews
- Users can only see their own profile
- Users can create and update their own reviews
- Admins can manage all resources

## How to Use

### User Features
1. **Sign Up** - Create a new account with email and password
2. **Sign In** - Log in to your account
3. **Browse Businesses** - Filter by category or use search
4. **View Details** - Click on a business to see full details, reviews, and ratings
5. **Write Reviews** - Submit reviews with ratings and comments
6. **Manage Account** - Access user menu from header

### Admin Features
1. **Admin Login** - Click "Admin Login" button on homepage (bottom right of hero section)
2. **Dashboard Overview** - View statistics (total businesses, users, reviews, average rating)
3. **Manage Businesses** - View all businesses in table format
4. **Manage Users** - View all users and their admin status
5. **View Reviews** - Monitor all customer reviews

## Test Credentials

### Creating Test Accounts
The authentication system uses Supabase's built-in email/password auth.

To test the application:
1. Sign up with a test email (e.g., user@example.com)
2. Create a password (min 6 characters)
3. Browse and interact with businesses

### Creating Admin Account
To create an admin account:
1. Sign up a new user
2. Use Supabase SQL console to update the user:
   ```sql
   UPDATE users SET is_admin = true WHERE email = 'admin@example.com';
   ```

## Sample Data
The database is pre-populated with 12 businesses across different categories:
- The Golden Fork (Italian Restaurant)
- Coffee & Co. (Coffee Shop)
- Urban Threads (Shopping)
- Massage Therapy Plus (Service)
- The Comedy Club (Entertainment)
- And more...

## Running the App

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview build
npm preview
```

The app runs on http://localhost:5173

## Environment Variables
Required in .env:
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY

These are automatically configured in the Supabase project.

## API Endpoints
All data is managed through Supabase database queries with RLS policies for security.

## Security
- Row Level Security (RLS) enabled on all tables
- Authentication via Supabase Auth
- Sensitive operations restricted to admins
- Password validation on signup
- Session management
