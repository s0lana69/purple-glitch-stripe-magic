# TrueViral.ai - Complete Project Documentation

## Project Overview
TrueViral is a Next.js-based SaaS platform for YouTube content creators, providing AI-powered analytics, content optimization, and channel management tools. The platform is deployed on Vercel with dual domains (trueviral.io and trueviral.ai) and utilizes Cloudflare for DNS management.

## Architecture & Tech Stack

### Frontend
- **Framework**: Next.js 13+ (App Router and Pages Router hybrid)
- **Styling**: Tailwind CSS with custom breakpoints
- **UI Components**: Headless UI, Radix UI, custom component library
- **State Management**: React Context API, Zustand for complex state
- **TypeScript**: Full TypeScript implementation with strict types

### Backend & APIs
- **Authentication**: Firebase Auth with Google OAuth
- **Database**: Firebase Firestore (migrated from Supabase)
- **Payments**: Stripe integration with webhooks
- **AI Services**: 
  - Anthropic Claude API (primary AI scanner)
  - Google Gemini API (alternative AI provider)
- **YouTube Integration**: YouTube Data API v3 with OAuth2

### Deployment & Infrastructure
- **Hosting**: Vercel (primary deployment platform)
- **DNS**: Cloudflare (DNS management, CDN, security)
- **Domains**: 
  - trueviral.ai (canonical)
  - trueviral.io (secondary)
- **SSL**: Managed through Cloudflare
- **CI/CD**: GitHub Actions with Vercel integration

## Authentication System

### Firebase Authentication
**Status**: ✅ COMPLETE - Pricing page and checkout flow fully functional - Migrated from Supabase to Firebase

#### Core Components
- **Main Auth Context**: `src/context/FirebaseAuthContext.tsx`
- **Fallback Context**: `src/context/AuthContext.tsx` (Firebase-compatible)
- **Auth Guard**: `src/components/auth/AuthGuard.tsx` (client-side protection)
- **Auth State Listener**: `src/components/auth/AuthStateListener.tsx`

#### Authentication Flow
1. **Google OAuth**: Primary authentication method
2. **Email/Password**: Secondary authentication option
3. **Session Management**: Cookie-based persistence with automatic refresh
4. **Route Protection**: Middleware-based protection for dashboard routes

#### Key Files
- `src/lib/firebase.ts` - Firebase configuration
- `src/lib/firebaseAdmin.ts` - Server-side Firebase admin
- `src/middleware.ts` - Route protection and token validation
- `src/pages/api/firebase/auth/session.ts` - Session management API
- `src/pages/api/firebase/user/profile.ts` - User profile management

#### Database Schema (Firestore)
```
users/
├── {userId}/
    ├── email: string
    ├── displayName: string
    ├── photoURL: string
    ├── createdAt: timestamp
    ├── lastLoginAt: timestamp
    ├── subscription: object
    ├── youtubeChannelId: string
    └── profile: object
```

## Subscription System

### Stripe Integration
**Status**: ✅ COMPLETE

#### Components
- **Subscription Context**: `src/context/SubscriptionContext.tsx`
- **Subscription Redirect**: `src/components/auth/SubscriptionRedirect.tsx`
- **Pricing Components**: `src/components/PricingContent.tsx`, `src/components/PricingWithSubscription.tsx`

#### Flow Logic
1. **New Users**: Auto-trial subscription creation
2. **Existing Users**: Subscription status verification
3. **Trial Management**: Automatic trial creation and expiration handling
4. **Dashboard Protection**: Feature gating based on subscription status

#### APIs
- `src/pages/api/stripe/create-checkout-session.ts` - Checkout session creation
- `src/pages/api/stripe/webhook.ts` - Stripe webhook handling
- `src/pages/api/subscription/auto-subscribe.ts` - Automatic trial subscriptions

#### Database Fields
```sql
-- Trial and subscription fields added to users
trial_start_date: timestamp
trial_end_date: timestamp
stripe_subscription_status: string
subscription_tier: string
stripe_customer_id: string
```

### Stripe Checkout Fixes (May 29, 2025)
**Status**: ✅ RESOLVED

#### Issues Fixed
- Timeout errors during checkout session creation
- "Request was retried 2 times" errors
- Connection issues with Stripe API

#### Implementation Details
1. **Backend Improvements**:
   - Increased `MAX_RETRIES` from 1 to 2 in the checkout session creation API
   - Increased retry delay base from 1000ms to 2000ms for better backoff strategy
   - Added an API timeout constant of 25000ms (25 seconds)
   - Implemented a race condition pattern with Promise.race() to properly handle timeouts
   - Added more detailed logging for retry attempts

2. **Frontend Improvements**:
   - Added proper signal handling with AbortController to the fetch request
   - Implemented timeout cleanup to prevent resource leaks
   - Added better error handling for network timeouts

