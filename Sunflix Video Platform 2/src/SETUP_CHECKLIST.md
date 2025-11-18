# ✅ SUNFLIX Setup Checklist

Use this checklist to ensure your SUNFLIX platform is properly set up and ready for deployment.

## 📦 Initial Setup

### 1. Project Installation
- [ ] Downloaded/cloned SUNFLIX project
- [ ] Opened project in VS Code or preferred editor
- [ ] Ran `npm install` successfully
- [ ] No installation errors

### 2. Environment Configuration
- [ ] `.env` file exists in root directory
- [ ] `VITE_SUPABASE_URL` is set correctly
- [ ] `VITE_SUPABASE_ANON_KEY` is set correctly
- [ ] `.env` is in `.gitignore` (never commit!)

## 🗄️ Supabase Database Setup

### 3. Supabase Project
- [ ] Created Supabase account
- [ ] Created new Supabase project
- [ ] Project is fully initialized (2-3 minutes wait)
- [ ] Can access project dashboard

### 4. Database Schema
- [ ] Opened SQL Editor in Supabase
- [ ] Ran `/database/01-schema.sql` successfully
- [ ] All tables created (profiles, videos, comments, etc.)
- [ ] No errors in SQL execution
- [ ] Sample videos inserted

### 5. Row Level Security (RLS)
- [ ] Ran `/database/02-policies.sql` successfully
- [ ] RLS enabled on all tables
- [ ] All policies created without errors
- [ ] Can view policies in Database → Policies

### 6. Database Functions
- [ ] Ran `/database/03-functions.sql` successfully
- [ ] All functions created
- [ ] All triggers created
- [ ] No errors in SQL execution

### 7. Realtime Features (Optional but Recommended)
- [ ] Went to Database → Replication
- [ ] Enabled replication for `videos`
- [ ] Enabled replication for `comments`
- [ ] Enabled replication for `notifications`
- [ ] Enabled replication for `messages`
- [ ] Enabled replication for `profiles`

## 👤 Admin Account Setup

### 8. Create Admin User
Choose one method:

**Method A: Supabase Dashboard**
- [ ] Went to Authentication → Users
- [ ] Clicked "Add User"
- [ ] Email: `admin@sunflix.com`
- [ ] Password: `SunShine2025`
- [ ] Auto Confirm User: ✅ Checked
- [ ] User created successfully
- [ ] Opened user details
- [ ] Added to User Metadata: `{"role": "admin", "name": "SUNFLIX Admin"}`
- [ ] Saved changes

**Method B: SQL Editor**
- [ ] Ran profile update SQL:
```sql
UPDATE public.profiles 
SET role = 'admin', approved = true 
WHERE email = 'admin@sunflix.com';
```
- [ ] Verified role is 'admin' in profiles table

## 🧪 Local Testing

### 9. Development Server
- [ ] Ran `npm run dev` successfully
- [ ] Server started without errors
- [ ] Opened http://localhost:5173
- [ ] Homepage loads correctly
- [ ] Videos are displayed
- [ ] No console errors in browser

### 10. User Features Testing
- [ ] Can browse videos
- [ ] Video player works
- [ ] Can click on video cards
- [ ] Categories filter works
- [ ] Search functionality works

### 11. Authentication Testing
**Sign Up:**
- [ ] Went to /signup
- [ ] Created test user account
- [ ] Received success message
- [ ] Account appears in Supabase Auth → Users

**Login:**
- [ ] Went to /login
- [ ] Tried login with test account
- [ ] Login successful or shows "pending approval" message
- [ ] No errors

**Admin Login:**
- [ ] Went to /admin
- [ ] Logged in with admin@sunflix.com / SunShine2025
- [ ] Successfully redirected to admin dashboard
- [ ] Can see admin menu items

### 12. Admin Panel Testing
- [ ] Dashboard shows statistics
- [ ] Videos page loads
- [ ] Can view all videos
- [ ] Can edit a video
- [ ] Can delete a video
- [ ] Can create new video
- [ ] Users page loads
- [ ] Can approve test user
- [ ] Messages page loads
- [ ] Settings page loads
- [ ] Can update settings

### 13. Real-time Features Testing
- [ ] Opened site in two browser windows
- [ ] Added comment in first window
- [ ] Comment appears in second window (real-time)
- [ ] Liked video in first window
- [ ] Like count updates in second window

## 🚀 Production Deployment

### 14. Pre-Deployment Checks
- [ ] All features working locally
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Ran `npm run build` successfully
- [ ] Build completed without errors
- [ ] Tested build with `npm run preview`

### 15. Vercel Deployment
**Initial Deploy:**
- [ ] Created Vercel account (or logged in)
- [ ] Installed Vercel CLI: `npm install -g vercel`
- [ ] Ran `vercel login`
- [ ] Ran `vercel` to deploy
- [ ] Deployment successful
- [ ] Got deployment URL

