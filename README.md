# Dizluv - AI-Guided Dating App MVP

Dizluv is a modern React Native (Expo) dating application designed for deeper human connections. It features an AI-guided onboarding process, a "blind" chat interface where profiles reveal themselves as you talk, and an integrated AI Wingman.

## Tech Stack
- **Framework**: Expo (React Native) with Expo Router (v3+)
- **Styling**: NativeWind v4 (Tailwind CSS for Native)
- **Database/Auth**: Firebase (Auth & Firestore)
- **AI**: Gemini API (via Secure Expo API Routes)

## Core Features
- **Secure Authentication**: Email/Password and Google sign-in structure.
- **AI-Guided Onboarding**: 3 questions analyzed by Gemini to generate a unique narrative bio.
- **"Blind" Chat Interface**: Profile pictures are blurred based on message count. The more you talk, the clearer they become.
- **AI Wingman**: Need an icebreaker? Get 3 contextual conversation starters based on your last 5 messages.
- **Hyper-Local Booking**: Discover and reserve "Perfect Date" venues with ease.

## Getting Started

### 1. Prerequisites
- Node.js (v18+)
- Expo Go app on your mobile device (to test native features)
- Google Gemini API Key

### 2. Environment Setup
Create a `.env` file in the root directory:
```env
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
EXPO_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
EXPO_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID

# Gemini API Key (Secret)
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

### 3. Installation
```bash
npm install
```

### 4. Running the App
```bash
# Start the development server
npx expo start
```
- Press **w** to open in the browser.
- Scan the QR code with the **Expo Go** app to test on iOS/Android.

## Security & Architecture
- **API Security**: Gemini interactions are proxied through server-side `+api.ts` routes to prevent client-side sensitive key exposure.
- **Data Privacy**: Strict Firestore Security Rules (`firestore.rules`) enforce the "Least Privilege" principle.
- **Input Validation**: All chat and onboarding inputs are handled securely to prevent injection.

## Deployment
- **Web**: `npx expo export:web`
- **Mobile**: Use EAS Build (`eas build --platform ios/android`) for production binaries.
- **API Routes**: Ensure you deploy to a provider supporting Node.js runtimes (e.g., EAS Hosting, Vercel).

---
*Dizluv - Connect Deeper, See Better.*
