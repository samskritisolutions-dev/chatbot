# AI Chatbot SaaS Platform
**Stack: PHP (Laravel 11) + Next.js 14 + MySQL + OpenAI GPT-4o + Pusher**

---

## 📁 Project Structure

```
chatbot-platform/
├── backend/       ← Laravel 11 PHP API
├── frontend/      ← Next.js 14 Dashboard
└── widget/        ← Embeddable widget.js
```

---

## 🚀 Quick Start

### 1. Backend (Laravel)

```bash
cd backend

# Install dependencies
composer install

# Set up environment
cp .env.example .env
php artisan key:generate

# Edit .env with your DB credentials, OpenAI key, Pusher keys

# Run migrations
php artisan migrate

# Start development server
php artisan serve
# → http://localhost:8000
```

### 2. Frontend (Next.js)

```bash
cd frontend

# Install dependencies
npm install

# Set up environment
cp .env.example .env.local

# Edit .env.local:
# NEXT_PUBLIC_API_URL=http://localhost:8000/api
# NEXT_PUBLIC_PUSHER_KEY=your-pusher-key

# Start development server
npm run dev
# → http://localhost:3000
```

### 3. Widget

Copy `widget/widget.js` to your Laravel `public/` folder.

Then update the `BASE_URL` inside `widget.js` to point to your live domain:
```js
const BASE_URL = 'https://yourdomain.com/api';
```

Clients embed it on their site with:
```html
<script src="https://yourdomain.com/widget.js" data-bot-id="CLIENT_BOT_UID" defer></script>
```

---

## ⚙️ Environment Variables

### Backend (.env)
| Variable | Description |
|---|---|
| `DB_*` | MySQL database credentials |
| `OPENAI_API_KEY` | Your OpenAI API key |
| `PUSHER_APP_*` | Pusher or Soketi credentials |
| `FRONTEND_URL` | Next.js URL for CORS (e.g. http://localhost:3000) |

### Frontend (.env.local)
| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Laravel API base URL |
| `NEXT_PUBLIC_PUSHER_KEY` | Pusher app key |
| `NEXT_PUBLIC_PUSHER_CLUSTER` | Pusher cluster (e.g. ap2) |

---

## 🗄️ Database

Run these in order:
```bash
php artisan migrate
```

Tables created:
- `clients` — registered client accounts
- `bots` — chatbot configurations per client
- `conversations` — all chat messages
- `personal_access_tokens` — Sanctum auth tokens

---

## 🔑 API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/register | Client signup |
| POST | /api/auth/login | Login → returns token |
| GET | /api/bots | List client's bots |
| POST | /api/bots | Create new bot |
| PUT | /api/bots/{id} | Update bot & prompt |
| GET | /api/bots/{id}/embed | Get embed script |
| GET | /api/widget/{uid}/config | Public — bot branding |
| POST | /api/widget/{uid}/chat | Public — AI chat |
| GET | /api/conversations | List all sessions |
| POST | /api/conversations/{sid}/takeover | Agent takeover |
| POST | /api/conversations/{sid}/reply | Agent reply |

---

## 🌐 Deployment (cPanel/WHM)

### Backend
1. Upload `backend/` files to a subdomain (e.g. `api.yourdomain.com`)
2. Set document root to `backend/public`
3. Create MySQL database and user
4. Set `.env` with production values
5. Run `composer install --no-dev` and `php artisan migrate`

### Frontend
```bash
npm run build
npm run start   # or export static with: npm run export
```
Or deploy to Vercel for zero-config Next.js hosting.

### Widget
Copy `widget.js` to Laravel's `public/` folder — it will be served at `https://yourdomain.com/widget.js`.

---

## 💬 Real-time (Pusher / Soketi)

- **Pusher** (cloud): Sign up at pusher.com, create an app, copy keys to `.env`
- **Soketi** (self-hosted free): Install with `npm install -g soketi`, run `soketi start`
  - Set `PUSHER_HOST=127.0.0.1` and `PUSHER_PORT=6001` in `.env`

---

## 📦 Tech Stack

| Layer | Tech |
|---|---|
| Backend | PHP 8.2, Laravel 11, Laravel Sanctum |
| Frontend | Next.js 14, React 18, Tailwind CSS |
| State | Zustand |
| Database | MySQL 8.0 |
| AI | OpenAI GPT-4o |
| Real-time | Pusher / Soketi + Laravel Echo |
| Widget | Vanilla JS (no dependencies) |
