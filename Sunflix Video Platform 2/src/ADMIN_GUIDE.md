# 👑 SUNFLIX Admin Guide

Complete guide for managing your SUNFLIX platform.

## 🔐 Admin Access

### Login Credentials (Default)
- **URL**: `https://your-domain.com/admin`
- **Email**: `admin@sunflix.com`
- **Password**: `SunShine2025`

⚠️ **IMPORTANT**: Change your password after first login!

### Changing Admin Password

1. Log in to Supabase Dashboard
2. Go to **Authentication** → **Users**
3. Find your admin user
4. Click **"Reset Password"**
5. Follow the email instructions

---

## 📊 Admin Dashboard

### What You See
- **Total Videos**: Count of published videos
- **Total Users**: Registered user count
- **Total Views**: Cumulative video views
- **Total Messages**: Contact form submissions
- **Recent Activity**: Latest platform actions

### Quick Actions
- Add New Video
- View Messages
- Manage Users
- Update Settings

---

## 🎬 Video Management

### Adding a New Video

1. Click **"Videos"** in sidebar
2. Click **"Add Video"** button
3. Fill in required fields:
   - **Title**: Video name (required)
   - **URL**: Video embed URL (required)
   - **Category**: Select from dropdown (required)
   - **Description**: Brief description
   - **Tags**: Comma-separated (e.g., tech, review, 2025)
   - **Thumbnail**: URL to image (optional)

4. Set video flags:
   - **Featured**: Show in "Editor's Pick" section
   - **Trending**: Mark as trending
   - **Viral**: Mark as viral content
   - **Sponsored**: Mark as sponsored content

5. Set **Status**:
   - **Published**: Visible to all users
   - **Draft**: Only visible to you

6. Click **"Save Video"**

### Supported Video Platforms

✅ **YouTube**
```
https://www.youtube.com/watch?v=VIDEO_ID
https://youtu.be/VIDEO_ID
```

✅ **Vimeo**
```
https://vimeo.com/VIDEO_ID
```

✅ **Dailymotion**
```
https://www.dailymotion.com/video/VIDEO_ID
```

✅ **Direct Embed URLs**
```
https://www.youtube.com/embed/VIDEO_ID
```

### Video URL Format

The system automatically converts video URLs to embed format.

**Example conversions:**
- `youtube.com/watch?v=ABC123` → `youtube.com/embed/ABC123`
- `youtu.be/ABC123` → `youtube.com/embed/ABC123`
- `vimeo.com/123456` → `player.vimeo.com/video/123456`

### Editing Videos

1. Go to **Videos** page
2. Find the video you want to edit
3. Click **Edit** icon (pencil)
4. Modify any fields
5. Click **"Update Video"**

### Deleting Videos

1. Go to **Videos** page
2. Find the video
3. Click **Delete** icon (trash)
4. Confirm deletion

⚠️ **Warning**: Deleted videos cannot be recovered!

### Bulk Actions

Currently supported:
- View all videos
- Filter by status
- Filter by category
- Search by title

---

## 👥 User Management

### Viewing Users

1. Click **"Users"** in sidebar
2. See all registered users
3. View user details:
   - Email
   - Role (User/Admin)
   - Approval status
   - Registration date

### Approving New Users

By default, new user signups require approval:

1. Go to **Users** page
2. Find users with **"Pending"** status
3. Click **"Approve"** button
4. User can now login

### Blocking Users

1. Go to **Users** page
2. Find the user
3. Click **"Block"** button
4. User will be logged out and cannot login

### Promoting Users to Admin

⚠️ **Use with caution!**

**Method 1: Supabase Dashboard**
1. Go to Supabase → Authentication → Users
2. Find the user
3. Edit User Metadata:
   ```json
   {
     "role": "admin",
     "name": "User Name"
   }
   ```
4. Also update in Table Editor → profiles:
   - Set `role` = `admin`

