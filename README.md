# یاقوت سمینار — Seminar Yaqut

مدرسه راهنمایی علامه حلی ۱ تهران — مسابقه پروژه‌ها

A gamified student project competition platform where teams earn ruby gems (یاقوت) for their projects.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) + TypeScript + Tailwind CSS |
| Backend | Express.js + SQLite (sql.js) + JWT + bcryptjs |
| Animations | Framer Motion |
| Font | Vazirmatn (Persian) |

## Quick Start

### 1. Install Dependencies

```bash
# Frontend
npm install

# Backend
cd server
npm install
cd ..
```

### 2. Start Backend (Terminal 1)

```bash
cd server
npm run dev
```

Server runs on `http://localhost:3001`.

### 3. Start Frontend (Terminal 2)

```bash
npm run dev
```

App runs on `http://localhost:3000`.

### 4. Login

- **Admin**: Username `shafa` / Password `hishafa`
- **Demo projects**: `team-alpha`, `team-beta`, etc. / Password `team123`

---

## Environment Variables

### Frontend (`.env.local`)

```env
JWT_SECRET=your-strong-secret-here
BACKEND_URL=http://localhost:3001
```

### Backend (server env vars)

```env
PORT=3001
JWT_SECRET=your-strong-secret-here
FRONTEND_URL=http://localhost:3000
ADMIN_USERNAME=your-admin-name
ADMIN_PASSWORD=your-admin-password
```

---

## Deployment Guide (Render)

### Step 1: Push to GitHub

```bash
cd C:\Users\SATM\Desktop\yaghout
git init
git add .
git commit -m "Initial commit"
```

Go to GitHub → New Repository → Create → Copy the URL.

```bash
git remote add origin https://github.com/YOUR_USERNAME/yaghout-seminar.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy Backend on Render

1. Go to https://render.com → Sign up / Login
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Fill in:
   - **Name**: `yaghout-api`
   - **Runtime**: Node
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npx tsx index.ts`
   - **Port**: 3001
5. Add Environment Variables:
   ```
   NODE_ENV=production
   JWT_SECRET=put-a-strong-random-string-here
   FRONTEND_URL=https://your-frontend.onrender.com
   PORT=3001
   ADMIN_USERNAME=your-admin-name
   ADMIN_PASSWORD=your-strong-password
   ```
6. Click **Create Web Service**
7. Wait for deployment → Copy the URL (e.g., `https://yaghout-api.onrender.com`)

### Step 3: Deploy Frontend on Render

1. **New +** → **Web Service** → Connect same repo
2. Fill in:
   - **Name**: `yaghout-frontend`
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Port**: 3000
3. Add Environment Variables:
   ```
   NODE_ENV=production
   BACKEND_URL=https://yaghout-api.onrender.com
   JWT_SECRET=Same-as-backend
   ```
4. Click **Create Web Service**

### Step 4: Update Backend CORS

Go back to backend service → Environment → Edit `FRONTEND_URL` to your actual frontend URL.

---

## Deployment Guide (Railway)

### Install Railway CLI

```bash
npm install -g @railway/cli
railway login
```

### Deploy Backend

```bash
cd server
railway init
railway up
railway variables set JWT_SECRET=your-secret FRONTEND_URL=https://your-frontend.up.railway.app
railway domain
```

### Deploy Frontend

```bash
cd ..
railway init
railway up
railway variables set BACKEND_URL=https://your-backend.up.railway.app JWT_SECRET=your-secret
railway domain
```

---

## Project Structure

```
yaghout/
├── public/              # Favicon, robots.txt
├── src/
│   ├── app/             # Next.js pages
│   │   ├── page.tsx     # Login (/)
│   │   ├── admin/       # Admin dashboard
│   │   ├── leaderboard/ # Public leaderboard
│   │   └── project/     # Project settings
│   ├── components/      # React components
│   ├── lib/             # API, types, helpers
│   └── hooks/           # Theme hook
├── server/              # Express backend
│   ├── routes/          # API routes
│   ├── middleware/       # JWT auth
│   ├── db.ts            # SQLite database
│   └── index.ts         # Server entry
├── next.config.js       # Security headers
├── tailwind.config.ts   # Color palette
└── package.json
```

## Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| Primary | `#C15959` | Buttons, accents |
| Cream | `#FDF0D5` | Light bg, dark text |
| Beige | `#C79B69` | Gold accents |
| Navy | `#003049` | Dark bg, light text |
| Sky | `#669BBC` | Secondary text |

## License

MIT
