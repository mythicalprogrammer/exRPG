# Workout Tracker Frontend

An offline-first workout tracking app with AI-powered workout generation using llama.cpp.

## Features

- **Simple Text Prompt**: Describe your workout goals in natural language
- **AI-Powered Workout Plans**: Generates personalized workout routines using llama.cpp
- **GitHub-Style Heatmap**: Visual workout history calendar, color-coded by body parts
- **Offline-First**: All data stored locally using IndexedDB
- **PWA Support**: Service worker for offline capability and app-like experience
- **Responsive Design**: Modern, minimalist UI with Tailwind CSS

## Tech Stack

- **React 18** + **TypeScript** - Type-safe UI components
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **Dexie** - IndexedDB wrapper for offline storage
- **Axios** - HTTP client for API calls
- **Vite PWA** - Service worker and PWA manifest

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running on `http://localhost:8000` (FastAPI + llama.cpp)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Development

The app runs on `http://localhost:5173` by default.

### Project Structure

```
src/
├── pages/
│   ├── PromptPage.tsx       # Text input for workout goals
│   └── WorkoutPage.tsx      # Workout display + heatmap
├── components/
│   ├── WorkoutDisplay.tsx   # Display workout details
│   └── BodyPartHeatmap.tsx  # GitHub-style calendar
├── services/
│   ├── api.ts               # FastAPI/llama.cpp client
│   └── db.ts                # IndexedDB operations
├── types.ts                 # TypeScript interfaces
├── App.tsx                  # Router setup
└── main.tsx                 # App entry point
```

## API Endpoints

The frontend expects these endpoints from the backend:

- `POST /api/workout/generate` - Generate workout plan from prompt
- `GET /api/health` - Health check

## Offline Support

- **IndexedDB**: Stores workouts and history locally
- **Service Worker**: Caches assets and API responses
- **Network-First Strategy**: Tries API first, falls back to cache

## Body Part Color Mapping

- Chest: Red
- Back: Blue
- Shoulders: Amber
- Arms: Violet
- Legs: Emerald
- Core: Pink
- Cardio: Cyan
- Full Body: Indigo

## Building for Production

```bash
npm run build
```

The production build will be in the `dist/` directory, including:
- Minified JavaScript and CSS
- Service worker for offline caching
- PWA manifest for installability

## Next Steps

1. Implement backend API endpoints for workout generation
2. Add more workout tracking features (sets, reps, weight logging)
3. Enhance AI prompts for better workout generation
4. Add data export/import functionality
5. Implement user authentication (optional)
