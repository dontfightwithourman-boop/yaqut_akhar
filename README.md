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

## Complete Customization Guide

This section explains how to change every visible text, image, icon, layout, and style on the site.

---

### 1. Changing the Site Title, Description, and SEO

**File**: `src/app/layout.tsx` (Line 9-12)

```tsx
// Line 9: Browser tab title
title: { default: 'سمینار علوم و فنون مدرسه راهنمایی علامه حلی ۱ تهران', template: '%s | یاقوت سمینار' }

// Line 10: Meta description (shown in Google results)
description: 'مسابقه پروژه‌های دانشجویی سمینار — جایی که تلاش شما به یاقوت تبدیل می‌شود'

// Line 11: SEO keywords
keywords: ['سمینار', 'یاقوت', 'مدرسه راهنمایی علامه حلی ۱', 'سمینار علوم و فنون']
```

**To change**: Edit the Persian strings inside the quotes.

---

### 2. Changing the Favicon

**File**: `public/favicon.svg` — Replace this file with your own SVG icon.

**File**: `src/app/layout.tsx` (Line 21)

```tsx
<head><link rel="icon" href="/favicon.svg" type="image/svg+xml" /></head>
```

To use a PNG favicon instead:
```tsx
<head><link rel="icon" href="/favicon.png" type="image/png" /></head>
```

---

### 3. Changing the Ruby Gem Icon (یاقوت)

The gem icon appears in the Navbar, Footer, Yaqut scores, and project pages.

**PNG file**: `public/yaqut-gem.png` — Replace with your own PNG image (transparent background recommended).

**SVG file**: `public/yaqut-gem.svg` — Replace with your own SVG image.

**Component**: `src/components/YaqutIcon.tsx` (Line 9)

```tsx
// To change from PNG to SVG:
<img src="/yaqut-gem.svg" alt="یاقوت" ... />

// To change from PNG to a completely different image:
<img src="/my-custom-icon.png" alt="یاقوت" ... />
```

The icon has an animated glow effect. To remove it, set `animate={false}` where YaqutIcon is used, or edit `YaqutIcon.tsx` line 7:
```tsx
// Remove the animate prop from the motion.div
animate={undefined}  // was: animate={animate ? { filter: [...] } : undefined}
```

---

### 4. Changing the Navbar (Navigation Bar)

**File**: `src/components/layout/Navbar.tsx`

#### Brand Name (site logo text)
**Line 17**: Change `"یاقوت سمینار"` to your preferred name:
```tsx
<span className="text-lg font-bold text-ruby">نام جدید شما</span>
```

#### Navigation Links
**Lines 19-22** (desktop) and **Lines 30-33** (mobile):

| Line | Current Text | Change To |
|------|-------------|-----------|
| 19, 30 | `رتبه‌بندی` | Your preferred link text |
| 20, 31 | `پروژه من` | Your preferred link text |
| 21, 32 | `مدیریت` | Your preferred link text |
| 22, 33 | `خروج` | Your preferred link text |

#### Link Destinations
Change `href` values:
```tsx
<Link href="/leaderboard">رتبه‌بندی</Link>    // Change /leaderboard
<Link href="/project">پروژه من</Link>          // Change /project
<Link href="/admin">مدیریت</Link>              // Change /admin
```

#### Navbar Colors
**Line 11-12**:
```tsx
// Current:
className="... bg-white/80 backdrop-blur-xl dark:bg-navy/80 ..."
// Change background color:
bg-white/80  →  bg-red-100/80     // Light mode background
dark:bg-navy/80  →  dark:bg-black/80  // Dark mode background
```

#### Adding a New Nav Link
Add after line 22 (desktop) and line 33 (mobile):
```tsx
<Link href="/new-page" className="...">متن جدید</Link>
```

---

### 5. Changing the Footer

**File**: `src/components/layout/Footer.tsx`

#### Left Text (School Name)
**Line 6**: Change `"مدرسه راهنمایی علامه حلی ۱ تهران چهلمین سمینار علوم و فنون"`:
```tsx
<span>متن سمت چپ جدید شما</span>
```

#### Right Text (Seminar Year)
**Line 7**: Change `"سمینار علوم و فنون مدرسه راهنمایی علامه حلی 1 تهران 1405"`:
```tsx
<span className="text-sky">متن سمت راست جدید شما</span>
```

