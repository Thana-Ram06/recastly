# Recastly

> Turn YouTube videos into platform-perfect content in seconds — powered by Claude AI.

**Stack:** Next.js 15 · TypeScript · Tailwind CSS · Framer Motion · Firebase · Stripe · Claude API

---

## Features

- Paste a YouTube URL → get LinkedIn posts, X threads, newsletter, and Instagram captions
- Firebase Google Auth with persistent login
- Stripe subscriptions (Free / Starter $9 / Pro $29)
- Full generation history
- Dark/light mode
- Mobile responsive
- Admin dashboard
- SEO optimized (sitemap, robots, OG)

---

## Quick Start

### 1. Clone and install

```bash
cd recastly
npm install
```

### 2. Set up environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in all values (see setup sections below).

### 3. Run locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## Environment Variables

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Firebase (Client SDK)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin SDK
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# Anthropic
ANTHROPIC_API_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_STARTER_PRICE_ID=
STRIPE_PRO_PRICE_ID=

# Admin
ADMIN_EMAILS=your@email.com
```

---

## Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable **Authentication** → Sign-in method → **Google**
4. Create a **Firestore** database (start in production mode)
5. Go to Project Settings → General → copy web app config for `NEXT_PUBLIC_FIREBASE_*` vars
6. Go to Project Settings → Service accounts → Generate new private key
7. Use the JSON to fill `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`

### Firestore Security Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
    match /generations/{docId} {
      allow read: if request.auth != null &&
        request.auth.uid == resource.data.uid;
    }
    match /subscriptions/{uid} {
      allow read: if request.auth != null && request.auth.uid == uid;
    }
    match /usage/{docId} {
      allow read: if request.auth != null &&
        docId.matches(request.auth.uid + '.*');
    }
  }
}
```

---

## Stripe Setup

1. Create a [Stripe](https://stripe.com) account
2. Create two products:
   - **Starter** — $9/month recurring → copy price ID → `STRIPE_STARTER_PRICE_ID`
   - **Pro** — $29/month recurring → copy price ID → `STRIPE_PRO_PRICE_ID`
3. Copy API keys to env vars
4. Set up webhook:
   - Endpoint: `https://yourdomain.com/api/stripe/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
   - Copy webhook signing secret → `STRIPE_WEBHOOK_SECRET`

For local webhook testing:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

---

## Anthropic Setup

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create an API key
3. Set `ANTHROPIC_API_KEY` in `.env.local`

The app uses `claude-opus-4-5` by default. You can change the model in `lib/claude.ts`.

---

## Deployment (Vercel)

1. Push to GitHub
2. Import to [Vercel](https://vercel.com)
3. Add all environment variables in Vercel dashboard
4. Deploy

Update `NEXT_PUBLIC_APP_URL` to your production domain.

---

## Folder Structure

```
recastly/
├── app/
│   ├── (auth)/login/         # Login page
│   ├── (dashboard)/          # Protected dashboard routes
│   │   ├── dashboard/        # Main generation page
│   │   ├── history/          # Generation history
│   │   └── settings/         # Profile, theme, billing
│   ├── admin/                # Admin stats page
│   ├── api/
│   │   ├── auth/session/     # Set/clear session cookie
│   │   ├── generate/         # Main generation endpoint
│   │   ├── transcript/       # YouTube transcript extraction
│   │   ├── stripe/
│   │   │   ├── checkout/     # Create Stripe checkout
│   │   │   ├── webhook/      # Stripe event handler
│   │   │   └── portal/       # Billing portal
│   │   ├── user/
│   │   │   ├── usage/        # Usage + history
│   │   │   └── delete/       # Account deletion
│   │   └── admin/stats/      # Admin stats
│   ├── layout.tsx            # Root layout with providers
│   ├── page.tsx              # Landing page
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── ui/                   # Button, Card, Badge, Input, Spinner
│   ├── landing/              # Hero, Features, Pricing, FAQ, etc.
│   ├── dashboard/            # Sidebar, TopNav, URLInput, ContentCard
│   └── providers/            # AuthProvider, ThemeProvider
├── firebase/
│   ├── config.ts             # Client SDK init
│   └── admin.ts              # Admin SDK init
├── hooks/
│   ├── useAuth.ts            # Google sign-in, logout, token
│   └── useSubscription.ts    # Plan, usage, limits
├── lib/
│   ├── claude.ts             # AI generation logic
│   ├── firestore.ts          # DB operations
│   └── stripe.ts             # Payment operations
├── types/index.ts            # TypeScript types + plan configs
├── utils/
│   ├── prompts.ts            # Claude system prompts
│   └── helpers.ts            # cn(), extractVideoId(), etc.
└── middleware.ts             # Route protection
```

---

## Plans

| Plan    | Generations/mo | Price |
|---------|---------------|-------|
| Free    | 1             | $0    |
| Starter | 10            | $9    |
| Pro     | Unlimited     | $29   |

---

## Tech Notes

- **YouTube transcript**: Uses `youtube-transcript` package — no API key needed
- **Auth protection**: Cookie-based session via middleware + client-side `useAuth` hook
- **Generation**: All 4 platforms generated in parallel via `Promise.all` for speed
- **Stripe webhooks**: Full subscription lifecycle handled (created, updated, deleted, payment_failed)
