# 🎮 CodeKid - AI-Powered Coding Education Platform

> Empowering the next generation of coders through gamified, AI-enhanced learning experiences

## 🌟 Overview

CodeKid is a comprehensive coding education platform designed for children aged 5-16, featuring:
- **AI-powered mentorship** - Intelligent tutoring that adapts to each child
- **Gamified learning** - XP, badges, streaks, and leaderboards to keep kids engaged
- **Age-appropriate curriculum** - Tailored content for three age groups (5-8, 8-12, 12-16)
- **Project portfolios** - Showcase work with professional portfolios
- **Parent dashboard** - Real-time progress monitoring and analytics
- **Community features** - Safe, moderated forums and competitions

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for blazing fast development
- **Tailwind CSS** for modern, responsive UI
- **Framer Motion** for smooth animations
- **Monaco Editor** for code editing (VS Code engine)
- **Blockly** for visual programming (ages 5-8)
- **Recharts** for data visualization

### Backend & Services
- **Supabase** - PostgreSQL database, authentication, real-time subscriptions
- **OpenRouter API** - AI mentor powered by GPT-4 (replaces OpenAI, more affordable with multiple model options)
- **Stripe** - Payment processing
- **Row Level Security** - Secure data access

### State Management
- **Zustand** - Lightweight state management
- **React Context** - Auth and user context

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account
- OpenRouter API key (get it from https://openrouter.ai/keys)
- Stripe account (for payments, optional)

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd codekid
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env` file in the root directory (or copy from `.env.example`):

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenRouter (replaces OpenAI - more affordable!)
# Get your key from https://openrouter.ai/keys
VITE_OPENROUTER_API_KEY=your_openrouter_api_key

# Stripe (optional)
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# App Config
VITE_APP_URL=http://localhost:5173
VITE_APP_NAME=CodeKid

# Feature Flags
VITE_ENABLE_AI_MENTOR=true
VITE_ENABLE_PAYMENTS=false
VITE_DEMO_MODE=true
```

### 4. Set up Supabase

#### Option A: Using Supabase CLI (Recommended)
```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

#### Option B: Manual Setup
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
4. Execute the SQL

### 5. Configure OAuth Providers (Optional)

In your Supabase dashboard:
1. Go to Authentication > Providers
2. Enable Google, GitHub, or Apple Sign-in
3. Add OAuth credentials
4. Set redirect URLs

### 6. Start development server
```bash
npm run dev
```

Visit `http://localhost:5173` to see the app!

## 📁 Project Structure

```
codekid/
├── public/                    # Static assets
├── src/
│   ├── components/           # React components
│   │   ├── auth/            # Authentication components
│   │   ├── dashboard/       # Student & parent dashboards
│   │   ├── learning/        # Lesson interfaces
│   │   ├── gamification/    # Badges, XP, leaderboards
│   │   ├── ai-mentor/       # AI chat interface
│   │   └── shared/          # Reusable components
│   ├── contexts/            # React contexts
│   │   └── AuthContext.tsx  # Authentication state
│   ├── services/            # API service layers
│   │   ├── auth.service.ts
│   │   ├── student.service.ts
│   │   ├── ai-mentor.service.ts
│   │   ├── learning.service.ts
│   │   └── gamification.service.ts
│   ├── types/               # TypeScript type definitions
│   │   └── database.types.ts
│   ├── lib/                 # Utility functions
│   │   └── supabase.ts      # Supabase client
│   ├── hooks/               # Custom React hooks
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Entry point
├── supabase/
│   └── migrations/          # Database migrations
│       └── 001_initial_schema.sql
├── .env                     # Environment variables (gitignored)
└── package.json
```

## 🎯 Core Features Implementation Status

### ✅ Phase 1: Core Platform Architecture (Weeks 1-8)

#### 1.1 Authentication & User Management ✅
- [x] Multi-role authentication (Parent, Student, Instructor, Admin)
- [x] OAuth integration setup (Google, GitHub, Apple)
- [x] Email/password with password recovery
- [x] COPPA compliance and age verification
- [x] Profile customization
- [x] Database schema with RLS policies

#### 1.2 Interactive Learning Platform 🚧
- [x] Database schema for lessons and tracks
- [ ] Drag-and-drop block editor (ages 5-8)
- [ ] Code editor with Monaco (ages 8-16)
- [ ] Lesson delivery system
- [ ] Auto-save functionality
- [ ] Project gallery

#### 1.3 AI Mentor System ✅
- [x] OpenRouter API integration (GPT-4 and multiple model support)
- [x] Context-aware responses
- [x] Conversation history
- [x] Rating system
- [x] Escalation to human mentors
- [x] Analytics tracking

#### 1.4 Gamification Engine 🚧
- [x] Database schema for XP, badges, streaks
- [x] Student service with XP/level calculations
- [ ] Badge checking system
- [ ] Leaderboard UI
- [ ] Achievement animations

#### 1.5 Project Portfolio System 🚧
- [x] Database schema
- [ ] Portfolio generator
- [ ] Project showcase UI
- [ ] Sharing functionality

### 🔜 Phase 2: Parent Dashboard (Weeks 9-12)
- [x] Database schema
- [ ] Real-time progress monitoring UI
- [ ] Analytics charts
- [ ] Screen time controls
- [ ] Notification system

### 🔜 Phase 3: Community & Social (Weeks 13-16)
- [x] Database schema
- [ ] Forum interface
- [ ] Moderation system
- [ ] Competitions/Hackathons UI

### 🔜 Phase 4: Advanced Features (Weeks 17-20)
- [ ] Career readiness tools
- [ ] AI-powered personalization
- [ ] Mobile app

## 🗄️ Database Schema Highlights

### Core Tables
- **parents** - Primary account holders
- **students** - Child profiles linked to parents
- **instructors** - Mentor accounts
- **learning_tracks** - Course paths
- **lessons** - Individual learning units
- **lesson_progress** - Student progress tracking
- **projects** - Student-created projects
- **ai_conversations** - AI mentor chat history
- **badges** - Achievement definitions
- **student_badges** - Earned badges

### Key Features
- **Row Level Security (RLS)** - Parents can only access their own data and children
- **Triggers** - Auto-update timestamps, calculate levels from XP
- **Functions** - `add_student_xp()`, `update_student_streak()`
- **Indexes** - Optimized for common queries

## 🔐 Security

- Row Level Security (RLS) enabled on all tables
- Parents can only view their own children's data
- Students cannot access other students' private information
- AI conversations are logged and can be flagged for review
- COPPA compliance for children under 13

## 🎨 Design Philosophy

1. **Child-First UX** - Large buttons, colorful UI, immediate feedback
2. **Progressive Disclosure** - Show complexity gradually
3. **Positive Reinforcement** - Celebrate every win
4. **Safe Environment** - Moderated community, parental controls
5. **Adaptive Learning** - AI adjusts to each child's pace

## 📊 Subscription Tiers

| Feature | Free | Premium ($29/mo) | Family ($49/mo) | Lifetime ($999) |
|---------|------|------------------|-----------------|-----------------|
| Lessons | First 3 per track | All | All | All |
| AI Mentor | 3 questions/day | Unlimited | Unlimited | Unlimited |
| Child Profiles | 1 | 1 | 4 | 4 |
| Portfolio | Basic | Advanced | Advanced | Advanced |
| Parent Coaching | - | - | Monthly call | Lifetime |
| Career Support | - | - | - | Age 16+ |

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy the dist/ folder
```

### Database (Supabase)
Already hosted - just run migrations

### Environment Variables
Make sure to set all environment variables in your hosting platform

## 📝 Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow React best practices
- Use functional components with hooks
- Keep components small and focused

### State Management
- Use Zustand for global state
- Use React Context for auth
- Use local state when possible

### API Calls
- Always use service layers
- Handle errors gracefully
- Show loading states
- Provide user feedback

## 🧪 Testing (TODO)

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

Proprietary - All rights reserved

## 🙏 Acknowledgments

- OpenRouter for affordable AI API access
- OpenAI for GPT models
- Supabase for backend infrastructure
- Google Blockly team
- Monaco Editor team

## 📞 Support

For support, email support@codekid.com or join our Discord community.

---

**Built with ❤️ for the next generation of developers**