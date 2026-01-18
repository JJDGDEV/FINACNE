# Deploying to Vercel

This financial dashboard is optimized for deployment on Vercel. Follow these steps to deploy:

## Method 1: Deploy with Vercel Dashboard (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will automatically detect Next.js
   - Click "Deploy"

That's it! Your dashboard will be live in minutes.

## Method 2: Deploy with Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd financial-dashboard
   vercel
   ```

3. **Follow the prompts**
   - Link to existing project or create new one
   - Confirm settings
   - Deploy!

## After Deployment

Your financial dashboard will be available at:
- Production: `https://your-project.vercel.app`
- Every git push will automatically deploy

## Features That Work on Vercel

✅ All data is stored in browser localStorage (no backend needed)
✅ Fast loading with Next.js optimizations
✅ Automatic HTTPS
✅ Global CDN
✅ Automatic builds on push
✅ Preview deployments for pull requests

## Custom Domain (Optional)

1. Go to your project settings on Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Update DNS records as instructed

Enjoy your financial dashboard! 💰
