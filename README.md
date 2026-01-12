# G2 Melody - Choir Music Platform

A comprehensive music platform for Gospel Guardians Melody, a choir based in Cameroon.

## Features

- 🎵 **Music Store** - Browse albums, stream songs, purchase digital downloads
- 🎯 **Projects & Donations** - Support ministry projects and track progress
- 📰 **News & Events** - Stay updated with concerts, workshops, and activities
- 🎓 **Learn Muzik** - Music education programs and resources
- 👥 **Membership** - Join as a supporter or choir member
- 🤖 **AI Chatbot** - Get instant answers to common questions
- 🔐 **Authentication** - Email/password and Google OAuth

## Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Hosting**: Vercel (recommended)

## Deployment to Vercel

### Prerequisites

1. A [Vercel account](https://vercel.com)
2. A [Neon PostgreSQL database](https://neon.tech) (already configured)
3. Google OAuth credentials (for Google sign-in)

### Step 1: Push to GitHub

1. Create a new GitHub repository
2. Push this code to your repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/g2melody.git
   git push -u origin main
   ```

### Step 2: Import to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: **Next.js**
   - Root Directory: **/** (or `app` if that's where your code is)

### Step 3: Configure Environment Variables

In Vercel's project settings, add these environment variables:

```
DATABASE_URL=postgresql://neondb_owner:npg_g4sNTlF2VjCo@ep-tiny-queen-a4q7d1wk-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require

NEXTAUTH_URL=https://your-project.vercel.app
NEXTAUTH_SECRET=g2melody-super-secret-key-2025-choir-music-platform

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

NEXT_PUBLIC_BASE_URL=https://your-project.vercel.app
```

### Step 4: Update Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Select your project
3. Go to "APIs & Services" → "Credentials"
4. Edit your OAuth 2.0 Client ID
5. Add authorized redirect URIs:
   - `https://your-project.vercel.app/api/auth/callback/google`

### Step 5: Deploy

Click "Deploy" in Vercel. The build process will:
1. Install dependencies
2. Generate Prisma client
3. Build the Next.js application

## Local Development

```bash
# Install dependencies
yarn install

# Generate Prisma client
npx prisma generate

# Run development server
yarn dev
```

Open [http://localhost:3000](http://localhost:3000)

## Database Commands

```bash
# Push schema changes to database
npx prisma db push

# Open Prisma Studio (database GUI)
npx prisma studio

# Generate Prisma client
npx prisma generate
```

## Project Structure

```
├── app/
│   ├── page.js              # Homepage
│   ├── about/               # About page
│   ├── projects/            # Projects & donations
│   ├── music/               # Music store
│   ├── news/                # News & events
│   ├── learn/               # Learning programs
│   ├── contact/             # Contact page
│   ├── join/                # Membership registration
│   ├── login/               # Sign in
│   ├── forgot-password/     # Password reset
│   └── api/                 # API routes
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── shared.js            # Shared navigation & footer
│   └── chatbot.js           # AI chatbot
├── lib/
│   ├── prisma.js            # Prisma client
│   └── auth.js              # NextAuth configuration
└── prisma/
    └── schema.prisma        # Database schema
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_URL` | Your deployment URL |
| `NEXTAUTH_SECRET` | Random secret for NextAuth |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `NEXT_PUBLIC_BASE_URL` | Public URL for frontend |

## Support

For questions or issues, contact: g2melodycmr@gmail.com

## License

© 2024 G2 Melody (Gospel Guardians Melody). All rights reserved.