**Method 2: SQL**
```sql
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'user@example.com';
```

### Deleting Users

⚠️ **This is permanent!**

1. Go to Supabase → Authentication → Users
2. Find the user
3. Click **"Delete User"**
4. Confirm deletion

This will cascade delete:
- User profile
- User comments
- User notifications
- Watch history
- Preferences

---

## 📬 Message Management

### Viewing Messages

1. Click **"Messages"** in sidebar
2. See all contact form submissions
3. Messages show:
   - Sender name
   - Email
   - Message content
   - Submission date
   - Read/Unread status

### Message Actions

**Mark as Read/Unread:**
1. Click the envelope icon
2. Status toggles

**Delete Message:**
1. Click the trash icon
2. Confirm deletion

### Filtering Messages

- **All**: Show all messages
- **Unread**: Show only new messages
- **Read**: Show already-read messages

### Responding to Messages

Currently, responses are handled externally via email. Copy the sender's email from the message.

**Future enhancement**: Direct reply from admin panel.

---

## ⚙️ Settings Management

### Site Settings

1. Click **"Settings"** in sidebar
2. Update:
   - **Site Name**: Your platform name
   - **Site Description**: Tagline or description
   - **Logo URL**: URL to your logo image
   - **Favicon URL**: URL to favicon

3. **Social Links**:
   - Facebook
   - Twitter
   - Instagram
   - YouTube

4. Click **"Save Settings"**

### Updating Site Branding

**Colors** (in code):
Edit `/styles/globals.css`:
```css
--color-primary: #FF7E00;      /* Main brand color */
--color-secondary: #6C00FF;    /* Secondary color */
--color-accent: #FFB800;       /* Accent color */
```

**Logo**:
1. Upload logo to image hosting service
2. Copy URL
3. Paste in Settings → Logo URL

---

## 📊 Analytics & Stats

### Available Metrics

**Video Stats:**
- Total views per video
- Like count
- Comment count
- Watch completion rate (coming soon)

**User Stats:**
- Total users
- Active users
- New signups (daily/weekly)
- User engagement

**Platform Stats:**
- Total videos published
- Total comments
- Total messages
- Storage used

### Viewing Stats

1. Dashboard shows overview
2. Each video shows individual stats
3. User page shows user activity

### Exporting Data

**Method 1: Supabase Dashboard**
1. Go to Table Editor
2. Select table (videos, users, etc.)
3. Click **"..."** → **"Download as CSV"**

**Method 2: SQL Query**
```sql
-- Export video stats
SELECT title, views, likes, created_at 
FROM videos 
ORDER BY views DESC;
```

---

## 🎯 Best Practices

### Video Management

1. **Use clear titles**: Make titles descriptive and keyword-rich
2. **Add good thumbnails**: Increases click-through rate
3. **Tag properly**: Helps users find content
4. **Use categories**: Keep content organized
5. **Monitor performance**: Check which videos perform best

### User Management

1. **Approve quickly**: Review pending users daily
2. **Monitor activity**: Check for spam accounts
3. **Engage users**: Respond to comments
4. **Set expectations**: Inform users about approval process

### Content Curation

1. **Featured videos**: Rotate regularly (weekly)
2. **Trending updates**: Keep trending section fresh
3. **Quality control**: Review videos before publishing
4. **Diverse content**: Mix categories for variety

### Security

1. **Strong password**: Use complex admin password
2. **Regular reviews**: Check user activity monthly
3. **Monitor messages**: Watch for suspicious activity
4. **Update regularly**: Keep dependencies updated
5. **Backup data**: Enable Supabase auto-backups

---

## 🚨 Troubleshooting

### Can't Login to Admin Panel

**Check:**
- [ ] Email is exactly: `admin@sunflix.com`
- [ ] Password is correct
- [ ] User exists in Supabase Auth
- [ ] Role is set to `admin` in profiles table