---

### 6. Changing the Admin Sidebar

**File**: `src/components/layout/Sidebar.tsx`

#### Link Text and Icons
**Lines 9-14**:

| Line | Current Text | Icon | Change Text |
|------|-------------|------|-------------|
| 9 | `داشبورد` | LayoutDashboard | Edit string |
| 10 | `پروژه‌ها` | FolderPlus | Edit string |
| 11 | `اعطای یاقوت` | Gem | Edit string |
| 12 | `کارگاه و آزمایشگاه` | Wrench | Edit string |
| 13 | `پشتیبانی` | Shield | Edit string |
| 14 | `رتبه‌بندی` | BarChart3 | Edit string |

#### Adding a New Sidebar Link
Add after line 14:
```tsx
<Link href="/new-page" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-navy/60 hover:bg-navy/5 dark:text-beige-light/60 dark:hover:bg-navy-light/20">
  <IconName className="w-5 h-5" />متن جدید
</Link>
```

Import icons from `lucide-react`:
```tsx
import { LayoutDashboard, FolderPlus, Gem, Wrench, Shield, BarChart3, IconName } from 'lucide-react';
```

#### Sidebar Colors
**Line 7**:
```tsx
// Light mode:
bg-white/95 backdrop-blur-xl  →  bg-red-50/95  // Change white to any color
// Dark mode:
dark:bg-navy-dark/95  →  dark:bg-gray-900/95
```

---

### 7. Changing the Homepage / Login Page

**File**: `src/app/page.tsx`

#### Hero Heading
**Line 27**:
```tsx
// Current:
<h1><span className="text-ruby">یاقوت</span><br /><span className="text-navy">سمینار</span></h1>
// Change:
<h1><span className="text-ruby">متن اول</span><br /><span className="text-navy">متن دوم</span></h1>
```

#### Stats Display
**Line 28**: Change team count, yaqut total, participant count:
```tsx
// "مسابقه" / "۶ تیم" / "یاقوت" / "۱۴۲" / "شرکت‌کننده" / "۱۵ نفر"
// Replace numbers and labels with your own
```

#### Login Form Title
**Line 32**: Change `"ورود به سیستم"` and the subtitle.

#### Login Button Text
**Line 37**: Change `"ورود"`:
```tsx
<Button type="submit">ورود</Button>  →  <Button type="submit">Login</Button>
```

#### "View Rankings" Link
**Line 39**: Change `"مشاهده رتبه‌بندی بدون ورود ←"`.

---

### 8. Changing the Leaderboard Page

**File**: `src/app/leaderboard/page.tsx`

| Line | Current Text | Description |
|------|-------------|-------------|
| 23 | `رتبه‌بندی یاقوت` | Page heading |
| 24 | `مدرسه راهنمایی علامه حلی ۱ تهران — جدول رتبه‌بندی پروژه‌ها` | Page description |
| 26 | `کل یاقوت:` | Total stat label |
| 27 | `تیم‌ها:` | Teams stat label |
| 29 | `بروزرسانی` | Refresh button text |

---

### 9. Changing the Admin Dashboard

**File**: `src/app/admin/page.tsx`

| Line | Current Text | Description |
|------|-------------|-------------|
| 15 | `پروژه‌ها`, `یاقوت`, `شرکت‌کنندگان`, `میانگین` | Stats card labels |
| 18 | `داشبورد مدیریت` | Page heading |
| 18 | `مدرسه راهنمایی علامه حلی ۱ تهران` | School name subtitle |
| 21 | `سه تیم برتر` | Section heading |
| 22 | `آخرین پروژه‌ها`, `عضو` | Section heading and member label |

---

### 10. Changing the Award Yaqut Page

**File**: `src/app/admin/award/page.tsx`

| Line | Current Text | Description |
|------|-------------|-------------|
| 22 | `اعطای یاقوت` | Page heading |
| 22 | `یاقوت به پروژه‌های برتر اعطا کنید` | Description |
| 25 | `تعداد یاقوت` | Amount input label |
| 25 | `یادداشت` | Note input label |
| 25 | `ارائه، پوستر، ...` | Note placeholder |
| 26 | `انتخاب همه` / `انتخاب هیچکدام` | Select all/none buttons |

---

### 11. Changing the Workshop Page

**File**: `src/app/admin/workshop/page.tsx`

