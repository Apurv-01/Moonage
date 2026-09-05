<div align="center">

## 🌕 Moonage

**A minimal, closed social network — share moments, follow friends, keep it small.**

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-Frontend-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Deployed on Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com)
[![Deployed on Render](https://img.shields.io/badge/Backend-Render-46E3B7?logo=render&logoColor=white)](https://render.com)

</div>

---

## ✦ About

**Moonage** is a full-stack, session-authenticated social feed built from the ground up — posts, comments, replies, likes, follows, profiles, search, and a trending page, all wrapped in a clean Instagram-inspired UI. Designed as a small, closed community rather than a public platform.

---

## ✦ Features

| | |
|---|---|
| 🖼️ **Posts** | Text or image posts with Cloudinary-backed uploads |
| ❤️ **Likes** | Like posts *and* individual comments |
| 💬 **Comments & Replies** | Nested reply threads, expandable inline |
| 👥 **Follow System** | Follow/unfollow, with dedicated followers/following panels |
| 🔍 **Search** | Live user search with debounced dropdown results |
| 📈 **Trending** | Top posts & most-followed users, all-time or last 24h |
| 🪪 **Profiles** | Unified profile page — works for your own account or anyone else's |
| ⚙️ **Settings** | Update username, password, profile picture, or delete your account |
| 🔐 **Auth** | Cookie/session-based login — no JWT, no localStorage tokens |
<!--| 🔗 **Shareable Posts** | Direct links to individual posts for logged-in members |-->

---

## ✦ Tech Stack

**Frontend**
- React + Vite
- React Router
- Tailwind CSS
- Lucide Icons

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- `express-session` (cookie-based auth)
- Cloudinary + Multer (image uploads)
- Bcrypt (password hashing)

**Security**
- Helmet
- `express-rate-limit`
- `express-mongo-sanitize`
- Scoped MongoDB Atlas access + strong session secrets

---

## ✦ Architecture

```
Frontend (Vercel)  ──────▶  Backend API (Render)  ──────▶  MongoDB Atlas
     React + Vite              Express + Sessions           Mongoose Models
                                       │
                                       ▼
                                  Cloudinary
                               (image storage)
```

Frontend and backend are deployed independently, communicating cross-origin with `sameSite: none` session cookies over HTTPS.

---

## ✦ Getting Started

### Prerequisites
- Node.js ≥ 20
- A MongoDB Atlas cluster
- A Cloudinary account

### 1. Clone the repo
```bash
git clone https://github.com/Apurv-01/moonage.git
cd circle
```

### 2. Backend setup
```bash
cd backend
npm install
cp .env.example .env   # fill in your values
npm start
```

**Backend `.env`**
```env
URI=your_mongodb_connection_string
SESSION_SECRET=a_long_random_string
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NODE_ENV=development
PORT=5000
```

### 3. Frontend setup
```bash
cd frontend
npm install
npm run dev
```

**Frontend `.env`**
```env
VITE_API_BASE_URL=http://localhost:5000
```

The app will be running at `http://localhost:5173`.

---

## ✦ Project Structure

```
circle/
├── backend/
│   ├── controllers/       # Route handlers
│   ├── models/            # Mongoose schemas
│   ├── routes/            # Express routers
│   ├── middleware/        # Auth, sanitization
│   └── server.js
└── frontend/
    ├── src/
    │   ├── pages/          # Home, Profile, Settings, Trending
    │   ├── components/     # Sidebar, shared UI components
    └── vite.config.js
```

---

## ✦ Roadmap

- [ ] Notifications (likes, comments, follows)
- [ ] Suggested users to follow
- [ ] Post editing/deletion
- [ ] Dedicated `/post/:id` route for shared links

---

<div align="center">

Built with a lot of debugging, one bug at a time. 🐛

</div>