3. **Debugging Tools**:
   - Created `debug-stripe-checkout.js` for testing the checkout flow with a specific user
   - Created `debug-stripe-only.js` for testing direct Stripe API connectivity
   - Created `test-stripe-checkout.js` for a simplified checkout flow test

#### Key Files Modified
- `src/pages/api/stripe/create-checkout-session.ts` - Backend retry logic
- `src/components/PricingContent.tsx` - Frontend timeout handling
- `src/scripts/debug-stripe-checkout.js` - Debugging utility
- `src/scripts/debug-stripe-only.js` - Stripe API connectivity test
- `src/scripts/test-stripe-checkout.js` - Simplified checkout flow test

## YouTube Integration

### Real Data Implementation
**Status**: ✅ COMPLETE - No more mock data

#### API Endpoints
- `src/pages/api/youtube/channel-stats.ts` - Real channel statistics
- `src/pages/api/youtube/recent-comments.ts` - Actual video comments
- `src/pages/api/youtube/top-videos.ts` - Real video performance data
- `src/pages/api/youtube/check-status.ts` - Connection status verification
- `src/pages/api/youtube/validate-token.ts` - Token validation

#### Features
- **Real Channel Data**: Subscriber count, view count, video count
- **Actual Comments**: Live comments from user's videos
- **Performance Analytics**: Real video statistics and rankings
- **OAuth Integration**: Secure YouTube account connection
- **Token Management**: Automatic refresh and validation

#### Data Sources
- YouTube Data API v3 with proper API key authentication
- OAuth2 flow for secure channel access
- Real-time data fetching (no cached/mock data)

## AI Scanner Integration

### Anthropic Claude Integration
**Status**: ✅ FULLY OPERATIONAL

#### Implementation
- **API Endpoint**: `src/pages/api/anthropic.ts`
- **Frontend Component**: `src/components/dashboard/ai-scanner-content.tsx`
- **Model**: Claude-3-Haiku for fast responses
- **Max Tokens**: 2000 per request

#### Capabilities
- **Content Theme Analysis**: Identifies main topics and themes
- **Target Audience Analysis**: Viewer demographics and interests
- **SEO Optimization**: Actionable SEO recommendations
- **Content Strategy**: Strategic advice for creators
- **Trending Potential**: Viral potential assessment

#### Input Types Supported
- YouTube channel URLs
- YouTube video URLs
- Channel names
- Content topics
- General analysis queries

### Alternative AI Provider
- **Google Gemini API**: `src/pages/api/gemini.ts` (backup/alternative)

## Dashboard Components

### Core Dashboard
- **Main Dashboard**: `src/app/dashboard/page.tsx`
- **Dashboard Layout**: `src/app/dashboard/layout.tsx`
- **Client Layout**: `src/components/dashboard/DashboardClientLayout.tsx`
- **Sidebar**: `src/components/dashboard/dashboard-sidebar.tsx`

### Dashboard Features
- **YouTube Channel Card**: Real subscriber/view counts
- **Recent Activity**: Live comment feeds
- **Top Posts**: Real video performance data
- **AI Scanner**: Anthropic-powered content analysis
- **Settings**: Profile and account management

### Protection & Access Control
- **AuthGuard**: Client-side authentication protection
- **Subscription Gates**: Feature access based on subscription status
- **Loading States**: Proper loading and error handling

## Environment Configuration

### Required Environment Variables

#### Firebase Configuration
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

#### Firebase Admin (Server-side)
```env
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project.iam.gserviceaccount.com
FIREBASE_ADMIN_PROJECT_ID=your_project_id
```

#### Google OAuth & YouTube
```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_YOUTUBE_API_KEY=your_youtube_api_key
```

#### Stripe
```env
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_webhook_secret
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_publishable_key
```

#### AI Services
```env
ANTHROPIC_API_KEY=your_anthropic_api_key
GOOGLE_AI_API_KEY=your_gemini_api_key
```

## Critical Fixes & Resolutions

### 1. OAuth Redirect Issue ✅ RESOLVED
**Problem**: OAuth login/signup wasn't redirecting correctly to dashboard
**Solution**: 
- Added `AuthStateListener` component with proper session verification
- Enhanced OAuth redirect logic with parameter preservation
- Fixed imports to use consistent auth context (`FirebaseAuthContext`)

### 2. Dashboard Data Integration ✅ RESOLVED
**Problem**: Dashboard showing mock data instead of real YouTube data
**Solution**:
- Completely rewrote YouTube API integration
- Removed all mock data fallbacks
- Implemented real-time data fetching from YouTube API
- Fixed "NaN" values in video view counts

### 3. Auth Provider Errors ✅ RESOLVED
**Problem**: "useAuth must be used within an AuthProvider" build errors
**Solution**:
- Consolidated to single auth context (FirebaseAuthContext)
- Created AuthGuard component for client-side rendering
- Fixed provider hierarchy in app layout

### 4. Subscription Flow ✅ RESOLVED
**Problem**: Subscription context errors and redirect issues
**Solution**:
- Implemented proper provider structure in root layout
- Added auto-subscribe functionality for new users
- Created subscription-based feature gating

