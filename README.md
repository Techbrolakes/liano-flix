# 🎬 LianoFlix

A Netflix-inspired movie streaming application built with Next.js 14, Tailwind CSS, React Query, and Supabase.

## 🚀 Features

- **Netflix-inspired UI**: Dark theme with a modern, clean interface
- **Movie browsing**: Explore trending, popular, top-rated, and upcoming movies
- **Movie details**: View comprehensive information about movies, including synopsis, cast, and similar movies
- **Actor profiles**: Explore detailed information about actors and their filmography
- **Search functionality**: Search for movies and actors throughout the application
- **Authentication**: User login and registration powered by Supabase
- **Responsive design**: Fully responsive on all device sizes

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Authentication & Backend**: Supabase
- **Movie Data**: TMDB API

## 🔧 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- TMDB API key
- Supabase account and project

### Setup

1. Clone the repository

```bash
git clone https://github.com/yourusername/liano-flix.git
cd liano-flix
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Set up environment variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: If you'd prefer to keep the TMDB API key in the .env file instead of the code
# NEXT_PUBLIC_TMDB_API_KEY=ae5b499166e31fb991742cee179dca6a
```

4. Run the development server

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application

## 📝 Project Structure

```
/app
  ├── layout.tsx           # Root layout with global components
  ├── page.tsx             # Homepage
  ├── /components          # Reusable UI components
  ├── /features            # Feature-specific components
  ├── /hooks               # Custom React hooks
  ├── /lib                 # Utilities, API services, types
  ├── /store               # Zustand stores
  ├── /styles              # Global styles
  ├── /utils               # Helper functions
  └── /pages               # Route pages
      ├── /movies          # Movie-related routes
      ├── /actors          # Actor-related routes
      └── /auth            # Authentication routes
```

## 🔄 API Integration

This project uses two primary external APIs:

1. **TMDB API**: For fetching movie and actor data
   - API key is included in the code (for demonstration purposes)
   - Documentation: [TMDB API Docs](https://developers.themoviedb.org/3)

2. **Supabase**: For user authentication and backend services
   - Requires your own Supabase project configuration
   - Documentation: [Supabase Docs](https://supabase.io/docs)

## 🚀 Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 📜 License

This project is MIT licensed.
