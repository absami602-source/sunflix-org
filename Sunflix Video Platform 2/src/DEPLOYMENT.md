# SUNFLIX - Deployment Guide

Complete guide to deploy SUNFLIX to Vercel with Supabase backend.

## 📋 Prerequisites

1. Node.js 18+ installed
2. Git installed
3. Supabase account created
4. Vercel account created
5. GitHub/GitLab account (optional but recommended)

---

## 🗄️ Step 1: Setup Supabase Database

### 1.1 Run Schema Migration

1. Open your Supabase project dashboard
2. Go to **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy and paste contents from `/database/01-schema.sql`
5. Click **Run** (or Ctrl/Cmd + Enter)
6. Wait for "Success" message

### 1.2 Setup Row Level Security

1. Still in SQL Editor, click **New Query**
2. Copy and paste contents from `/database/02-policies.sql`
3. Click **Run**
4. Wait for "Success" message

### 1.3 Create Functions & Triggers

1. In SQL Editor, click **New Query**
2. Copy and paste contents from `/database/03-functions.sql`
3. Click **Run**
4. Wait for "Success" message

### 1.4 Enable Realtime (Optional but Recommended)

1. Go to **Database** → **Replication** in Supabase dashboard
2. Find and enable replication for these tables:
   - ✅ videos
   - ✅ comments
   - ✅ notifications
   - ✅ messages
   - ✅ profiles
3. Click **Save**

### 1.5 Create Admin User

Run this SQL in SQL Editor:

```sql
-- Create admin user (modify email/password as needed)
-- This creates the auth user and profile automatically
SELECT extensions.create_user(
  'admin@sunflix.com'::text,
  'SunShine2025'::text,
  '{"role": "admin", "name": "SUNFLIX Admin"}'::jsonb
);
```

OR manually:

1. Go to **Authentication** → **Users**
2. Click **Add User**
3. Email: `admin@sunflix.com`
4. Password: `SunShine2025`
5. Auto Confirm: ✅ Yes
6. Click **Create User**
7. Click on the newly created user
8. In **User Metadata**, add:
```json
{
  "role": "admin",
  "name": "SUNFLIX Admin"
}
```
9. Save changes

---

## 💻 Step 2: Local Development Setup

### 2.1 Install Dependencies

```bash
npm install
```

### 2.2 Environment Variables

Your `.env` file is already configured with:

```env
VITE_SUPABASE_URL=https://ftsajfadgpseqpnznonj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2.3 Test Locally

```bash
npm run dev
```

Open http://localhost:5173 and test:
- ✅ Sign up with a new account
- ✅ Login with admin@sunflix.com / SunShine2025
- ✅ View videos
- ✅ Add comments
- ✅ Access admin panel

---

## 🚀 Step 3: Deploy to Vercel

### Option A: Deploy via Vercel CLI (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Choose your account
   - Link to existing project? **N**
   - Project name? **sunflix** (or your preferred name)
   - Directory? **./** (just press Enter)
   - Override settings? **N**

5. Add environment variables:
```bash
vercel env add VITE_SUPABASE_URL
```
Paste: `https://ftsajfadgpseqpnznonj.supabase.co`

```bash
vercel env add VITE_SUPABASE_ANON_KEY
```
Paste your anon key

6. Deploy to production:
```bash
vercel --prod
```

### Option B: Deploy via Vercel Dashboard

1. Go to https://vercel.com/new

2. Import your project:
   - If using Git: Connect your repository
   - If not: Upload your project folder (zip it first)

3. Configure Project:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. Add Environment Variables:
   - Click **Environment Variables**
   - Add `VITE_SUPABASE_URL`: `https://ftsajfadgpseqpnznonj.supabase.co`
   - Add `VITE_SUPABASE_ANON_KEY`: `your-anon-key-here`

5. Click **Deploy**

6. Wait for deployment to complete (2-3 minutes)

---

## ⚙️ Step 4: Post-Deployment Configuration

### 4.1 Update Supabase Auth URLs

1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **URL Configuration**
3. Update these fields:
   - **Site URL**: `https://your-app.vercel.app`
   - **Redirect URLs**: Add these lines:
     ```
     https://your-app.vercel.app/**
     https://your-app.vercel.app/auth/callback
     http://localhost:5173/**
     ```

### 4.2 Test Production Deployment

1. Visit your Vercel URL
2. Test all features:
   - ✅ User registration
   - ✅ Login/Logout
   - ✅ Video playback
   - ✅ Comments (real-time)
   - ✅ Admin panel access
   - ✅ Video management
   - ✅ Message submission

---

## 🔒 Step 5: Security Checklist

