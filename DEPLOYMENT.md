# 🚀 Vercel Deployment Guide for IndiPort

This guide will walk you through deploying your IndiPort B2B marketplace to Vercel step by step.

## 📋 Prerequisites

- [Vercel Account](https://vercel.com/signup) (free tier available)
- [GitHub Account](https://github.com) with your project repository
- Node.js 18+ installed locally
- All environment variables ready

## 🔧 Pre-Deployment Setup

### 1. **Environment Variables Setup**
Create a `.env.local` file in your project root with these variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Razorpay Configuration
VITE_RAZORPAY_KEY_ID=your_razorpay_public_key

# App Configuration
VITE_APP_URL=https://your-domain.vercel.app
```

### 2. **Test Build Locally**
Before deploying, test the build process:

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Preview the build
npm run preview
```

If the build succeeds and preview works, you're ready to deploy!

## 🌐 Vercel Deployment Steps

### **Method 1: GitHub Integration (Recommended)**

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click **"New Project"**
   - Import your GitHub repository
   - Select the repository containing your IndiPort project

3. **Configure Project Settings**
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

4. **Environment Variables**
   Add these in the Vercel dashboard:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_RAZORPAY_KEY_ID=your_razorpay_public_key
   VITE_APP_URL=https://your-domain.vercel.app
   ```

5. **Deploy**
   - Click **"Deploy"**
   - Wait for build to complete
   - Your site will be live at the provided URL

### **Method 2: Vercel CLI**

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Follow the prompts**:
   - Link to existing project or create new
   - Set project name
   - Confirm settings
   - Deploy

## ⚙️ Post-Deployment Configuration

### 1. **Custom Domain (Optional)**
- Go to your project in Vercel dashboard
- Navigate to **Settings** → **Domains**
- Add your custom domain
- Update DNS records as instructed

### 2. **Environment Variables Update**
- Update `VITE_APP_URL` to your actual domain
- Redeploy if you change environment variables

### 3. **Supabase Configuration**
- Ensure your Supabase project allows your Vercel domain
- Update CORS settings if needed

## 🔍 Troubleshooting

### **Build Errors**
```bash
# Check for TypeScript errors
npm run type-check

# Check for linting errors
npm run lint

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### **Runtime Errors**
- Check browser console for errors
- Verify environment variables are set correctly
- Ensure Supabase and Razorpay keys are valid

### **404 Errors on Refresh**
- The `vercel.json` file handles this with SPA routing
- If issues persist, check the rewrite rules

## 📱 Performance Optimization

Your project is already optimized with:
- ✅ **Code Splitting**: Vendor, router, and UI chunks
- ✅ **Asset Optimization**: Proper caching headers
- ✅ **Bundle Analysis**: Optimized build output
- ✅ **Lazy Loading**: React Router code splitting

## 🔒 Security Features

The deployment includes:
- ✅ **Security Headers**: X-Frame-Options, X-Content-Type-Options
- ✅ **Referrer Policy**: Strict origin control
- ✅ **Asset Caching**: Optimized cache headers
- ✅ **Environment Variables**: Secure credential management

## 📊 Monitoring & Analytics

After deployment:
- **Vercel Analytics**: Built-in performance monitoring
- **Error Tracking**: Automatic error reporting
- **Performance Metrics**: Core Web Vitals tracking
- **Deployment History**: Rollback capabilities

## 🚀 Next Steps

1. **Test All Features**: Ensure everything works in production
2. **Set Up Monitoring**: Configure error tracking
3. **Performance Testing**: Run Lighthouse audits
4. **SEO Verification**: Check meta tags and structured data
5. **Mobile Testing**: Verify responsive design

## 📞 Support

If you encounter issues:
- Check [Vercel Documentation](https://vercel.com/docs)
- Review [Vercel Community](https://github.com/vercel/vercel/discussions)
- Check your project's build logs in Vercel dashboard

---

**🎉 Congratulations! Your IndiPort marketplace is now live on Vercel!**

*Remember to update your README with the live URL once deployed.*
