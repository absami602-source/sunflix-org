# 🔧 SUNFLIX Troubleshooting Guide

Common issues and their solutions.

## 🚨 Environment Variable Errors

### Error: "Cannot read properties of undefined (reading 'VITE_SUPABASE_URL')"

**Cause**: Environment variables are not being loaded by Vite.

**Solutions**:

#### 1. Check .env File Exists
```bash
# Check if .env file exists in root directory
ls -la .env
```

If it doesn't exist, create it:
```bash
# Create .env file
touch .env
```

Then add:
```env
VITE_SUPABASE_URL=https://ftsajfadgpseqpnznonj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0c2FqZmFkZ3BzZXFwbnpub25qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMyODM4NDQsImV4cCI6MjA3ODg1OTg0NH0.ZHvHZgZpwfvYO3OLNUGyztBTjUrE8KKSEz_OHTrfe1I
```

#### 2. Restart Dev Server

After creating/modifying .env file:
```bash
# Stop server (Ctrl+C)
# Then restart
npm run dev
```

⚠️ **Important**: Vite only loads env variables on startup!

#### 3. Check File Location

The `.env` file MUST be in the **root directory**, not in `/src`:

```
sunflix/
├── .env              ← HERE (root)
├── src/
├── package.json
└── ...
```

#### 4. Check Variable Names

Environment variables for Vite MUST start with `VITE_`:

✅ Correct:
```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

❌ Wrong:
```env
SUPABASE_URL=...
REACT_APP_SUPABASE_URL=...
```

#### 5. No Quotes Needed

```env
# ✅ Correct
VITE_SUPABASE_URL=https://ftsajfadgpseqpnznonj.supabase.co

# ❌ Wrong
VITE_SUPABASE_URL="https://ftsajfadgpseqpnznonj.supabase.co"
```

#### 6. Use .env.local (Alternative)

Create `.env.local` instead (Vite prioritizes this):
```bash
touch .env.local
```

Add the same variables.

---

## 🔐 Authentication Errors

### Error: "User not found" or "Invalid login credentials"

**Solutions**:

#### 1. Verify Admin User Exists

In Supabase Dashboard:
1. Go to **Authentication** → **Users**
2. Check if `admin@sunflix.com` exists
3. If not, create it

#### 2. Check User Metadata

1. Click on the admin user
2. Scroll to **User Metadata**
3. Ensure it has:
```json
{
  "role": "admin",
  "name": "SUNFLIX Admin"
}
```

#### 3. Verify Profile Table

Run in Supabase SQL Editor:
```sql
SELECT id, email, role, approved 
FROM profiles 
WHERE email = 'admin@sunflix.com';
```

Should show:
- `role`: `admin`
- `approved`: `true`

If not, update:
```sql
UPDATE profiles 
SET role = 'admin', approved = true 
WHERE email = 'admin@sunflix.com';
```

#### 4. Reset Password

If password doesn't work:
1. Supabase → Authentication → Users
2. Click on admin user
3. Click **"Send password recovery"**
4. Check email and reset

---

## 🗄️ Database Errors

### Error: "relation 'public.videos' does not exist"

**Cause**: Database tables haven't been created.

**Solution**:

Run the complete setup SQL:
1. Supabase → SQL Editor
2. Copy `/database/COMPLETE_SETUP.sql`
3. Paste and run

OR run individually:
1. `/database/01-schema.sql`
2. `/database/02-policies.sql`
3. `/database/03-functions.sql`

### Error: "permission denied for table videos"

**Cause**: Row Level Security (RLS) policies not set correctly.

**Solution**:

1. Check RLS is enabled:
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

2. Re-run policies:
```sql
-- Copy and run /database/02-policies.sql
```

3. Verify you're logged in as admin

---

## 📦 Build Errors

### Error: "Module not found"

**Solutions**:

#### 1. Install Dependencies
```bash
npm install
```

#### 2. Clear Cache and Reinstall
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

#### 3. Check Node Version
```bash
node -v
```

Should be **18.0.0 or higher**.

If not, update Node:
```bash
# Using nvm
nvm install 18
nvm use 18
```

### Error: "TypeScript errors"

**Solution**:

```bash
# Run TypeScript check
npm run build

# If errors persist, check:
# 1. tsconfig.json exists
# 2. All imports are correct
# 3. Type definitions are installed
```

---

## 🌐 Deployment Errors (Vercel)

### Error: Build fails on Vercel

**Solutions**:

#### 1. Check Environment Variables

In Vercel Dashboard:
1. Your Project → Settings → Environment Variables
2. Add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Redeploy

#### 2. Check Build Logs

```bash
# Locally
vercel logs

