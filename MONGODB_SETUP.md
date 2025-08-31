# MongoDB Setup Guide for ICE Super Blog

This guide will help you set up MongoDB for your ICE Super Blog deployment on Vercel.

## Prerequisites

1. A MongoDB Atlas account (free tier available)
2. A Vercel account for deployment

## Step 1: Create MongoDB Atlas Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up or log in to your account
3. Create a new project (e.g., "ICE Super Blog")
4. Click "Build a Database" and choose the **FREE** M0 tier
5. Select your preferred cloud provider and region
6. Name your cluster (e.g., "ice-super-blog-cluster")
7. Click "Create Cluster"

## Step 2: Configure Database Access

1. In your Atlas dashboard, go to **Database Access**
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username and strong password
5. Set database user privileges to "Read and write to any database"
6. Click "Add User"

## Step 3: Configure Network Access

1. Go to **Network Access** in your Atlas dashboard
2. Click "Add IP Address"
3. Choose "Allow Access from Anywhere" (0.0.0.0/0) for Vercel deployment
4. Click "Confirm"

## Step 4: Get Connection String

1. Go to **Database** in your Atlas dashboard
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" and version "4.1 or later"
5. Copy the connection string (it looks like):
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority
   ```

## Step 5: Configure Environment Variables

### For Local Development

1. Create a `.env.local` file in your project root:
   ```env
   MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/ice-super-blog?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

2. Replace the placeholders:
   - `your-username`: Your MongoDB Atlas username
   - `your-password`: Your MongoDB Atlas password
   - `your-cluster`: Your cluster name
   - Add `/ice-super-blog` as the database name

### For Vercel Deployment

1. Go to your Vercel dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string for JWT tokens
   - `NEXT_PUBLIC_SITE_URL`: Your production domain (e.g., https://your-blog.vercel.app)

## Step 6: Initialize Default Data

The application will automatically create:
- Default admin user (username: `admin`, password: `admin123`)
- Default categories (General, Technology, Gaming)
- Default site settings

**Important**: Change the default admin password after first login!

## Step 7: Deploy to Vercel

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build and test locally:
   ```bash
   npm run build
   npm run dev
   ```

3. Deploy to Vercel:
   ```bash
   vercel --prod
   ```

## Security Notes

- Always use strong passwords for your MongoDB users
- Regularly rotate your JWT_SECRET in production
- Consider IP whitelisting for additional security
- Enable MongoDB Atlas monitoring and alerts

## Troubleshooting

### Connection Issues
- Verify your IP address is whitelisted in MongoDB Atlas
- Check that your connection string includes the correct username/password
- Ensure the database name is included in the connection string

### Authentication Issues
- Verify JWT_SECRET is set in environment variables
- Check that the admin user was created successfully

### Performance
- MongoDB Atlas M0 (free tier) has limitations
- Consider upgrading to M2+ for production workloads
- Enable MongoDB Atlas performance monitoring

## Migration from File Storage

This version has been migrated from local file storage to MongoDB. All data including:
- Blog posts
- Categories
- Media file metadata
- Admin settings
- Site customization

Will now be stored in MongoDB for better scalability and Vercel compatibility.

## Support

For issues specific to this blog system, check the main README.md file.
For MongoDB Atlas issues, refer to the [MongoDB Atlas documentation](https://docs.atlas.mongodb.com/).
