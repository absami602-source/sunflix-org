# 🎬 SUNFLIX - Video Streaming Platform

> **Watch. Shine. Repeat.**

A modern, production-ready video streaming platform built with React, TypeScript, Tailwind CSS, and Supabase. Features real-time updates, user authentication, admin panel, and seamless video management.

## ✨ Features

### 🎥 Video Platform
- ✅ Multi-platform video support (YouTube, Vimeo, Dailymotion, etc.)
- ✅ Real-time video updates
- ✅ Trending, Viral, and Featured sections
- ✅ Category-based browsing
- ✅ Video search and filtering
- ✅ View counter and analytics
- ✅ Like and favorite system
- ✅ Watch history tracking

### 👥 User Features
- ✅ Secure authentication with Supabase Auth
- ✅ User profiles with avatars
- ✅ Personal favorites and subscriptions
- ✅ Watch history
- ✅ Real-time notifications
- ✅ Comment system with real-time updates
- ✅ User preferences (theme, autoplay, etc.)

### 🔐 Admin Panel
- ✅ Full video management (CRUD operations)
- ✅ User management and approval system
- ✅ Message inbox
- ✅ Analytics dashboard
- ✅ Settings configuration
- ✅ Role-based access control

### 🎨 Design
- ✅ SUNFLIX branding (Orange to Purple gradient)
- ✅ Dark mode optimized
- ✅ Fully responsive design
- ✅ Modern UI with shadcn/ui components
- ✅ Smooth animations
- ✅ Mobile-first approach

### 🚀 Technical
- ✅ Real-time database with Supabase
- ✅ PostgreSQL with Row Level Security
- ✅ Real-time subscriptions
- ✅ Optimized performance
- ✅ Production-ready deployment
- ✅ Environment-based configuration

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS v4.0
- **UI Components**: shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: Vercel

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Supabase account (free tier works great!)
- Git installed
- A code editor (VS Code recommended)

## 🚀 Quick Start

### 1. Clone or Download the Project

```bash
# If using Git
git clone <your-repo-url>
cd sunflix

# Or download and extract the ZIP file
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Supabase

#### A. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in:
   - Name: SUNFLIX
   - Database Password: (save this!)
   - Region: (closest to you)
4. Wait 2-3 minutes for project creation

#### B. Run Database Migrations

1. Open your Supabase project dashboard
2. Go to **SQL Editor** (left sidebar)
3. Run these scripts in order:

**First**, run `/database/01-schema.sql`:
- Copy entire file content
- Paste in SQL Editor
- Click "Run"

**Second**, run `/database/02-policies.sql`:
- Copy entire file content
- Paste in SQL Editor
- Click "Run"

**Third**, run `/database/03-functions.sql`:
- Copy entire file content
- Paste in SQL Editor
- Click "Run"

#### C. Get Your Credentials

Your `.env` file is already configured with:
```env
VITE_SUPABASE_URL=https://ftsajfadgpseqpnznonj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

✅ **These are already set and working!**

### 4. Create Admin User

Run this SQL in Supabase SQL Editor:

```sql
-- First, manually create admin in Supabase Auth Dashboard:
-- Go to Authentication → Users → Add User
-- Email: admin@sunflix.com
-- Password: SunShine2025
-- Auto Confirm User: Yes

-- Then update the profile role:
UPDATE public.profiles 
SET role = 'admin', approved = true 
WHERE email = 'admin@sunflix.com';
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) 🎉

### 6. Test the Application

- ✅ Browse videos on homepage
- ✅ Sign up: Create a new account
- ✅ Login: Try your account
- ✅ Admin Panel: [http://localhost:5173/admin](http://localhost:5173/admin)
  - Email: `admin@sunflix.com`
  - Password: `SunShine2025`

## 📦 Project Structure

```
sunflix/
├── database/              # SQL migrations
│   ├── 01-schema.sql     # Tables and indexes
│   ├── 02-policies.sql   # Row Level Security
│   └── 03-functions.sql  # Database functions
├── src/
│   ├── components/       # React components
│   │   ├── ui/          # shadcn/ui components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── ...
│   ├── contexts/         # React contexts
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx
│   ├── lib/              # Utilities
│   │   ├── supabase-client.ts  # Supabase connection
│   │   ├── storage.ts          # Database operations
│   │   └── video-utils.ts      # Video helpers
│   ├── pages/            # Page components
│   │   ├── admin/       # Admin panel pages
│   │   ├── HomePage.tsx
│   │   └── ...
│   ├── styles/           # Global styles
│   │   └── globals.css
│   └── App.tsx           # Main app component
├── .env                  # Environment variables (DO NOT COMMIT!)
├── .env.example          # Example env file
├── vercel.json           # Vercel configuration
├── DEPLOYMENT.md         # Deployment guide
├── package.json
└── README.md            # This file
```

## 🌐 Deployment to Vercel

### Option 1: Vercel CLI (Fastest)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variables (if needed)
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY

# Deploy to production
vercel --prod
```