# Or in Vercel Dashboard
Your Project → Deployments → Click failed build → View logs
```

#### 3. Test Build Locally

```bash
npm run build
npm run preview
```

If it works locally but fails on Vercel:
- Check Node version in Vercel matches local
- Verify all dependencies in package.json
- Check for environment-specific code

### Error: "Module not found" on deployed site

**Cause**: Environment variables not set in Vercel.

**Solution**:

1. Vercel Dashboard → Settings → Environment Variables
2. Add all `VITE_*` variables
3. Redeploy:
```bash
vercel --prod
```

---

## 🔄 Real-time Not Working

### Videos/Comments don't update in real-time

**Solutions**:

#### 1. Enable Realtime in Supabase

1. Supabase → Database → Replication
2. Enable for these tables:
   - videos
   - comments
   - notifications
   - messages
   - profiles

#### 2. Check WebSocket Connection

Open browser console and look for:
```
WebSocket connection established
```

If not:
- Check network/firewall settings
- Try different browser
- Check Supabase project status

#### 3. Verify Realtime Code

In browser console:
```javascript
// Check if Supabase client has realtime
console.log(window.supabase);
```

---

## 🎥 Video Playback Issues

### Videos not loading

**Solutions**:

#### 1. Check Video URL Format

Valid formats:
```
https://www.youtube.com/watch?v=VIDEO_ID
https://youtu.be/VIDEO_ID
https://vimeo.com/VIDEO_ID
https://www.youtube.com/embed/VIDEO_ID
```

#### 2. Check Embed Permissions

Some videos don't allow embedding. Try different video.

#### 3. Check CORS

If using direct video files, ensure CORS is enabled.

---

## 💾 Data Not Saving

### Changes not persisting

**Solutions**:

#### 1. Check Network Tab

1. Open browser DevTools
2. Go to Network tab
3. Make a change
4. Look for failed requests (red)

#### 2. Check Supabase Logs

1. Supabase Dashboard → Logs
2. Look for errors
3. Check API logs for failed requests

#### 3. Verify RLS Policies

```sql
-- Check if you can insert
INSERT INTO videos (title, url, category) 
VALUES ('Test', 'https://youtube.com/embed/test', 'Tech');

-- If error, check policies
```

---

## 🔒 CORS Errors

### Error: "CORS policy blocked"

**Solutions**:

#### 1. Check Supabase URL Configuration

1. Supabase → Settings → API
2. Verify URL is correct
3. Check CORS settings

#### 2. Update Auth URLs

1. Supabase → Authentication → URL Configuration
2. Add your domain to allowed URLs:
```
https://your-domain.com
https://your-domain.vercel.app
http://localhost:5173
```

---

## 🐛 Browser Console Errors

### How to Check for Errors

1. **Open DevTools**:
   - Chrome: F12 or Ctrl+Shift+I
   - Mac: Cmd+Option+I

2. **Go to Console tab**

3. **Look for red errors**

4. **Common fixes**:
   - Refresh page
   - Clear cache (Ctrl+Shift+Delete)
   - Try incognito mode

---

## 🔄 Cache Issues

### Old data showing / Changes not visible

**Solutions**:

#### 1. Hard Refresh
```
Chrome: Ctrl+Shift+R (Cmd+Shift+R on Mac)
Firefox: Ctrl+F5
Safari: Cmd+Option+E then Cmd+R
```

#### 2. Clear Browser Cache
```
Chrome: Settings → Privacy → Clear browsing data
```

#### 3. Clear Application Storage
```
DevTools → Application → Clear storage → Clear site data
```

---

## 📱 Mobile Issues

### Site not responsive

**Solutions**:

#### 1. Check Viewport Meta Tag

In `index.html`:
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

#### 2. Test Responsive Design

In DevTools:
- Click device toolbar icon
- Test different screen sizes

---

## 🆘 Still Having Issues?

### Debug Checklist

- [ ] .env file exists in root
- [ ] Variables start with `VITE_`
- [ ] Dev server restarted after .env changes
- [ ] Database tables exist
- [ ] RLS policies set
- [ ] Admin user created
- [ ] No console errors
- [ ] Network requests succeed
- [ ] Supabase project active
- [ ] Environment variables set in Vercel (if deployed)

### Get Detailed Logs

```bash
# Check Supabase connection
console.log(import.meta.env.VITE_SUPABASE_URL);

# Check build
npm run build -- --debug

# Check Vercel logs
vercel logs
```

### Contact Support

If nothing works:

1. **Check Supabase Status**: https://status.supabase.com
2. **Check Vercel Status**: https://www.vercel-status.com
3. **Review Documentation**: See README.md
4. **Check Logs**: Supabase + Vercel logs

---

## 💡 Pro Tips

1. **Always restart dev server** after changing .env
2. **Use .env.local** for local overrides
3. **Never commit .env** to Git
4. **Check browser console** first
5. **Test locally** before deploying
6. **Keep dependencies updated**: `npm update`
7. **Backup database** before major changes

---

**Still stuck?** Check:
- 📖 [README.md](./README.md)
- 🚀 [DEPLOYMENT.md](./DEPLOYMENT.md)
- ⚡ [QUICK_START.md](./QUICK_START.md)

**SUNFLIX** - Watch. Shine. Repeat. 🌅✨
