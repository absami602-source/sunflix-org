# 🚀 SUNFLIX Quick Start Guide

Get SUNFLIX up and running in **15 minutes**!

## ⚡ Super Quick Setup

### 1️⃣ Install Dependencies (2 minutes)

```bash
npm install
```

### 2️⃣ Setup Supabase (5 minutes)

1. Go to **[supabase.com](https://supabase.com)** → Create account/login
2. Click **"New Project"**
3. Name: `SUNFLIX` | Password: (save it!) | Region: (closest to you)
4. **Wait 2-3 minutes** for project creation ⏳

### 3️⃣ Run Database Setup (3 minutes)

1. In Supabase, click **"SQL Editor"** (left sidebar)
2. Click **"New Query"**
3. **Copy entire `/database/COMPLETE_SETUP.sql` file**
4. **Paste** into SQL Editor
5. Click **"Run"** button (or Ctrl/Cmd + Enter)
6. ✅ Wait for "Success. No rows returned"

### 4️⃣ Create Admin User (2 minutes)

**In Supabase Dashboard:**

1. Go to **Authentication** → **Users**
2. Click **"Add User"** (top right)
3. Fill in:
   - **Email**: `admin@sunflix.com`
   - **Password**: `SunShine2025`
   - **Auto Confirm User**: ✅ CHECK THIS BOX
4. Click **"Create User"**
5. Click on the newly created user
6. Scroll to **"User Metadata"** section
7. Add this JSON:
   ```json
   {
     "role": "admin",
     "name": "SUNFLIX Admin"
   }
   ```
8. Click **"Save"**

### 5️⃣ Verify Environment (1 minute)

Your `.env` file already contains:
```env
VITE_SUPABASE_URL=https://ftsajfadgpseqpnznonj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

✅ **This is already configured!**

### 6️⃣ Start Development Server (1 minute)

```bash
npm run dev
```

🎉 Open **[http://localhost:5173](http://localhost:5173)**

---

## ✅ Test Everything (1 minute)

### Test Homepage
- [ ] Videos are displayed
- [ ] Click on a video → plays
- [ ] Categories work

### Test Admin Panel
1. Go to **[http://localhost:5173/admin](http://localhost:5173/admin)**
2. Login:
   - Email: `admin@sunflix.com`
   - Password: `SunShine2025`
3. ✅ Dashboard loads

---

## 🚀 Deploy to Vercel (5 minutes)

### Method 1: CLI (Fastest)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Method 2: Dashboard

1. Go to **[vercel.com](https://vercel.com)**
2. Click **"Add New Project"**
3. Import your code
4. Set:
   - Framework: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add Environment Variables:
   - `VITE_SUPABASE_URL`: `https://ftsajfadgpseqpnznonj.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: (your key from .env)
6. Click **"Deploy"**

### After Deploy

1. In Supabase: **Authentication** → **URL Configuration**
2. Set **Site URL**: `https://your-app.vercel.app`
3. Add to **Redirect URLs**:
   ```
   https://your-app.vercel.app/**
   http://localhost:5173/**
   ```
4. **Save**

---

## 🎯 What You Get

✅ **Working Features:**
- User authentication (signup/login)
- Video browsing and playback
- Admin panel access
- Comment system
- Like/favorite system
- User profiles
- Message system
- Settings management

✅ **Sample Data:**
- 6 sample videos
- Global settings configured
- Admin user ready

✅ **Production Ready:**
- Real-time updates
- Secure authentication
- Row-level security
- Optimized performance

---

## 🆘 Common Issues

### "Error connecting to Supabase"
- ✅ Check `.env` file has correct credentials
- ✅ Restart dev server: `Ctrl+C` then `npm run dev`

### "Can't login as admin"
- ✅ Verify admin user exists in Supabase Auth
- ✅ Check User Metadata has `"role": "admin"`
- ✅ Password is exactly: `SunShine2025`

### "No videos showing"
- ✅ Check SQL migration ran successfully
- ✅ Go to Supabase → Table Editor → videos
- ✅ Verify 6 sample videos exist

### Build errors
- ✅ Run `npm install` again
- ✅ Delete `node_modules` and run `npm install`
- ✅ Check Node version: `node -v` (need 18+)

---

## 📚 Next Steps

### For Local Development:
1. Read [README.md](./README.md) for full documentation
2. Customize colors/branding in `/styles/globals.css`
3. Add your own videos via admin panel
4. Invite test users

### For Production:
1. Follow [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deploy guide
2. Use [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md) to verify everything
3. Change admin password after first login
4. Set up custom domain (optional)
5. Enable Realtime (see README)

---

## 🎨 Customization Tips

### Change Branding Colors
Edit `/styles/globals.css`:
```css
--color-primary: #FF7E00;      /* Sunset Orange */
--color-secondary: #6C00FF;    /* Purple */
```

### Add Videos
1. Login to admin panel
2. Videos → Add Video
3. Fill in details
4. Save

### Update Site Info
1. Admin panel → Settings
2. Update site name, description
3. Add social links
4. Save

---

## 💡 Pro Tips

1. **Enable Realtime** (Optional):
   - Supabase → Database → Replication
   - Enable for: videos, comments, notifications, messages

2. **Backup Data**:
   - Supabase → Settings → Backups
   - Enable automatic backups

3. **Monitor Usage**:
   - Supabase → Reports
   - Check database size, API calls

4. **Secure Your App**:
   - Change admin password
   - Review RLS policies
   - Enable 2FA on Supabase

---

## 🎉 You're Done!

Your SUNFLIX platform is now:
- ✅ Fully functional
- ✅ Production ready
- ✅ Real-time enabled
- ✅ Secure and scalable

**Admin Access:**
- URL: `/admin`
- Email: `admin@sunflix.com`
- Password: `SunShine2025`

**Need help?** Check:
- 📖 [README.md](./README.md) - Complete documentation
- 🚀 [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment guide
- ✅ [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md) - Verification checklist

---

**SUNFLIX** - Watch. Shine. Repeat. 🌅✨
