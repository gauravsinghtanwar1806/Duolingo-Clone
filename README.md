# Duolingo Web App Clone

A functional clone of the Duolingo web application that replicates the playful design, user experience, and core gamification workflows of the original app. Built for the SDE Fullstack Assignment.

## 🚀 Features

- **Interactive Lesson Player**: Complete varied exercises including multiple choice, word bank translation, pair matching, fill-in-the-blank, and type-the-answer.
- **Learning Path**: Navigate a vibrant, SVG-animated skill tree with locked, available, and completed node states.
- **Gamification Mechanics**: Maintain your daily streak, earn XP, complete daily quests, and compete on the leaderboard.
- **Heart System**: Lose hearts on incorrect answers and wait for them to refill over time (15 mins per heart) or practice to regain them.
- **Dynamic Feedback**: Real-time correct/incorrect feedback with custom sound effects and Duolingo's signature pop-up bars.
- **Authentic UI/UX**: Mascot flourishes, rounded tactile buttons, smooth CSS micro-animations, and full dark mode support.

## 🛠️ Tech Stack

**Frontend:**
- React 19 & TypeScript
- Vite (Replaced Next.js for rapid, lightweight client-side SPA rendering)
- Tailwind CSS v4 (Utility-first styling matching Duolingo's design system)
- Context API & Local Storage for offline-capable client state

**Backend:**
- Python & Django
- Django REST Framework (DRF)
- SQLite (Lightweight, out-of-the-box relational database)
- SimpleJWT for Authentication

## 📂 Architecture Overview

The application follows a decoupled client-server architecture:

1. **Frontend (React/Vite)**: Acts as a Single Page Application (SPA). `App.tsx` handles the main application state and routing between pages (`LearnPage`, `LessonPage`, `ShopPage`, `LeaderboardPage`). It communicates with the backend via RESTful APIs using standard `fetch`.
2. **Backend (Django/DRF)**: Serves as a stateless API. It manages user profiles, calculates XP and streak logic, validates friend requests, handles authentication, and evaluates achievements.
3. **Seeding mechanism**: The course content (units, skills, and lessons) is deeply nested in JSON (`frontend/seed_data.json`) and synchronized into the SQLite database via a Django management command (`seed.py`).

## 🗄️ Database Schema

The SQLite database is structured around the following core models:

- **User & UserProfile**: Extends the default Django `User`. Tracks `xp`, `streak`, `hearts`, `daily_xp`, `league`, and `unlocked_achievements`.
- **Unit & Skill**: Hierarchical course content. A `Unit` contains multiple `Skill` objects.
- **UserSkillProgress**: A join table tracking a user's progression on a specific skill (`locked`, `available`, `current`, `completed`), including `xp_earned`.
- **FriendRequest**: Tracks followers and pending requests for the leaderboard.
- **UserFeedEvent**: Tracks timeline events like unlocking achievements or completing milestones.

*For full details, see the backend `models.py` file.*

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v18+)
- Python 3.10+
- `npm` or `pnpm`

### 1. Backend Setup
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Seed the database with the sample course content and dummy users
python manage.py shell < seed.py

# Start the server
python manage.py runserver
```

### 2. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:8000`.

## 📌 Assumptions & Simplifications
- **Client-Side SPA Architecture**: A purely client-side rendered experience (React SPA) was chosen to simplify complex mid-lesson state management. This approach perfectly mimics the instantaneous, app-like transitions of the original Duolingo mobile application.
- **One Language**: The seeded content focuses exclusively on a single mocked language (Spanish-esque) to demonstrate the mechanics.
- **Audio**: A custom browser Web Speech API implementation is used for text-to-speech to provide dynamic audio without requiring expensive backend AI processing.
- **Static Assets**: SVG strings and CSS gradients are heavily relied upon to perfectly recreate Duolingo's aesthetic without needing large asset downloads.
