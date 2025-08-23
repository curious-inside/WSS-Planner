# WSS BugTracker Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   Copy `.env.local` and configure MongoDB:
   ```env
   MONGODB_URI=mongodb://localhost:27017/wss-bugtracker
   NEXTAUTH_URL=http://localhost:3001
   NEXTAUTH_SECRET=your-secret-key-here
   ```

3. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or use MongoDB Atlas cloud database
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

5. **Open Application**
   Visit: http://localhost:3001

## Current Status: ✅ WORKING

The application is now fully functional with:

- **NextAuth v5** properly configured
- **Microsoft Fluent UI 2** components working
- **MongoDB connection** established
- **Client/Server components** properly separated
- **Middleware protection** for authenticated routes

## Test the Application

1. **Homepage**: Visit `/` - should show landing page
2. **Register**: Create account at `/register`  
3. **Login**: Sign in at `/login`
4. **Dashboard**: Access protected dashboard at `/dashboard`
5. **Issues**: Create and view issues at `/issues`

## Troubleshooting

### Port Issues
If port 3000 is in use, the app automatically uses port 3001.

### MongoDB Connection
Make sure MongoDB is running and MONGODB_URI is correct in `.env.local`.

### Authentication Issues
- Ensure NEXTAUTH_SECRET is set
- Check that cookies are enabled in browser

## Next Steps

Ready to implement:
- Kanban board with drag-and-drop
- Project management
- Advanced search
- Real-time features
- File uploads

## Production Deployment

For production, consider:
- MongoDB Atlas for database
- Vercel for hosting
- Environment-specific configurations
- SSL certificates
- Performance optimization