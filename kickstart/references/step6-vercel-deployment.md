# Step 6: Vercel Deployment

Deploy web projects to Vercel with automatic CI/CD from GitHub.

**Note**: This step is **only for web projects** (Next.js, Vite, etc). Skip if mobile-only.

---

## Overview

This step covers:

1. **Create Vercel account** (if needed)
2. **Install Vercel CLI** (optional but useful)
3. **Connect GitHub repository**
4. **Configure environment variables**
5. **Deploy project**
6. **Verify deployment**
7. **Configure custom domain** (optional)

**Time**: 10-15 minutes

---

## Prerequisites

From previous steps:
- [ ] GitHub repository created (Step 5)
- [ ] Code pushed to GitHub
- [ ] Environment variables documented in `.env.example`
- [ ] Project builds successfully locally (`npm run build`)

---

## Step 6.0: Verify Project is Web-Based

### Check Framework

From Step 1, verify this is a web project:
- ✅ Next.js
- ✅ Vite + React
- ✅ Other web frameworks
- ❌ Expo (skip to Step 7)

If web project, continue. If mobile-only, skip to Step 7.

---

## Step 6.1: Create Vercel Account

### Sign Up

1. Go to https://vercel.com/signup
2. Click "Continue with GitHub"
3. Authorize Vercel to access GitHub
4. Complete account creation

**Note**: Free tier includes:
- Unlimited deployments
- Automatic HTTPS
- Serverless functions
- Edge network
- Preview deployments for PRs

---

## Step 6.2: Install Vercel CLI (Optional)

### Why Install CLI?

CLI allows:
- Local development with Vercel environment
- Deploy from terminal
- Manage environment variables via CLI
- Link local project to Vercel project

### Installation

```bash
npm install -g vercel
```

### Login

```bash
vercel login
```

Follow prompts to authenticate.

### Verify

```bash
vercel --version
```

Should show: `Vercel CLI 28.x.x` or similar.

**Note**: CLI is optional. Can do everything via web dashboard.

---

## Step 6.3: Connect GitHub Repository

### Method A: Via Vercel Dashboard (Recommended)

#### 6.3A.1: Import Project

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your GitHub account
4. Find your project repository
5. Click "Import"

#### 6.3A.2: Configure Project

**Framework Preset**:
- Vercel auto-detects framework (Next.js, Vite, etc.)
- Verify detection is correct
- Leave as auto-detected unless wrong

**Root Directory**:
- Leave as `./` unless monorepo
- For monorepo, specify: `apps/web` or similar

**Build Settings**:
- **Build Command**: Usually auto-detected
  - Next.js: `npm run build` or `next build`
  - Vite: `npm run build` or `vite build`
- **Output Directory**: Usually auto-detected
  - Next.js: `.next`
  - Vite: `dist`
- **Install Command**: `npm install` (default)

**Environment Variables**:
- Skip for now (will add in Step 6.4)

#### 6.3A.3: Deploy

Click "Deploy"

Vercel will:
1. Clone your repository
2. Install dependencies
3. Build your project
4. Deploy to production

**Wait 2-5 minutes** for first deployment.

### Method B: Via Vercel CLI

If you prefer CLI:

```bash
# Navigate to project directory
cd your-project

# Initialize Vercel project
vercel

# Follow prompts:
# - Link to existing project? N (first time)
# - Project name: (auto-filled from folder name)
# - Which directory? ./
# - Detect settings? Y
# - Override settings? N

# Deploy to production
vercel --prod
```

---

## Step 6.4: Configure Environment Variables

### 6.4.1: Identify Variables

From your `.env.example`, identify which variables are needed:

**Supabase** (from Step 3):
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

**Other APIs**:
```
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_ANALYTICS_ID
etc.
```

### 6.4.2: Add via Dashboard

1. Go to your project on Vercel
2. Settings → Environment Variables
3. For each variable:
   - **Key**: Variable name (e.g., `NEXT_PUBLIC_SUPABASE_URL`)
   - **Value**: Actual value (from your `.env.local`)
   - **Environments**: Select Production, Preview, Development
4. Click "Save"

**Important**: 
- Add ALL variables from `.env.local`
- Don't forget `NEXT_PUBLIC_` prefix for client-side vars
- Values must match your production Supabase project

