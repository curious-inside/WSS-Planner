# WSS BugTracker

A comprehensive web-based project management and bug tracking application built with Next.js, MongoDB, and Microsoft Fluent UI 2.

## Features

### ✅ Completed
- **Authentication System**: NextAuth.js with email/password and OAuth (Google, GitHub)
- **Modern UI**: Microsoft Fluent UI 2 design system
- **Database**: MongoDB with Mongoose ODM
- **User Management**: Role-based access control
- **Issue Management**: Create, view, and manage issues with different types and priorities
- **Dashboard**: Overview with statistics and recent activity
- **Responsive Design**: Works on desktop and mobile devices

### 🚧 In Progress
- Kanban board with drag-and-drop
- Project and organization management
- Advanced search functionality
- Reporting and analytics

### 📋 Planned
- Scrum board and sprint management
- Real-time collaboration
- File attachments
- Email notifications
- API integrations
- Mobile app (React Native)

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Microsoft Fluent UI 2
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **Styling**: Fluent UI 2 Design Tokens
- **Validation**: Zod
- **Forms**: React Hook Form

## Getting Started

### Prerequisites

- Node.js 20+ LTS
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wss-bugtracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` and configure:
   ```env
   # MongoDB
   MONGODB_URI=mongodb://localhost:27017/wss-bugtracker
   
   # NextAuth
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   
   # OAuth (optional)
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   ```

4. **Start MongoDB**
   - Local: `mongod`
   - Or use MongoDB Atlas cloud database

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Visit [http://localhost:3000](http://localhost:3000)

## Usage

### First Time Setup

1. **Create an Account**: Visit `/register` to create your first user account
2. **Sign In**: Use your credentials or OAuth to sign in
3. **Explore**: Navigate through the dashboard to explore features

### Creating Issues

1. Navigate to **Issues** page
2. Click **Create Issue** button
3. Fill in the issue details:
   - **Title**: Brief description of the issue
   - **Description**: Detailed explanation
   - **Type**: Bug, Story, Task, Epic, or Improvement
   - **Priority**: Critical, High, Medium, or Low
4. Submit to create the issue

### Dashboard

- **Overview**: Statistics and key metrics
- **Recent Issues**: Latest issues across projects
- **Quick Actions**: Fast access to common tasks

## Project Structure

```
wss-bugtracker/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Protected dashboard pages
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # Reusable React components
├── lib/                   # Utility functions and configurations
├── models/                # MongoDB/Mongoose models
├── types/                 # TypeScript type definitions
├── utils/                 # Helper functions
└── public/                # Static assets
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/[...nextauth]` - NextAuth.js endpoints

### Issues
- `GET /api/issues` - Get issues list
- `POST /api/issues` - Create new issue
- `GET /api/issues/[id]` - Get specific issue
- `PUT /api/issues/[id]` - Update issue
- `DELETE /api/issues/[id]` - Delete issue

## Database Schema

### Users
- Email, password, name, avatar
- Role-based permissions
- Organization and team associations

### Issues
- Title, description, type, status, priority
- Assignment and reporting
- Time tracking and labels
- Attachments and comments

### Projects
- Name, key, description
- Team members and permissions
- Issue types and workflows

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## Development Roadmap

### Phase 1: Foundation ✅
- [x] Next.js setup with TypeScript
- [x] MongoDB integration
- [x] Authentication system
- [x] Basic UI with Fluent UI 2
- [x] User management
- [x] Issue CRUD operations

### Phase 2: Core Features 🚧
- [ ] Kanban board with drag-and-drop
- [ ] Project management
- [ ] Organization management
- [ ] Advanced search and filtering

### Phase 3: Agile Features
- [ ] Scrum board
- [ ] Sprint management
- [ ] Backlog management
- [ ] Burndown charts
- [ ] Velocity tracking

### Phase 4: Advanced Features
- [ ] Real-time collaboration (Socket.io)
- [ ] File attachments (AWS S3)
- [ ] Email notifications
- [ ] Automation rules
- [ ] Custom fields and workflows

### Phase 5: Integration & Scale
- [ ] REST and GraphQL APIs
- [ ] Webhook support
- [ ] Third-party integrations (GitHub, Slack)
- [ ] Performance optimization
- [ ] Mobile app

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/wss-bugtracker/issues) page
2. Create a new issue with detailed information
3. Contact the development team

---

Built with ❤️ using Next.js, MongoDB, and Microsoft Fluent UI 2