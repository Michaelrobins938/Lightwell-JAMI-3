# LitRPG Unlimited

A modern, immersive LitRPG gaming platform with real-time character progression, epic quests, and a thriving community.

## 🎮 Project Overview

LitRPG Unlimited combines the best of gaming and personal development, where your real-life skills translate into game power. Level up, complete quests, and become the ultimate hero in this immersive experience.

## 🏗️ Architecture

### Backend (Node.js + TypeScript + Express)
- **Location**: `src/` directory
- **API Server**: RESTful API with Socket.IO for real-time features
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based auth system
- **Features**: User management, quests, achievements, guilds

### Frontend (Next.js 15 + React 19 + TypeScript)
- **Location**: `litrpg-frontend/` directory
- **UI Framework**: Modern React with Tailwind CSS
- **Components**: Beautiful, responsive UI components
- **Features**: Character creation, quest tracking, real-time updates

### Legacy Frontend (HTML/CSS/JS)
- **Location**: `public/` directory
- **Purpose**: Static pages served by the backend
- **Status**: Being replaced by React frontend

## 🚀 Quick Start

### Backend Development
```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Start development server
npm run dev

# Start production server
npm start
```

### Frontend Development
```bash
# Navigate to frontend directory
cd litrpg-frontend

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev

# Build for production
npm run build
```

## 🌟 Key Features

### 🎯 Character Progression
- Real skill-based leveling system
- Customizable character builds
- Achievement tracking
- Skill trees and specializations

### ⚔️ Epic Quests
- Dynamic quest generation
- Multi-step challenges
- Real-time progress tracking
- Reward systems

### 👥 Guild System
- Create and manage guilds
- Collaborative challenges
- Guild achievements
- Community features

### 🏆 Achievement System
- Rare and legendary achievements
- Title system
- Progress tracking
- Social sharing

### 🔄 Real-time Features
- Live character updates
- Real-time quest progress
- Guild chat and coordination
- Live leaderboards

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB
- **ORM**: Mongoose
- **Authentication**: JWT
- **Real-time**: Socket.IO
- **Email**: Nodemailer

### Frontend
- **Framework**: Next.js 15
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: React Hooks

## 📁 Project Structure

```
LitRPG-Unlimited-main/
├── src/                    # Backend TypeScript source
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Auth middleware
│   └── server.ts          # Main server file
├── litrpg-frontend/       # React frontend
│   ├── src/
│   │   ├── app/          # Next.js app router
│   │   ├── components/   # React components
│   │   └── lib/          # Utilities and config
│   └── package.json
├── public/                # Static files (legacy)
├── dist/                  # Compiled backend
└── package.json           # Backend dependencies
```

## 🔧 API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/forgot-password` - Password reset
- `GET /auth/activate/:token` - Account activation

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get specific user
- `POST /users` - Create user

### API Info
- `GET /` - Main page (serves React app)
- `GET /api/health` - Health check
- `GET /api` - API information

## 🎨 UI Components

The React frontend includes beautiful, modern components:
- **Hero Section**: Animated title with gaming theme
- **Features**: Interactive feature showcase
- **Testimonials**: User testimonials with images
- **Pricing**: Subscription tiers
- **Footer**: Social links and navigation

## 🚀 Deployment

### Backend (Vercel)
- **URL**: https://lit-rpg-main-5nwafi5bm-michaels-projects-19e37f0b.vercel.app
- **Status**: ✅ Deployed and running
- **Features**: API endpoints, static file serving

### Frontend (Development)
- **URL**: http://localhost:3001 (when running)
- **Status**: 🚧 In development
- **Features**: Modern React UI, gaming theme

## 🔄 Integration Plan

### Phase 1: ✅ Complete
- [x] Backend TypeScript conversion
- [x] API endpoints setup
- [x] Vercel deployment
- [x] React frontend setup
- [x] LitRPG branding

### Phase 2: 🚧 In Progress
- [ ] API integration with React frontend
- [ ] Character creation interface
- [ ] Quest system UI
- [ ] Real-time features

### Phase 3: 📋 Planned
- [ ] User authentication in React
- [ ] Guild management interface
- [ ] Achievement showcase
- [ ] Mobile responsiveness
- [ ] Performance optimization

## 🎯 Next Steps

1. **API Integration**: Connect React frontend to backend APIs
2. **Authentication**: Implement login/register in React
3. **Character System**: Build character creation and management UI
4. **Quest Interface**: Create quest tracking and completion UI
5. **Real-time Features**: Implement Socket.IO in React
6. **Deployment**: Deploy React frontend to production

## 🤝 Contributing

This is a comprehensive gaming platform that combines:
- Modern web technologies
- Gaming mechanics
- Personal development
- Community features

The project is actively being developed and enhanced with new features regularly.

---

**LitRPG Unlimited** - Where your real skills become game power! ⚔️🎮 