- ✅ Never commit `.env` file to Git
- ✅ Keep service_role key private (not used in frontend)
- ✅ RLS policies are enabled on all tables
- ✅ Admin role is only assigned manually
- ✅ Supabase Auth is handling password hashing
- ✅ CORS is properly configured in Supabase

---

## 📊 Step 6: Monitoring

### Vercel Analytics (Optional)

1. Go to your project in Vercel Dashboard
2. Click **Analytics** tab
3. Enable Web Analytics
4. Monitor traffic, performance, and errors

### Supabase Monitoring

1. Go to Supabase Dashboard
2. Check **Database** → **Query Performance**
3. Monitor **API** → **Logs** for errors
4. Review **Authentication** → **Users** for signup trends

---

## 🛠️ Troubleshooting

### Build Fails on Vercel

**Error: Module not found**
```bash
# Locally, check if all dependencies are in package.json
npm install
npm run build
```

**Environment Variables Not Working**
- Make sure they start with `VITE_`
- Redeploy after adding env vars
- Check Vercel → Settings → Environment Variables

### Database Connection Issues

**"Failed to fetch" errors**
- Verify Supabase URL and anon key
- Check if RLS policies are correctly set
- Look at Supabase → API → Logs for errors

### Authentication Issues

**Can't login after deployment**
- Update Supabase redirect URLs (Step 4.1)
- Clear browser cookies/localStorage
- Check Authentication → Users in Supabase

### Real-time Not Working

- Enable Realtime replication in Database → Replication
- Check browser console for WebSocket errors
- Verify network allows WebSocket connections

---

## 📝 Custom Domain (Optional)

### Add Custom Domain to Vercel

1. Go to Vercel Project → **Settings** → **Domains**
2. Add your domain (e.g., `sunflix.com`)
3. Follow DNS configuration instructions
4. Wait for DNS propagation (up to 48 hours)
5. Update Supabase Auth URLs with new domain

---

## 🔄 Continuous Deployment

### Setup Auto-Deploy with Git

1. Push your code to GitHub/GitLab/Bitbucket:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

2. In Vercel, connect to Git repository
3. Enable automatic deployments
4. Every push to `main` will auto-deploy

---

## 📈 Scaling Considerations

### When You Outgrow Free Tiers

**Supabase Free Tier Limits:**
- 500 MB database space
- 2 GB bandwidth
- 50,000 monthly active users

**Upgrade to Supabase Pro ($25/mo):**
- 8 GB database space
- 50 GB bandwidth
- Daily backups

**Vercel Free Tier Limits:**
- 100 GB bandwidth
- Unlimited sites

**Upgrade to Vercel Pro ($20/mo):**
- 1 TB bandwidth
- Advanced analytics

---

## ✅ Deployment Checklist

Before going live:

- [ ] All SQL migrations run successfully
- [ ] Admin user created and tested
- [ ] Environment variables set in Vercel
- [ ] Supabase redirect URLs updated
- [ ] Test signup/login flow
- [ ] Test video upload/edit/delete
- [ ] Test comments (real-time)
- [ ] Test admin panel access
- [ ] Test on mobile devices
- [ ] Check loading times
- [ ] Review Supabase logs for errors
- [ ] Set up monitoring/analytics
- [ ] Backup database (Supabase auto-backups)

---

## 🎉 You're Live!

Your SUNFLIX platform is now deployed and ready for users!

**Admin Access:**
- URL: `https://your-app.vercel.app/admin`
- Email: `admin@sunflix.com`
- Password: `SunShine2025`

**Features Live:**
✅ Real-time video updates
✅ Real-time comments
✅ User authentication
✅ Admin dashboard
✅ Video management
✅ Message system
✅ Watch history
✅ Notifications
✅ Multi-device sync

---

## 📞 Support

If you encounter issues:

1. Check Vercel logs: `vercel logs`
2. Check Supabase logs: Dashboard → API → Logs
3. Review browser console for errors
4. Check network tab for failed requests

**Useful Links:**
- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Vite Docs: https://vitejs.dev

---

## 🔐 Security Notes

**IMPORTANT:**

1. **Never share your service_role key** - It's not needed in frontend
2. **Change default admin password** after first login
3. **Keep .env file private** - Never commit to Git
4. **Review RLS policies** before adding sensitive data
5. **Enable 2FA** on Supabase and Vercel accounts
6. **Monitor suspicious activity** in Supabase Auth logs
7. **Set up email notifications** for failed logins

---

## 🚀 Next Steps

1. Customize branding (colors, logo already set to SUNFLIX)
2. Add more video content
3. Invite users to test
4. Set up custom email templates in Supabase Auth
5. Configure email provider (SMTP) for auth emails
6. Add social auth (Google, Facebook) if needed
7. Set up analytics and monitoring
8. Consider CDN for thumbnails

Enjoy your production-ready SUNFLIX platform! 🎬✨