**Environment Variables:**
- [ ] Ran `vercel env add VITE_SUPABASE_URL`
- [ ] Ran `vercel env add VITE_SUPABASE_ANON_KEY`
- [ ] Both variables added successfully

**Production Deploy:**
- [ ] Ran `vercel --prod`
- [ ] Production deployment successful
- [ ] Visited production URL
- [ ] Site loads correctly

### 16. Post-Deployment Configuration
**Supabase Auth URLs:**
- [ ] Opened Supabase Dashboard
- [ ] Went to Authentication → URL Configuration
- [ ] Set Site URL to production URL
- [ ] Added production URL to Redirect URLs
- [ ] Added `http://localhost:5173/**` for development
- [ ] Saved changes

**Test Production:**
- [ ] Opened production URL
- [ ] Homepage loads
- [ ] Videos display
- [ ] Can sign up new user
- [ ] Can login
- [ ] Admin panel accessible
- [ ] All features work
- [ ] No errors in browser console

## 🔒 Security Checks

### 17. Security Verification
- [ ] `.env` file is in `.gitignore`
- [ ] Never committed `.env` to Git
- [ ] Using `VITE_SUPABASE_ANON_KEY` (not service_role)
- [ ] RLS is enabled on all tables
- [ ] Admin role requires authentication
- [ ] Test user cannot access admin panel
- [ ] Changed default admin password
- [ ] 2FA enabled on Supabase account
- [ ] 2FA enabled on Vercel account

## 📊 Final Verification

### 18. Complete Feature Test
**Public Features:**
- [ ] Browse videos
- [ ] Watch videos
- [ ] Search works
- [ ] Filter by category
- [ ] View video details
- [ ] Submit contact form

**User Features:**
- [ ] User can sign up
- [ ] User can login
- [ ] User can comment
- [ ] User can like videos
- [ ] User can view profile
- [ ] User can edit profile
- [ ] User gets notifications

**Admin Features:**
- [ ] Admin can login
- [ ] Create videos
- [ ] Edit videos
- [ ] Delete videos
- [ ] Approve users
- [ ] View messages
- [ ] Update settings
- [ ] View analytics

### 19. Performance Checks
- [ ] Page load time < 3 seconds
- [ ] Images load properly
- [ ] No layout shifts
- [ ] Smooth scrolling
- [ ] Responsive on mobile
- [ ] Responsive on tablet
- [ ] Responsive on desktop

### 20. Browser Compatibility
- [ ] Tested in Chrome
- [ ] Tested in Firefox
- [ ] Tested in Safari
- [ ] Tested in Edge
- [ ] Works on mobile browsers

## 🎉 Launch Checklist

### 21. Pre-Launch
- [ ] All features tested
- [ ] No critical bugs
- [ ] Admin password changed
- [ ] Backup database configured
- [ ] Analytics set up (optional)
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active (automatic with Vercel)

### 22. Launch Day
- [ ] Announced launch
- [ ] Monitoring errors
- [ ] Checking Supabase logs
- [ ] Checking Vercel logs
- [ ] Responding to user feedback

### 23. Post-Launch
- [ ] Monitor user signups
- [ ] Approve new users
- [ ] Check for errors daily
- [ ] Review analytics
- [ ] Plan feature updates

## 📝 Documentation

### 24. Documentation Review
- [ ] Read README.md
- [ ] Read DEPLOYMENT.md
- [ ] Understand database schema
- [ ] Know how to update content
- [ ] Know how to add videos
- [ ] Know how to manage users
- [ ] Know where to check logs

## 🆘 Emergency Contacts

### 25. Support Resources
- [ ] Bookmarked Supabase dashboard
- [ ] Bookmarked Vercel dashboard
- [ ] Saved Supabase docs link
- [ ] Saved Vercel docs link
- [ ] Know how to check logs
- [ ] Know how to rollback deployment

---

## 🎊 Congratulations!

If you've checked all boxes, your SUNFLIX platform is:

✅ **Fully Functional** - All features working
✅ **Production Ready** - Deployed and accessible
✅ **Secure** - RLS policies protecting data
✅ **Real-time** - Live updates enabled
✅ **Scalable** - Running on Supabase + Vercel
✅ **Monitored** - Logs and analytics active

**Your platform is ready for users!** 🚀

---

## 🔄 Regular Maintenance

### Weekly
- [ ] Check error logs
- [ ] Review new user signups
- [ ] Approve pending users
- [ ] Respond to messages
- [ ] Check analytics

### Monthly
- [ ] Review database size
- [ ] Check bandwidth usage
- [ ] Update dependencies
- [ ] Backup database
- [ ] Review security

### Quarterly
- [ ] Update Node packages
- [ ] Review and optimize queries
- [ ] Check for Supabase updates
- [ ] Plan new features
- [ ] User feedback review

---

**Need Help?**
- 📖 See [README.md](./README.md)
- 🚀 See [DEPLOYMENT.md](./DEPLOYMENT.md)
- 🔄 See [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)

---

**SUNFLIX** - Watch. Shine. Repeat. 🌅✨