**Fix:**
```sql
-- Verify admin role
SELECT id, email, role FROM profiles WHERE email = 'admin@sunflix.com';

-- If role is wrong, update:
UPDATE profiles SET role = 'admin' WHERE email = 'admin@sunflix.com';
```

### Videos Not Saving

**Check:**
- [ ] URL is valid video link
- [ ] Title is not empty
- [ ] Category is selected
- [ ] Network connection is stable

**Fix:**
1. Check browser console for errors
2. Verify Supabase connection
3. Check RLS policies in Supabase

### Users Can't Sign Up

**Check:**
- [ ] Email is unique
- [ ] Password meets requirements (min 6 chars)
- [ ] Supabase Auth is enabled
- [ ] Network is working

**Fix:**
1. Go to Supabase → Authentication → Providers
2. Ensure Email provider is enabled
3. Check for rate limiting

### Messages Not Appearing

**Check:**
- [ ] User is authenticated as admin
- [ ] RLS policies allow admin to read messages
- [ ] Database connection is working

**Fix:**
```sql
-- Check messages exist
SELECT * FROM messages ORDER BY created_at DESC LIMIT 10;
```

---

## 📈 Growth Tips

### Increasing User Engagement

1. **Regular content**: Post videos consistently
2. **Quality over quantity**: Focus on good content
3. **User interaction**: Respond to comments
4. **Trending content**: Feature popular videos
5. **Email updates**: Notify users of new content

### SEO Optimization

1. **Descriptive titles**: Use keywords in titles
2. **Good descriptions**: Write detailed descriptions
3. **Proper tags**: Use relevant tags
4. **Meta tags**: Update site meta tags
5. **Social sharing**: Enable social media sharing

### Platform Promotion

1. **Social media**: Share on all platforms
2. **Email list**: Build subscriber list
3. **Partnerships**: Collaborate with creators
4. **Cross-promotion**: Feature creators
5. **Community building**: Foster user community

---

## 🔄 Regular Maintenance

### Daily Tasks
- [ ] Approve new users
- [ ] Check new messages
- [ ] Monitor platform performance
- [ ] Review new comments

### Weekly Tasks
- [ ] Update featured videos
- [ ] Review analytics
- [ ] Check for spam content
- [ ] Backup important data

### Monthly Tasks
- [ ] Review user activity
- [ ] Update settings if needed
- [ ] Check storage usage
- [ ] Plan new features
- [ ] Review security

---

## 🆘 Getting Help

### Support Resources

**Documentation:**
- [README.md](./README.md) - Complete setup guide
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment instructions
- [QUICK_START.md](./QUICK_START.md) - Quick start guide

**Supabase:**
- Dashboard: https://app.supabase.com
- Docs: https://supabase.com/docs
- Community: https://discord.supabase.com

**Vercel:**
- Dashboard: https://vercel.com
- Docs: https://vercel.com/docs
- Support: https://vercel.com/support

### Checking Logs

**Supabase Logs:**
1. Go to Supabase Dashboard
2. Click **Logs** (left sidebar)
3. View:
   - API logs
   - Database logs
   - Auth logs

**Vercel Logs:**
```bash
vercel logs
```

Or in Vercel Dashboard → Your Project → Logs

---

## 📝 Admin Checklist

### After Installation
- [ ] Changed admin password
- [ ] Updated site settings
- [ ] Added custom logo
- [ ] Configured social links
- [ ] Added first video
- [ ] Tested user signup
- [ ] Approved test user

### Weekly Review
- [ ] Approved pending users
- [ ] Responded to messages
- [ ] Updated featured videos
- [ ] Checked platform stats
- [ ] Reviewed error logs

### Monthly Review
- [ ] Analyzed user growth
- [ ] Reviewed top videos
- [ ] Checked database size
- [ ] Updated content strategy
- [ ] Planned improvements

---

**SUNFLIX** - Watch. Shine. Repeat. 🌅✨

**Need more help?** Check our other guides or reach out to support!