### 6.4.3: Add via CLI (Alternative)

```bash
# Add single variable
vercel env add NEXT_PUBLIC_SUPABASE_URL production

# When prompted, paste the value

# Repeat for all variables
```

### 6.4.4: Redeploy After Adding Variables

Environment variables require redeploy:

**Via Dashboard**:
1. Deployments tab
2. Click "..." menu on latest deployment
3. Click "Redeploy"

**Via CLI**:
```bash
vercel --prod
```

---

## Step 6.5: Verify Deployment

### Check Deployment Status

**Via Dashboard**:
1. Go to project page
2. See "Building..." → "Ready"
3. Status should be ✅ Ready

**Via CLI**:
```bash
vercel ls
```

Shows recent deployments.

### Visit Deployment

Click on deployment URL or:

```bash
vercel --prod --url
```

Opens your production URL.

### Test Application

Verify:
- [ ] Site loads correctly
- [ ] Styling applied (theme from Step 4)
- [ ] No console errors
- [ ] Supabase connection works (if applicable)
- [ ] All pages accessible
- [ ] Dark mode works (if implemented)

### Check Deployment Logs

If issues:

**Via Dashboard**:
1. Deployment → Function Logs
2. View build logs and runtime logs

**Via CLI**:
```bash
vercel logs
```

---

## Step 6.6: Configure Custom Domain (Optional)

### Add Domain

1. Project Settings → Domains
2. Click "Add"
3. Enter your domain (e.g., `yourdomain.com`)
4. Vercel provides DNS instructions

### DNS Configuration

**If using domain registrar**:
1. Go to your domain registrar (GoDaddy, Namecheap, etc.)
2. Add DNS records as shown by Vercel:
   - A record: `76.76.21.21`
   - CNAME record: `cname.vercel-dns.com`

**If transferring nameservers to Vercel**:
1. Use Vercel's nameservers:
   - `ns1.vercel-dns.com`
   - `ns2.vercel-dns.com`
2. Update at your registrar
3. Wait for DNS propagation (up to 48 hours)

### Verify Domain

After DNS propagation:
- Visit your custom domain
- Should redirect to Vercel deployment
- HTTPS automatically provisioned

---

## Step 6.7: Configure Automatic Deployments

### Production Branch

By default, Vercel deploys:
- **Production**: Pushes to `main` branch
- **Preview**: Pushes to other branches and PRs

### Configure in Settings

1. Settings → Git
2. **Production Branch**: `main` (or your default branch)
3. **Auto-deploy**: Enabled (default)
4. **Preview deployments**: Enabled (default)

### How It Works

**When you push to `main`**:
1. Vercel detects push via GitHub webhook
2. Automatically builds project
3. Runs tests (if configured)
4. Deploys to production URL
5. Updates custom domain (if configured)

**When you open PR**:
1. Vercel creates preview deployment
2. Unique URL for testing
3. Comments on PR with preview link
4. Updates on every push to PR branch

---

## Step 6.8: Configure Build Settings (Optional)

### Custom Build Command

If you need custom build:

1. Settings → General → Build & Development Settings
2. Override build command:
   ```bash
   npm run build && npm run post-build
   ```

### Framework-Specific Settings

**Next.js**:
- Image optimization enabled by default
- Edge runtime available
- Middleware supported

**Vite**:
- SPA mode by default
- Can configure for SSR

### Environment-Specific Builds

Different commands per environment:

1. Settings → Environment Variables
2. Add build-time variables
3. Use in build scripts

---

## Step 6.9: Update Documentation

### Update docs/tech-stack.md

Add deployment section:

```markdown
## Deployment

### Platform
- **Vercel**: https://vercel.com
- **Production URL**: https://your-app.vercel.app
- **Custom Domain**: https://yourdomain.com (if configured)

### Deployment Process
- Automatic on push to `main`
- Preview deployments on PRs
- Build time: ~2-3 minutes

### Environment Variables
- Configured in Vercel dashboard
- Synced with production Supabase project
- Values in Settings → Environment Variables
```

### Update README.md

Add deployment info:

```markdown
## Deployment

This project is automatically deployed to Vercel.

### Production
🌐 **Live Site**: https://your-app.vercel.app

### Preview Deployments
Every PR gets a preview deployment for testing before merge.

### Manual Deploy
\```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
\```
```

