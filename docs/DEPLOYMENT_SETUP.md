# 🚀 Luna AI Platform - Deployment Guide

## 📋 Quick Setup for Vercel Deployment

### 1. Environment Variables Setup

Before deploying to Vercel, you need to set up your environment variables:

1. **Copy the example environment file:**
   ```bash
   cp env.production.example .env.local
   ```

2. **Edit `.env.local` with your actual values:**
   - Get an OpenRouter API key from [OpenRouter](https://openrouter.ai/)
   - Generate a secure JWT secret
   - Set up Stripe keys (optional)
   - Configure email settings (optional)

### 2. Vercel Deployment

#### Option A: Deploy via Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository: `Michaelrobins938/LunaAi`
4. Configure the following settings:
   - **Framework Preset:** Next.js
   - **Root Directory:** `./` (default)
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`

#### Option B: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

### 3. Environment Variables in Vercel

After creating your Vercel project, add these environment variables in the Vercel dashboard:

#### Required Variables:
```
DATABASE_URL=file:./dev.db
JWT_SECRET=your-secure-jwt-secret
OPENROUTER_API_KEY=sk-or-v1-your-openrouter-key
OPENROUTER_API_URL=https://openrouter.ai/api/v1/chat/completions
OPENROUTER_MODEL=openai/gpt-4o
NEXT_PUBLIC_BASE_URL=https://your-vercel-domain.vercel.app
NODE_ENV=production
```

#### Optional Variables:
```
# Stripe (for payments)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Redis (for caching)
REDIS_URL=redis://localhost:6379

# Monitoring
SENTRY_DSN=your-sentry-dsn
LOG_LEVEL=info
```

### 4. Database Setup

For production, you'll need a PostgreSQL database. Options:

1. **Vercel Postgres** (Recommended)
   - Go to your Vercel project dashboard
   - Navigate to Storage → Create Database
   - Choose Postgres
   - Update your `DATABASE_URL` environment variable

2. **External Database** (Supabase, PlanetScale, etc.)
   - Set up your database
   - Update `DATABASE_URL` with your connection string

### 5. Build Configuration

Your `package.json` already has the correct build script:
```json
{
  "scripts": {
    "build": "next build",
    "vercel-build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

### 6. Domain Setup (Optional)

1. In your Vercel project dashboard, go to Settings → Domains
2. Add your custom domain
3. Update `NEXT_PUBLIC_BASE_URL` to match your domain

### 7. Post-Deployment

After deployment:

1. **Test your application** at your Vercel URL
2. **Check the logs** in Vercel dashboard for any errors
3. **Monitor performance** using Vercel Analytics
4. **Set up monitoring** (optional) with Sentry or similar

### 8. Troubleshooting

#### Common Issues:

1. **Build fails:**
   - Check that all environment variables are set
   - Ensure `NODE_ENV=production` is set

2. **Database connection fails:**
   - Verify your `DATABASE_URL` is correct
   - Ensure your database is accessible from Vercel

3. **API calls fail:**
   - Check your OpenRouter API key is valid
   - Verify CORS settings if needed

4. **Environment variables not working:**
   - Redeploy after adding new environment variables
   - Check variable names match exactly

### 9. Security Checklist

- [ ] JWT_SECRET is a strong, random string
- [ ] All API keys are kept secure
- [ ] Database connection uses SSL in production
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled
- [ ] Error logging is set up

### 10. Performance Optimization

- [ ] Enable Vercel Edge Functions for API routes
- [ ] Set up CDN for static assets
- [ ] Configure caching headers
- [ ] Monitor Core Web Vitals

---

## 🎉 Your Luna AI Platform is Ready!

Once deployed, your application will be available at your Vercel URL. You can now:

- Share the demo with stakeholders
- Test all features in production
- Monitor performance and usage
- Iterate and improve based on feedback

For support or questions, check the main README.md file or create an issue in the repository. 