### Option 2: Vercel Dashboard

1. Go to [https://vercel.com/new](https://vercel.com/new)
2. Import your repository (or upload folder)
3. Configure:
   - Framework: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add Environment Variables:
   - `VITE_SUPABASE_URL`: (already in .env)
   - `VITE_SUPABASE_ANON_KEY`: (already in .env)
5. Click **Deploy**

### Post-Deployment

After deployment, update Supabase Auth URLs:

1. Go to Supabase Dashboard
2. **Authentication** → **URL Configuration**
3. Set:
   - **Site URL**: `https://your-app.vercel.app`
   - **Redirect URLs**: 
     ```
     https://your-app.vercel.app/**
     http://localhost:5173/**
     ```

📖 **For detailed deployment instructions**, see [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🔐 Default Credentials

### Admin Access
- **URL**: `/admin`
- **Email**: `admin@sunflix.com`
- **Password**: `SunShine2025`

⚠️ **IMPORTANT**: Change the admin password after first login!

## 🎨 Customization

### Colors
The SUNFLIX brand colors are defined in `/styles/globals.css`:

```css
--color-primary: #FF7E00;      /* Sunset Orange */
--color-secondary: #6C00FF;    /* Purple */
--color-accent: #FFB800;       /* Accent Glow */
--color-bg-dark: #0E0E10;      /* Background Dark */
```

### Logo & Branding
- Update logo in admin settings
- Modify favicon in `public/` folder
- Update site name in Supabase settings table

## 📊 Database Schema

### Main Tables
- `profiles` - User accounts and profiles
- `videos` - All video content
- `comments` - Video comments
- `messages` - Contact form messages
- `notifications` - User notifications
- `ads` - Advertisement management
- `watch_history` - Viewing history
- `user_preferences` - User settings
- `settings` - Global site settings

### Security
- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Policies protect user data
- ✅ Admin-only access to sensitive operations
- ✅ Authenticated routes
- ✅ Secure password hashing by Supabase Auth

## 🔄 Real-time Features

Enable Realtime in Supabase for these tables:
1. Go to **Database** → **Replication**
2. Enable for:
   - videos
   - comments
   - notifications
   - messages
   - profiles

This enables:
- Live video updates
- Real-time comments
- Instant notifications
- Live message delivery

## 📱 Features by User Role

### Public (Not Logged In)
- ✅ Browse videos
- ✅ View video details
- ✅ Search videos
- ✅ Filter by category
- ✅ Sign up / Login

### User (Logged In)
- ✅ All public features
- ✅ Like videos
- ✅ Comment on videos
- ✅ Favorite videos
- ✅ Watch history
- ✅ Personal notifications
- ✅ Profile customization

### Admin
- ✅ All user features
- ✅ Full video management
- ✅ User approval/management
- ✅ View/respond to messages
- ✅ Access analytics
- ✅ Configure settings
- ✅ Manage ads

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Lint code
npm run lint
```

### Environment Variables

Required environment variables (already configured in `.env`):

```env
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

⚠️ **Never commit `.env` to version control!**

## 🐛 Troubleshooting

### Can't Login
- Verify admin user exists in Supabase Auth
- Check user role is set to 'admin' in profiles table
- Clear browser localStorage and cookies
- Check Supabase logs for errors

### Videos Not Loading
- Check Supabase connection (URL and key)
- Verify SQL migrations ran successfully
- Check RLS policies are enabled
- Look at browser console for errors

### Deployment Issues
- Ensure environment variables are set in Vercel
- Verify build completes locally first
- Check Vercel deployment logs
- Update Supabase redirect URLs

### Real-time Not Working
- Enable Realtime replication in Supabase
- Check browser console for WebSocket errors
- Verify network allows WebSocket connections

## 📈 Performance

- ⚡ Optimized database queries with indexes
- ⚡ Lazy loading for images
- ⚡ Code splitting with React Router
- ⚡ Cached assets
- ⚡ Optimized build size
- ⚡ Real-time subscriptions with minimal overhead

## 🔒 Security Best Practices

1. **Never expose service_role key** - Only use anon key in frontend
2. **Keep RLS enabled** - Row Level Security protects data
3. **Use environment variables** - Never hardcode credentials
4. **Change default passwords** - Update admin password immediately
5. **Enable 2FA** - On Supabase and Vercel accounts
6. **Monitor logs** - Check for suspicious activity
7. **Keep dependencies updated** - Run `npm audit` regularly

## 📞 Support

For issues:
1. Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment help
2. Review Supabase logs: Dashboard → API → Logs
3. Check Vercel logs: `vercel logs`
4. Review browser console for errors

## 📄 License

This project is private and proprietary.

## 🎉 Credits

Built with:
- [React](https://react.dev)
- [Supabase](https://supabase.com)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Vite](https://vitejs.dev)
- [Vercel](https://vercel.com)

---

**SUNFLIX** - Watch. Shine. Repeat. 🌅✨

Made with ❤️ for Gen Z and content creators aged 16-35