| Line | Current Text | Description |
|------|-------------|-------------|
| 72 | `کارگاه و آزمایشگاه` | Page heading |
| 72 | `مدیریت وسایل و قرض‌های کارگاه و آزمایشگاه` | Description |
| 74 | `وسایل کارگاه و آزمایشگاه` | Items tab |
| 75 | `لیست قرض‌ها` | Loans tab |
| 79 | `وسیله جدید` | New item button |
| 105 | `قرض جدید` | New loan button |
| 139-142 | `نام وسیله`, `مکان`, `تعداد`, `توضیحات` | Form field labels |
| 157-160 | `نام قرض‌گیرنده`, `شماره تلفن`, `شماره گروه`, `تعداد روز قرض` | Loan form labels |

---

### 12. Changing the Backup Page

**File**: `src/app/admin/backup/page.tsx`

| Line | Current Text | Description |
|------|-------------|-------------|
| 43 | `پشتیبان‌گیری و بازیابی` | Page heading |
| 43 | `دانلود و آپلود نسخه پشتیبان کامل داده‌ها` | Description |
| 58 | `دانلود نسخه پشتیبان` | Download card title |
| 60 | `دانلود فایل پشتیبان` | Download button |
| 68 | `بازیابی از فایل پشتیبان` | Restore card title |
| 72 | `هشدار: این عملیات...` | Warning text |
| 74 | `آپلود و بازیابی` | Upload button |

---

### 13. Changing the Projects Management Page

**File**: `src/app/admin/projects/page.tsx`

| Line | Current Text | Description |
|------|-------------|-------------|
| 31 | `مدیریت پروژه‌ها` | Page heading |
| 31 | `پروژه جدید` | New project button |
| 32 | `جستجو...` | Search placeholder |
| 36-39 | `نام پروژه`, `نام کاربری`, `رمز عبور`, `توضیحات پروژه` | Form labels |
| 43 | `لوگوی پروژه` | Logo upload label |
| 46 | `انتخاب تصویر` | Choose image button |
| 51 | `اعضا`, `+ افزودن عضو` | Members section |

---

### 14. Changing the Student Project Page

**File**: `src/app/project/page.tsx`

| Line | Current Text | Description |
|------|-------------|-------------|
| 131 | `تنظیمات پروژه` | Settings button |
| 137 | `تنظیمات پروژه` | Settings section heading |
| 157 | `پروژه من` | My Project heading |
| 170 | `قرض گرفته شده‌ها` | Borrowed items heading |
| 200 | `تاریخچه یاقوت` | Yaqut history heading |

---

### 15. Changing the Public Project Detail Page

**File**: `src/app/project/[id]/page.tsx`

| Line | Current Text | Description |
|------|-------------|-------------|
| 54 | `بازگشت به رتبه‌بندی` | Back to rankings link |
| 63 | `اعضای تیم` | Team members heading |
| 64 | `وسایل قرضی تیم` | Team loaned items heading |
| 72 | `تاریخچه یاقوت` | Yaqut history heading |

---

### 16. Changing Colors / Theme

**File**: `tailwind.config.ts`

All custom colors are defined here:

```ts
colors: {
  ruby: { DEFAULT: '#C15959', glow: '#D47979', dark: '#A04040' },   // Primary red
  cream: { DEFAULT: '#FDF0D5', dark: '#F0E0C0' },                   // Light bg
  beige: { DEFAULT: '#C79B69', light: '#D4B08A', dark: '#A87D4F' },  // Gold
  navy: { DEFAULT: '#003049', light: '#004066', dark: '#001A2B' },   // Dark blue
  sky: { DEFAULT: '#669BBC', light: '#8AB5CC', dark: '#4A83A6' },    // Light blue
}
```

**To change the primary color** (buttons, accents):
```ts
ruby: { DEFAULT: '#YOUR_COLOR', glow: '#LIGHTER_VERSION', dark: '#DARKER_VERSION' }
```

**To change the dark mode background**:
```ts
navy: { ..., dark: '#YOUR_DARK_BG' }  // Also update globals.css :root and .dark
```

**File**: `src/app/globals.css` — Update CSS variables to match:
```css
:root { --ruby: #C15959; --cream: #FDF0D5; /* ... */ }
```

---

### 17. Changing Fonts

**File**: `src/app/layout.tsx`