### 5. Stripe Checkout Timeouts ✅ RESOLVED
**Problem**: Stripe checkout session creation failing with timeout errors
**Solution**:
- Implemented robust retry mechanism with proper backoff strategy
- Added timeout handling with AbortController in frontend
- Created debugging utilities for isolating and testing Stripe connectivity
- Enhanced error reporting for better troubleshooting

## Testing & Debugging

### Available Debug Scripts
- `src/scripts/test-firebase-integration.js` - Firebase connection testing
- `src/scripts/test-youtube-integration.js` - YouTube API testing
- `src/scripts/test-oauth-redirect.js` - OAuth flow testing
- `src/scripts/test-anthropic-integration.js` - AI scanner testing
- `src/scripts/clear-all-auth-data.js` - Auth state reset
- `src/scripts/diagnose-env-variables.js` - Environment validation
- `src/scripts/debug-stripe-checkout.js` - Stripe checkout debugging
- `src/scripts/debug-stripe-only.js` - Stripe API connectivity testing
- `src/scripts/test-stripe-checkout.js` - Simplified checkout flow testing

### Clean Build Process
Available scripts for clean rebuilds:
- `clean-and-rebuild.sh` (Unix/Mac/Linux)
- `clean-and-rebuild.bat` (Windows)

These scripts:
1. Clear Next.js build cache
2. Remove node_modules
3. Reinstall dependencies
4. Rebuild project

## Performance Optimizations

### Code Splitting
- Dynamic imports for dashboard components
- Lazy loading for AI scanner
- Route-based code splitting

### API Optimization
- YouTube API quota efficiency (~5-10 units per dashboard load)
- Anthropic API response optimization (2000 token limit)
- Proper error handling and caching strategies
- Stripe API timeout and retry optimization

### Image & Asset Optimization
- Next.js Image component usage
- Optimized video assets in `/public/videos/`
- Compressed images and icons

## Security Implementation

### Authentication Security
- Firebase Auth security rules
- JWT token validation
- Secure cookie handling
- CORS protection

### API Security
- Rate limiting on API endpoints
- Input validation and sanitization
- Error handling without data leakage
- Secure environment variable handling

## Deployment Checklist

### Pre-Deployment Requirements ✅
- [x] OAuth redirect flow working
- [x] Real YouTube data integration
- [x] AI scanner operational
- [x] Subscription flow complete
- [x] Firebase migration complete
- [x] Environment variables configured
- [x] Stripe checkout flow fixed and tested

### Deployment Configuration
1. **Vercel Configuration**: `vercel.json` with proper redirects
2. **Domain Setup**: Both trueviral.ai and trueviral.io configured
3. **Cloudflare**: DNS, SSL, and CDN optimization
4. **GitHub Integration**: Automatic deployments on push

### Monitoring & Analytics
- Firebase Analytics integration
- Performance monitoring via Vercel
- Error tracking and logging
- User behavior analytics

## Known Issues & Solutions

### Resolved Issues ✅
1. **OAuth Redirect Problems** - Fixed with AuthStateListener
2. **Mock Data in Dashboard** - Replaced with real YouTube API data
3. **Auth Context Errors** - Consolidated to single Firebase context
4. **Subscription Flow Errors** - Fixed provider hierarchy
5. **TypeScript Build Errors** - Resolved type definitions
6. **Infinite Loop Issues** - Fixed with proper useEffect dependencies
7. **Stripe Checkout Timeouts** - Implemented robust retry and timeout handling

### Current Status: Production Ready ✅
All critical issues have been resolved. The platform is ready for production deployment with:
- Stable authentication flow
- Real data integration
- Functional AI features
- Complete subscription system
- Proper error handling
- Reliable payment processing

## File Structure Overview

```
src/
├── app/                    # Next.js App Router pages
├── pages/                  # Next.js Pages Router (API routes)
├── components/             # React components
│   ├── auth/              # Authentication components
│   ├── dashboard/         # Dashboard-specific components
│   └── ui/                # Reusable UI components
├── context/               # React Context providers
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries and configurations
├── scripts/               # Debug and testing scripts
└── styles/                # Global styles and CSS
```

## Maintenance Guidelines

### Regular Tasks
1. **Environment Variable Audits**: Quarterly review of all env vars
2. **API Token Rotation**: Regular rotation of service account keys
3. **Dependency Updates**: Monthly update of npm packages
4. **Performance Monitoring**: Weekly review of Core Web Vitals
5. **Security Audits**: Quarterly security assessment
6. **Stripe Integration Testing**: Monthly checkout flow verification

### Backup Procedures
1. **Firebase Data Export**: Regular Firestore backups
2. **Environment Configuration**: Secure backup of env files
3. **Code Repository**: Git-based version control with GitHub

This documentation represents the complete current state of the TrueViral.ai platform, including all implemented features, resolved issues, and deployment readiness status.