---

## Step 6.10: Optional Vercel Features

### Analytics

Enable Web Analytics:
1. Analytics tab
2. Enable Analytics
3. Free tier includes basic metrics

### Speed Insights

Enable Speed Insights:
1. Speed Insights tab
2. Enable feature
3. Monitors Core Web Vitals

### Serverless Functions

For Next.js API routes:
- Automatically deployed as serverless functions
- Located in `pages/api/` or `app/api/`
- 10s execution limit on free tier

### Edge Functions

For edge runtime:
```typescript
// app/api/hello/route.ts
export const runtime = 'edge'

export async function GET() {
  return new Response('Hello from edge!')
}
```

Deploys to Vercel's edge network.

---

## Final Checklist

After Step 6:

**Account & Setup**:
- [ ] Vercel account created
- [ ] GitHub connected to Vercel
- [ ] CLI installed (optional)

**Deployment**:
- [ ] Project imported to Vercel
- [ ] Framework correctly detected
- [ ] Build settings configured
- [ ] First deployment successful
- [ ] Production URL accessible

**Environment**:
- [ ] All environment variables added
- [ ] Variables match production Supabase
- [ ] Redeployed after adding variables
- [ ] Application works on production URL

**Configuration**:
- [ ] Automatic deployments enabled
- [ ] Preview deployments working
- [ ] Custom domain configured (optional)
- [ ] SSL/HTTPS working

**Testing**:
- [ ] Site loads and works correctly
- [ ] Styling applied properly
- [ ] No console errors
- [ ] Database connection working
- [ ] All features functional

**Documentation**:
- [ ] `docs/tech-stack.md` updated
- [ ] README.md updated with deployment info
- [ ] Production URL documented

---

## Common Issues

### Build fails on Vercel but works locally

**Cause**: Different Node version or missing dependencies

**Solution**:
```json
// package.json
{
  "engines": {
    "node": "20.x"
  }
}
```

Then redeploy.

### Environment variables not working

**Causes**:
- Wrong variable names (case-sensitive)
- Missing `NEXT_PUBLIC_` prefix for client-side
- Not redeployed after adding variables

**Solution**:
1. Verify all variables in Settings → Environment Variables
2. Check prefixes match framework requirements
3. Redeploy project

### "Module not found" errors

**Cause**: Missing dependency in package.json

**Solution**:
```bash
# Locally
npm install missing-package --save

# Commit and push
git add package.json package-lock.json
git commit -m "fix: add missing dependency"
git push
```

### Deployment timeout

**Cause**: Build taking too long (>15 min on free tier)

**Solutions**:
- Optimize build process
- Remove unnecessary build steps
- Check for infinite loops in build
- Upgrade to Pro plan for longer timeouts

### Domain not working

**Causes**:
- DNS not propagated yet (wait 24-48h)
- Wrong DNS records
- DNS cached locally

**Solutions**:
- Verify DNS records match Vercel instructions
- Use DNS checker: https://www.whatsmydns.net/
- Clear local DNS cache
- Wait for propagation

---

## Next Steps

With Vercel deployment complete:

✅ **Production environment** live
✅ **Automatic CI/CD** from GitHub
✅ **Preview deployments** for PRs
✅ **HTTPS** automatically configured

**Next**:
- **Web-only project** → Proceed to Step 8: Tools Validation
- **Web + Mobile project** → Proceed to Step 7: Expo, then Step 8

---

## Additional Resources

**Vercel Documentation**:
- [Vercel Docs](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Custom Domains](https://vercel.com/docs/concepts/projects/domains)

**CLI**:
- [Vercel CLI Documentation](https://vercel.com/docs/cli)
- [CLI Commands Reference](https://vercel.com/docs/cli/commands)

**Features**:
- [Web Analytics](https://vercel.com/analytics)
- [Speed Insights](https://vercel.com/docs/concepts/speed-insights)
- [Edge Functions](https://vercel.com/docs/concepts/functions/edge-functions)

**Troubleshooting**:
- [Build Errors](https://vercel.com/docs/concepts/deployments/troubleshoot-a-build)
- [Runtime Errors](https://vercel.com/docs/concepts/deployments/troubleshoot-runtime-errors)