The site uses Vazirmatn (Persian font). To change:
1. Update the `@next/font/google` import with your desired font
2. Update `tailwind.config.ts` fontFamily:
```ts
fontFamily: {
  vazirmatn: ['var(--font-your-font)', 'system-ui', 'sans-serif'],
}
```

---

### 18. Changing Dark/Light Mode Behavior

**File**: `src/hooks/useTheme.ts`

| Setting | Line | Current Value | Change To |
|---------|------|--------------|-----------|
| Default theme | 10 | `'dark'` | `'light'` for light-first |
| Storage key | 6 | `'yaghout_theme'` | Any unique string |

**File**: `src/app/layout.tsx` — Change the default class on `<html>`:
```tsx
<html lang="fa" dir="rtl" className="dark">  // Change "dark" to "" for light default
```

---

### 19. Changing Admin Credentials

**File**: `server/index.ts` or via environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `ADMIN_USERNAME` | `shafa` | Admin login username |
| `ADMIN_PASSWORD` | `hishafa` | Admin login password |

**Never hardcode credentials in source code for production.** Always use environment variables.

---

### 20. Changing the API Proxy (Backend URL)

**File**: `next.config.js`

```js
// Line: rewrites
async rewrites() {
  return [{
    source: '/api/:path*',
    destination: `${process.env.BACKEND_URL || 'http://localhost:3001'}/api/:path*`
  }]
}
```

Change the destination to point to a different backend URL.

---

### 21. Adding a New Page/Route

1. Create a new folder in `src/app/`:
```
src/app/my-new-page/
  └── page.tsx
```

2. Create the page:
```tsx
export default function MyNewPage() {
  return <div>محتوای صفحه جدید</div>;
}
```

3. Add a link in Navbar (`src/components/layout/Navbar.tsx`):
```tsx
<Link href="/my-new-page">صفحه جدید</Link>
```

4. Or add in Sidebar for admin pages (`src/components/layout/Sidebar.tsx`):
```tsx
<Link href="/admin/my-new-page" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-navy/60 hover:bg-navy/5 dark:text-beige-light/60 dark:hover:bg-navy-light/20">
  <IconName className="w-5 h-5" />صفحه جدید
</Link>
```

---

### 22. Adding a New Database Column

**File**: `server/db.ts`

1. Add migration after existing migrations (around line 50):
```ts
try { db.run('ALTER TABLE table_name ADD COLUMN new_column TEXT DEFAULT \'\''); } catch { /* column exists */ }
```

2. Update the table definition in `CREATE TABLE IF NOT EXISTS` above the migrations.

3. Update TypeScript types in `src/lib/types.ts`.

4. Update API routes in `server/routes/` to handle the new field.

---

### 23. Changing Component Styles (Button, Card, Input, Modal)

#### Button (`src/components/ui/Button.tsx`)
| Prop | Values | Effect |
|------|--------|--------|
| `variant` | `primary`, `secondary`, `ghost`, `danger` | Button style |
| `size` | `sm`, `md`, `lg` | Button size |
| `loading` | `true/false` | Shows spinner |

To change button colors, edit the `classes` object in Button.tsx.

#### Card (`src/components/ui/Card.tsx`)
```tsx
// Current style:
className="... bg-white/70 backdrop-blur-sm border border-navy/8 ..."
// Light mode: white/70 with blur
// Dark mode: navy-light/20 with blur
```

#### Input (`src/components/ui/Input.tsx`)
Uses `forwardRef` with optional `label`, `error`, and `icon` props.

#### Modal (`src/components/ui/Modal.tsx`)
Animated bottom-sheet on mobile, centered on desktop.

---

### 24. Static Assets Reference

All files in `public/`:

| File | Used By | Purpose |
|------|---------|---------|
| `public/yaqut-gem.png` | `YaqutIcon.tsx` | Ruby gem icon (PNG) |
| `public/yaqut-gem.svg` | Not currently used | Ruby gem icon (SVG backup) |
| `public/favicon.svg` | `layout.tsx` | Browser tab icon |
| `public/robots.txt` | Auto | SEO crawl rules |

**To add a new image**: Place it in `public/` and reference as `/image-name.ext` in your code.

---

### 25. Site Color Summary (Quick Reference)

