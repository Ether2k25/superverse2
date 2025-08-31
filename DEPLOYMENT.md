# ICE SUPER Blog - Production Deployment Guide

## 🚀 Zero-Configuration Deployment

Upload your project to any server and it will work immediately without any additional setup!

### Quick Deployment Steps:

1. **Upload Files**: Copy all project files to your server
2. **Install Dependencies**: `npm install`
3. **Build & Deploy**: `npm run deploy`

That's it! Your blog is ready to use.

## 📁 What Happens Automatically

- **Data Directory**: Creates `data/` folder for local storage
- **Default Admin**: Creates admin user (admin/admin123)
- **Sample Content**: Adds welcome blog post
- **Settings**: Configures default site settings

## 🔧 Production Commands

```bash
# Full deployment (build + setup + start)
npm run deploy

# Individual commands
npm run build    # Build for production
npm run setup    # Initialize data files
npm start        # Start production server

# Development
npm run dev      # Start development server
```

## 🌐 Access Your Blog

- **Blog**: `http://your-domain.com`
- **Admin Panel**: `http://your-domain.com/admin/login`
- **Default Credentials**: admin / admin123

## ⚙️ Environment Configuration

### Production Environment (.env.production)
```env
JWT_SECRET=your-secure-jwt-secret
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NODE_ENV=production
```

### Server Configuration
- **Port**: Set `PORT` environment variable (default: 3000)
- **Hostname**: Set `HOSTNAME` environment variable (default: localhost)

## 📂 File Structure After Deployment

```
your-project/
├── data/                    # Auto-created data storage
│   ├── admin-users.json     # Admin users
│   ├── admin-passwords.json # Encrypted passwords
│   ├── blog-posts.json      # Blog posts
│   └── admin-settings.json  # Site settings
├── .env.production          # Production config
├── server.js               # Production server
└── scripts/setup.js        # Initialization script
```

## 🔒 Security Notes

1. **Change Default Password**: Login and change admin password immediately
2. **Update JWT Secret**: Use a strong, unique JWT secret in production
3. **File Permissions**: Ensure `data/` directory is writable
4. **HTTPS**: Use HTTPS in production for security

## 🛠️ Server Requirements

- **Node.js**: 16.x or higher
- **NPM**: 7.x or higher
- **Disk Space**: Minimal (local file storage)
- **Database**: None required (uses local JSON files)

## 📋 Troubleshooting

### Common Issues:

1. **Permission Errors**: Ensure write permissions for `data/` directory
2. **Port Conflicts**: Change PORT environment variable
3. **Build Errors**: Run `npm install` to ensure all dependencies

### Data Backup:
Simply backup the `data/` folder to preserve all content and settings.

## 🎯 No External Dependencies

- ✅ No database setup required
- ✅ No external services needed
- ✅ No complex configuration
- ✅ Works on any Node.js server
- ✅ Self-contained and portable
- **Media uploads**: Stored in `public/uploads/`

## 🔒 Default Admin Credentials

- **Username**: admin
- **Password**: admin123

**Important**: Change the default password after first login!

## 📁 Project Structure

- `src/app/` - Next.js app router pages
- `src/components/` - React components
- `src/lib/` - Utility functions and data management
- `data/` - JSON-based data storage
- `public/uploads/` - Uploaded media files

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📝 Development Notes

This is a local-only setup using file-based storage. All data persists in the `data/` directory and uploaded files in `public/uploads/`.
