# WSS Planner - Deployment Guide

## 🚀 Repository Information

**GitHub Repository**: https://github.com/curious-inside/WSS-Planner  
**Visibility**: Private  
**Status**: Ready for deployment

## 📋 Quick Deployment Options

### 1. Vercel (Recommended)
```bash
# Clone the repository
git clone https://github.com/curious-inside/WSS-Planner.git
cd WSS-Planner

# Deploy to Vercel
npx vercel

# Set environment variables in Vercel dashboard:
# - MONGODB_URI (MongoDB Atlas connection string)
# - NEXTAUTH_SECRET (generate with: openssl rand -base64 32)
# - NEXTAUTH_URL (your production URL)
```

### 2. Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Deploy
railway login
railway init
railway add
railway up
```

### 3. DigitalOcean App Platform
1. Connect your GitHub repository
2. Set environment variables
3. Deploy with auto-scaling

## 🛠 Environment Variables

### Required Variables
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wss-planner
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-super-secret-key-here
```

### Optional Variables (OAuth)
```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

## 📊 MongoDB Setup

### Option 1: MongoDB Atlas (Recommended)
1. Create account at https://mongodb.com/cloud/atlas
2. Create cluster (free tier available)
3. Create database user
4. Whitelist IP addresses (0.0.0.0/0 for all)
5. Get connection string

### Option 2: Self-hosted MongoDB
```bash
# Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Connection string
MONGODB_URI=mongodb://localhost:27017/wss-planner
```

## 🔐 Security Configuration

### Generate NextAuth Secret
```bash
openssl rand -base64 32
```

### OAuth Setup (Optional)

#### Google OAuth
1. Go to Google Cloud Console
2. Create OAuth 2.0 credentials
3. Add authorized redirect URIs:
   - `https://your-app.vercel.app/api/auth/callback/google`

#### GitHub OAuth
1. Go to GitHub Settings > Developer settings
2. Create OAuth App
3. Authorization callback URL:
   - `https://your-app.vercel.app/api/auth/callback/github`

## 📁 File Structure for Deployment
```
WSS-Planner/
├── app/                 # Next.js App Router
├── components/          # React components
├── lib/                # Utilities
├── models/             # MongoDB models
├── types/              # TypeScript types
├── public/             # Static assets
├── .env.local          # Environment variables (local)
├── .gitignore          # Git ignore rules
├── package.json        # Dependencies
├── tsconfig.json       # TypeScript config
└── next.config.mjs     # Next.js config
```

## 🚦 Deployment Checklist

### Pre-deployment
- [ ] MongoDB database setup
- [ ] Environment variables configured
- [ ] NextAuth secret generated
- [ ] OAuth providers configured (optional)

### During deployment
- [ ] Build process completes successfully
- [ ] Database connection established
- [ ] Authentication working
- [ ] Routes accessible

### Post-deployment
- [ ] Test user registration
- [ ] Test login functionality
- [ ] Test issue creation
- [ ] Test dashboard access
- [ ] Verify responsive design

## 🔧 Build Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Type checking
npx tsc --noEmit

# Linting
npm run lint
```

## 📊 Performance Optimization

### Next.js Optimizations
- Static generation for public pages
- Image optimization enabled
- Automatic code splitting
- Edge runtime for API routes

### Database Optimizations
- Indexed fields for common queries
- Connection pooling with Mongoose
- Aggregation pipelines for reports

### Caching Strategy
- JWT session tokens
- Static assets via CDN
- API response caching

## 🚨 Troubleshooting

### Common Issues

#### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

#### Authentication Issues
- Verify NEXTAUTH_URL matches deployment URL
- Check NEXTAUTH_SECRET is set
- Ensure OAuth redirect URIs are correct

#### Database Connection
- Verify MongoDB URI format
- Check network access in MongoDB Atlas
- Ensure database user has proper permissions

### Error Monitoring
Consider integrating:
- Sentry for error tracking
- LogRocket for session replay
- Vercel Analytics for performance

## 📈 Scaling Considerations

### Traffic Growth
- Enable Vercel Pro for higher limits
- Consider Redis for session storage
- Implement database read replicas

### Feature Expansion
- Microservices architecture for complex features
- Separate API server for heavy operations
- CDN for file uploads and assets

## 🎯 Production URLs

After deployment, your application will be available at:
- **Vercel**: `https://wss-planner.vercel.app`
- **Railway**: `https://wss-planner.up.railway.app`
- **Custom Domain**: Configure in deployment platform

## 📞 Support

For deployment issues:
1. Check the GitHub repository issues
2. Review deployment platform documentation
3. Verify environment variables
4. Check build logs for errors

---

🎉 **Ready to deploy your professional Jira-like project management tool!**