| Element | File | Current Style |
|---------|------|--------------|
| Navbar bg (light) | `Navbar.tsx` | `bg-white/80` |
| Navbar bg (dark) | `Navbar.tsx` | `dark:bg-navy/80` |
| Sidebar bg (light) | `Sidebar.tsx` | `bg-white/95` |
| Sidebar bg (dark) | `Sidebar.tsx` | `dark:bg-navy-dark/95` |
| Footer bg (light) | `Footer.tsx` | `bg-white/40` |
| Footer bg (dark) | `Footer.tsx` | `dark:bg-navy-dark/50` |
| Login page bg | `page.tsx` | `bg-cream dark:bg-navy-dark` |
| Primary buttons | `Button.tsx` | `bg-ruby hover:bg-ruby-dark` |
| Card bg (light) | `Card.tsx` | `bg-white/70 backdrop-blur-sm` |
| Card bg (dark) | `Card.tsx` | `dark:bg-navy-light/20` |
| Page text (light) | `globals.css` | `color: #003049` |
| Page text (dark) | `globals.css` | `color: #FDF0D5` |

---

### 26. Complete File Reference

| File Path | What It Controls |
|-----------|-----------------|
| `src/app/layout.tsx` | Site title, metadata, font, RTL |
| `src/app/page.tsx` | Login page, hero, stats |
| `src/app/globals.css` | CSS variables, scrollbar, selection |
| `src/app/providers.tsx` | Auth provider wrapper |
| `src/components/layout/Navbar.tsx` | Top navigation bar |
| `src/components/layout/Footer.tsx` | Site footer |
| `src/components/layout/Sidebar.tsx` | Admin sidebar |
| `src/components/ui/Button.tsx` | Button component |
| `src/components/ui/Card.tsx` | Card container |
| `src/components/ui/Input.tsx` | Form input |
| `src/components/ui/Modal.tsx` | Modal dialog |
| `src/components/ui/Badge.tsx` | Small badge |
| `src/components/ui/ThemeToggle.tsx` | Dark/light toggle |
| `src/components/YaqutIcon.tsx` | Ruby gem icon |
| `src/components/LeaderboardTable.tsx` | Ranking table |
| `src/components/ProjectCard.tsx` | Project card |
| `src/components/ProgressBar.tsx` | Progress bar |
| `src/components/RankBadge.tsx` | Rank indicator |
| `src/components/ParticleBackground.tsx` | Floating particles |
| `src/components/SparkleEffect.tsx` | Sparkle animation |
| `src/components/YaqutConfetti.tsx` | Confetti burst |
| `src/hooks/useTheme.ts` | Dark/light mode hook |
| `src/lib/api.ts` | API client functions |
| `src/lib/auth.tsx` | Auth context & provider |
| `src/lib/types.ts` | TypeScript interfaces |
| `src/lib/helpers.ts` | Persian number/date utils |
| `tailwind.config.ts` | Colors, fonts, dark mode |
| `next.config.js` | Rewrites, security headers |
| `server/db.ts` | Database schema & seed |
| `server/index.ts` | Express server setup |
| `server/routes/auth.ts` | Login/verify endpoints |
| `server/routes/workshop.ts` | Workshop CRUD endpoints |
| `server/middleware/auth.ts` | JWT verification |

---

## Deployment Guide (Render)

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Your message"
git push origin main
```

### Step 2: Deploy Backend on Render

1. Go to https://render.com
2. **New +** → **Web Service** → Connect your GitHub repo
3. Fill in:
   - **Name**: `yaghout-api`
   - **Runtime**: Node
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npx tsx index.ts`
   - **Port**: 3001
4. Add Environment Variables:
   ```
   NODE_ENV=production
   JWT_SECRET=put-a-strong-random-string-here
   FRONTEND_URL=https://your-frontend.onrender.com
   PORT=3001
   ADMIN_USERNAME=your-admin-name
   ADMIN_PASSWORD=your-strong-password
   ```
5. Click **Create Web Service**

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

### Important Deployment Notes

- **Cache-busting**: Frontend uses `Cache-Control: no-cache, no-store, must-revalidate` headers
- **Database**: SQLite is ephemeral on Render free tier — use the Backup/Restore page to export data before redeploy
- **Both services deploy independently** — deploying one does NOT auto-deploy the other
- After deploy: hard refresh (Ctrl+Shift+R) to see changes

---

## License

MIT
