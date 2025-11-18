# 🔄 SUNFLIX Data Migration Guide

## If You Have Existing LocalStorage Data

If you were previously running SUNFLIX with localStorage and want to migrate your data to Supabase, follow this guide.

## ⚠️ Important Notes

1. **This is optional** - The default SQL migrations already include sample videos
2. **Backup first** - Export your localStorage data before migration
3. **Users need to re-register** - Passwords were stored in localStorage (not secure), users must create new accounts in Supabase
4. **Admin accounts** - Must be created fresh in Supabase Auth

## 📊 What Data Can Be Migrated?

✅ **Can be migrated:**
- Videos (title, URL, description, tags, views, likes, etc.)
- Settings (site name, description, social links)
- Messages (contact form submissions)

❌ **Cannot be migrated:**
- User accounts (must re-register for security)
- Passwords (need to be reset through Supabase Auth)
- User sessions (will need to log in again)

## 🔧 Migration Steps

### Step 1: Export LocalStorage Data

Open your browser console (F12) on your old SUNFLIX site and run:

```javascript
// Export videos
const videos = localStorage.getItem('sunflix-videos');
const videosData = JSON.parse(videos || '[]');
console.log('Videos:', videosData);

// Copy this output and save it to a file: videos-export.json
```

```javascript
// Export messages
const messages = localStorage.getItem('sunflix-messages');
const messagesData = JSON.parse(messages || '[]');
console.log('Messages:', messagesData);

// Copy this output and save it to a file: messages-export.json
```

```javascript
// Export settings
const settings = localStorage.getItem('sunflix-settings');
const settingsData = JSON.parse(settings || '{}');
console.log('Settings:', settingsData);

// Copy this output and save it to a file: settings-export.json
```

### Step 2: Prepare Migration SQL

After exporting your data, create SQL INSERT statements.

#### For Videos:

```sql
-- Example video migration (adjust values from your export)
INSERT INTO public.videos (
  title, url, description, tags, thumbnail, views, likes, 
  category, status, featured, trending, viral, sponsored
) VALUES 
(
  'Your Video Title',
  'https://youtube.com/embed/...',
  'Video description',
  ARRAY['tag1', 'tag2', 'tag3'],
  'thumbnail_url',
  1000,
  50,
  'Tech',
  'published',
  true,
  false,
  false,
  false
);

-- Repeat for each video
```

#### For Messages:

```sql
-- Example message migration
INSERT INTO public.messages (name, email, message, read) VALUES 
('John Doe', 'john@example.com', 'Message content here', false);

-- Repeat for each message
```

#### For Settings:

```sql
-- Update global settings
UPDATE public.settings 
SET 
  site_name = 'SUNFLIX',
  site_description = 'Watch. Shine. Repeat.',
  social_links = '{"facebook": "url", "twitter": "url"}'::jsonb
WHERE id = 'global';
```

### Step 3: Run Migration SQL

1. Go to your Supabase project
2. Open **SQL Editor**
3. Paste your migration SQL
4. Click **Run**

### Step 4: Verify Data

Check each table in Supabase:
1. Go to **Table Editor**
2. View:
   - `videos` table
   - `messages` table
   - `settings` table
3. Verify all data is correct

## 🔐 User Account Migration

Users **cannot** migrate accounts directly due to security reasons. Instead:

### For Regular Users:

1. Inform users they need to create new accounts
2. Send them registration link: `https://your-app.com/signup`
3. They sign up with the same email
4. Admin approves them in admin panel

### For Admin Accounts:

1. Create admin in Supabase Auth (see main README.md)
2. Or use SQL Editor:

```sql
-- Update existing user to admin
UPDATE public.profiles 
SET role = 'admin', approved = true 
WHERE email = 'admin@sunflix.com';
```

## 🧹 Clean Up

After successful migration:

1. **Clear localStorage** in browser:
```javascript
// In browser console
localStorage.clear();
```

2. **Test everything**:
   - ✅ Videos display correctly
   - ✅ Settings are applied
   - ✅ Messages appear in admin panel
   - ✅ Users can sign up/login
   - ✅ Admin panel works

3. **Backup Supabase**:
   - Go to Supabase → Settings → Backups
   - Enable automatic backups
   - Or manually export database

## 🤖 Automated Migration Script (Advanced)

If you have many videos, create a Node.js script:

```javascript
// migrate-videos.js
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_ANON_KEY';
const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateVideos() {
  // Read exported data
  const videos = JSON.parse(fs.readFileSync('./videos-export.json', 'utf8'));
  
  for (const video of videos) {
    const { data, error } = await supabase
      .from('videos')
      .insert([{
        title: video.title,
        url: video.url,
        description: video.description,
        tags: video.tags,
        thumbnail: video.thumbnail,
        views: video.views,
        likes: video.likes,
        category: video.category,
        status: video.status,
        featured: video.featured,
        trending: video.trending,
        viral: video.viral,
        sponsored: video.sponsored,
      }]);
    
    if (error) {
      console.error('Error migrating video:', video.title, error);
    } else {
      console.log('Migrated:', video.title);
    }
  }
  
  console.log('Migration complete!');
}

migrateVideos();
```

Run with:
```bash
node migrate-videos.js
```

## 🆘 Troubleshooting

### Migration Fails

**Error: "duplicate key value"**
- Videos with same ID already exist
- Solution: Remove ID from INSERT or use different values

**Error: "permission denied"**
- Not enough permissions
- Solution: Use service_role key temporarily (be careful!)

**Error: "invalid input syntax"**
- Data format doesn't match table schema
- Solution: Check data types (arrays, booleans, etc.)

### Data Missing After Migration

1. Check Supabase logs (Dashboard → API → Logs)
2. Verify RLS policies allow reading
3. Try as admin user
4. Check if data is in draft status

## ✅ Migration Checklist

Before migration:
- [ ] Backed up localStorage data
- [ ] Exported all videos, messages, settings
- [ ] Saved exports to files

During migration:
- [ ] Created migration SQL scripts
- [ ] Tested one record first
- [ ] Ran full migration
- [ ] Verified data in Supabase

After migration:
- [ ] All videos appear on frontend
- [ ] Settings are correct
- [ ] Messages visible in admin panel
- [ ] Created new admin account
- [ ] Informed users to re-register
- [ ] Cleared localStorage

## 🎯 Best Practices

1. **Migrate in batches** - Don't insert 1000 videos at once
2. **Test first** - Migrate 1-2 records, verify, then do all
3. **Keep backups** - Don't delete localStorage data immediately
4. **Inform users** - Let them know about the migration
5. **Set maintenance mode** - Put up a notice during migration

## 📞 Need Help?

If migration fails:
1. Check your data format matches Supabase schema
2. Review SQL error messages carefully
3. Verify column names (snake_case vs camelCase)
4. Ensure data types match (TEXT, INTEGER, BOOLEAN, etc.)

## 🎉 Success!

Once migration is complete:
- ✅ All data is in Supabase
- ✅ Real-time features are active
- ✅ Users can register/login
- ✅ Admin panel has full control
- ✅ Platform is production-ready

Your SUNFLIX platform is now running on a real database! 🚀
