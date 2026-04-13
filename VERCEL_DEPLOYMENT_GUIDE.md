# FreshPlate Vercel Deployment Guide

## Prerequisites
- GitHub account with the FreshPlate repository connected
- Vercel account (free tier is sufficient)

## Step-by-Step Deployment

### 1. Connect Your Repository to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Click "Import Git Repository"
4. Find and select your "FreshPlate" repository from GitHub
5. Click "Import"

### 2. Configure Project Settings

After importing, Vercel will show you project settings:

**Framework Preset**: Leave as "Next.js" (auto-detected)

**Root Directory**: Leave empty (already set correctly)

**Environment Variables**: This is the most important step

#### Required Environment Variables

The FreshPlate app uses the free TheMealDB API, which requires NO API keys. However, make sure these are configured:

**No required API keys needed** - TheMealDB is completely free.

If you see any environment variable errors:
- Leave the Environment Variables section empty (click "Skip")
- The app will work fine without any env vars

### 3. Deploy

1. Click "Deploy"
2. Wait for the build to complete (typically 2-3 minutes)
3. Once successful, Vercel will show you your live URL (e.g., `https://freshplate-xxx.vercel.app`)

## Troubleshooting Common Issues

### "This page couldn't load" Error

**Cause**: Build failure during deployment

**Fix**:
1. Check the Build Logs in Vercel Dashboard
2. Look for error messages
3. Common issues and solutions:

#### Missing Dependencies
**Error**: `Module not found: Can't resolve '@/...'`
- The auto-installer should have installed all dependencies
- If not, add them manually in package.json:
  - `zustand` (state management)
  - `uuid` (ID generation)

#### TypeScript Errors
**Error**: Type errors during build
- These should be resolved in v0
- If they appear, check that all imports are correct

### Pages Won't Load After Deployment

**Possible Causes**:
1. Dynamic routes not configured correctly
2. API calls failing

**How to Fix**:
1. In Vercel Dashboard → Settings → Function
2. Increase function timeout to 30 seconds
3. Check Build Logs for any runtime errors

### Environment Variables Not Working

**If you need to add env vars** (for future integrations):
1. Go to Vercel Dashboard → Your Project
2. Click "Settings" → "Environment Variables"
3. Add the variable and select which environments (Development, Preview, Production)
4. Redeploy or click "Redeploy" button

### Blank Page / No Content Loading

**Cause**: API calls to TheMealDB failing

**Check**:
1. Open browser DevTools (F12)
2. Go to "Console" tab
3. Look for any error messages
4. Go to "Network" tab and check if requests to `themealdb.com` are succeeding
5. If blocked, it's likely a CORS issue (already handled in code)

## Environment Variables Reference

For **future integrations**, here's what might be needed:

```env
# Optional - for future paid API features
NEXT_PUBLIC_APP_NAME=FreshPlate
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Optional - for future Spoonacular integration
SPOONACULAR_API_KEY=your_key_here
```

**For now**: Leave all env vars empty. The free TheMealDB API requires no configuration.

## After Deployment

### Testing the Live Site

1. Click the Vercel-provided URL
2. Test these features:
   - Search for a recipe (type "chicken", "pasta", etc.)
   - Browse by category
   - Click on a recipe to view details
   - Add recipes to favorites
   - Use meal planner
   - Check "Similar Recipes" section

### Updating Your Site

Every push to your main branch (or specified branch) will automatically redeploy:

1. Make changes in your code editor
2. Commit and push to GitHub
3. Vercel automatically detects the push
4. New deployment starts automatically
5. Once complete, your live site updates

## Rollback

If something goes wrong after a deployment:

1. Go to Vercel Dashboard → Your Project
2. Click "Deployments"
3. Find the previous working deployment
4. Click the three dots → "Promote to Production"

## Getting Help

If you encounter issues:

1. **Check Vercel Logs**: Dashboard → Deployments → Click latest → "View Build Logs"
2. **Check Function Logs**: Once deployed, check edge function logs
3. **Browser Console**: F12 → Console tab for runtime errors
4. **Vercel Docs**: https://vercel.com/docs/troubleshooting

## Summary

- ✅ No API keys needed (TheMealDB is free)
- ✅ Connect GitHub repo to Vercel
- ✅ Deploy automatically happens
- ✅ All dependencies auto-install
- ✅ Site should work immediately

Your FreshPlate recipe app is ready for production!
