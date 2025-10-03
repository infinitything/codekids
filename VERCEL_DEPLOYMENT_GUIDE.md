# 🚀 Vercel Deployment Guide for CodeKid

## Quick Deploy (5 Minutes)

### Prerequisites
- GitHub account
- Vercel account (free tier works)
- Supabase project set up

---

## Step 1: Prepare Your Repository

```bash
# Ensure all changes are committed
git add .
git commit -m "Production ready"
git push origin main
```

---

## Step 2: Deploy to Vercel

### Option A: One-Click Deploy Button

Click this button to deploy automatically:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/codekid)

### Option B: Manual Deployment

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New Project"**
3. **Import** your GitHub repository
4. Configure project:

```
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Node Version: 18.x
```

---

## Step 3: Environment Variables

Add these in Vercel Project Settings → Environment Variables:

### Required Variables

```bash
# Supabase (Required)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# App Configuration
VITE_APP_NAME=CodeKid
VITE_DEMO_MODE=false
```

### Optional Variables

```bash
# Error Monitoring (Recommended)
VITE_SENTRY_DSN=https://your-sentry-dsn

# Analytics (Recommended)
VITE_GA_ID=G-XXXXXXXXXX

# AI Mentor (Optional)
VITE_OPENROUTER_API_KEY=your-openrouter-key
```

### Getting Supabase Credentials

1. Go to your Supabase project dashboard
2. Click **Settings** → **API**
3. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

---

## Step 4: Configure Custom Domain (Optional)

### Add Domain in Vercel

1. Go to **Project Settings** → **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `codekid.com`)
4. Follow DNS configuration instructions

### Update Supabase Allowed URLs

1. Go to Supabase Dashboard → **Authentication** → **URL Configuration**
2. Add to **Site URL**: `https://your-domain.com`
3. Add to **Redirect URLs**:
   ```
   https://your-domain.com/auth/callback
   https://your-domain.com/auth
   ```

---

## Step 5: Run Database Migrations

### In Supabase SQL Editor

Run these migrations in order:

```sql
-- 1. Initial schema
\i supabase/migrations/001_initial_schema.sql

-- 2. RLS policies
\i supabase/migrations/002_rls_policies.sql

-- 3. Seed data
\i supabase/migrations/003_seed_data.sql

-- 4. Functions & triggers
\i supabase/migrations/004_functions_triggers.sql

-- 5. Fix RLS for parents/students
\i supabase/migrations/005_fix_parents_students_rls.sql

-- 6. XP and streak functions
\i supabase/migrations/006_create_xp_and_streak_functions.sql

-- 7. Newsletter table
\i supabase/migrations/007_create_newsletter_table.sql
```

**Or** copy/paste each file's contents into the SQL Editor and run individually.

---

## Step 6: Configure OAuth (Optional)

### Google OAuth

1. Follow `OAUTH_SETUP_GUIDE.md`
2. Add redirect URI in Google Cloud Console:
   ```
   https://your-project.supabase.co/auth/v1/callback
   https://your-domain.com/auth/callback
   ```
3. Enable Google provider in Supabase:
   - **Authentication** → **Providers** → **Google**
   - Add Client ID and Client Secret
   - Save

### GitHub OAuth

1. Create OAuth App at [github.com/settings/developers](https://github.com/settings/developers)
2. Authorization callback URL:
   ```
   https://your-project.supabase.co/auth/v1/callback
   ```
3. Enable in Supabase with Client ID and Secret

---

## Step 7: Post-Deployment Checklist

### Immediate Testing

- [ ] Visit your deployment URL
- [ ] Test signup flow
- [ ] Test login flow
- [ ] Create a test student account
- [ ] Complete one lesson
- [ ] Verify XP awarded
- [ ] Check dashboard loads
- [ ] Test on mobile device

### Monitor Deployment

```bash
# Check build logs in Vercel Dashboard
# Monitor function logs
# Check analytics (if configured)
```

---

## Step 8: Enable Production Features

### Sentry Error Monitoring

1. Create free account at [sentry.io](https://sentry.io)
2. Create new project (React)
3. Copy DSN
4. Add to Vercel env: `VITE_SENTRY_DSN=your-dsn`
5. Redeploy

### Google Analytics

1. Create GA4 property at [analytics.google.com](https://analytics.google.com)
2. Copy Measurement ID (G-XXXXXXXXXX)
3. Add to Vercel env: `VITE_GA_ID=your-id`
4. Redeploy

---

## Troubleshooting

### Build Fails

**Error**: `Failed to resolve import`
```bash
# Solution: Check package.json dependencies
npm install
npm run build  # Test locally first
```

**Error**: `Environment variables not found`
```bash
# Solution: Ensure VITE_ prefix on all vars
# Redeploy after adding vars
```

### OAuth Redirect Errors

**Error**: `redirect_uri_mismatch`
```bash
# Solution:
1. Check Supabase allowed redirect URLs
2. Verify Google/GitHub OAuth app settings
3. Clear browser cache
```

### Database Connection Issues

**Error**: `relation "students" does not exist`
```bash
# Solution: Run all migrations in Supabase
```

---

## Performance Optimization

### Enable Vercel Analytics

1. Go to **Project Settings** → **Analytics**
2. Click **Enable**
3. Monitor Core Web Vitals

### Enable Edge Functions (Future)

```javascript
// vercel.json
{
  "functions": {
    "src/api/*.ts": {
      "runtime": "edge"
    }
  }
}
```

### Configure Caching

```javascript
// vercel.json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

---

## Continuous Deployment

### Automatic Deployments

Vercel automatically deploys when you:
- Push to `main` branch (production)
- Create pull request (preview deployment)

### Preview Deployments

Every PR gets a unique URL for testing:
```
https://codekid-git-feature-branch.vercel.app
```

### Rollback

If something breaks:
1. Go to **Deployments** in Vercel
2. Find last working deployment
3. Click **⋮** → **Promote to Production**

---

## Security Best Practices

### Environment Variables

- ✅ Never commit `.env` to git
- ✅ Use Vercel env vars for secrets
- ✅ Rotate keys regularly
- ✅ Use different keys for staging/production

### HTTPS Only

```javascript
// vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains"
        }
      ]
    }
  ]
}
```

---

## Monitoring & Alerts

### Set Up Alerts

1. Go to **Project Settings** → **Notifications**
2. Enable:
   - Build failures
   - Deployment errors
   - High error rate

### Uptime Monitoring

Use external service:
- [Better Uptime](https://betteruptime.com) (free tier)
- [UptimeRobot](https://uptimerobot.com) (free tier)

Monitor: `https://your-domain.com/` every 5 minutes

---

## Scaling

### Free Tier Limits
- 100GB bandwidth
- Unlimited deployments
- Automatic SSL
- Edge network

### When to Upgrade
- \> 100GB bandwidth/month
- Need team collaboration
- Want password protection
- Need advanced analytics

---

## Next Steps After Deployment

1. **Test Everything** (use `PRODUCTION_READY_CHECKLIST.md`)
2. **Invite Beta Users** (start with 20-50)
3. **Monitor Metrics** (signups, errors, performance)
4. **Gather Feedback**
5. **Iterate**

---

## Support & Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Vite Documentation](https://vitejs.dev/guide/)

---

## 🎉 You're Live!

Your CodeKid platform is now deployed and accessible worldwide!

**Next**: Share your URL and start onboarding students! 🚀

