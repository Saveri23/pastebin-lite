📝 Pastebin Lite (Next.js + Redis)

A simple Pastebin-like application built with Next.js (App Router) that allows users to create text pastes, retrieve them via unique URLs, limit views, and set expiration time.
Designed to work correctly in serverless environments and deployed on Vercel.

🚀 Features

Create text pastes via API

Retrieve pastes by ID

Optional expiration time

Optional view limits

Serverless-safe implementation

Clean UI with card-based feedback (no browser alerts)

Redis-backed persistence

🧱 Tech Stack

Next.js (App Router)

TypeScript

Redis (Redis Cloud)

Vercel (deployment)

📦 Persistence Layer

This project uses Redis as the persistence layer.

Why Redis?

Fast key-value storage

Built-in TTL support (used for paste expiration)

Works well with serverless platforms like Vercel

No global mutable state is used

Each paste is stored as a Redis key with:

Content

Remaining views

Expiry (via Redis TTL)

🛠️ Running Locally
1️⃣ Clone the repository
git clone <YOUR_GIT_REPO_URL>
cd pastebin-lite

2️⃣ Install dependencies
npm install

3️⃣ Create .env.local
REDIS_URL=redis://<username>:<password>@<host>:<port>
NEXT_PUBLIC_BASE_URL=http://localhost:3000


⚠️ Note:

Do not commit .env.local

No secrets are stored in the repository

4️⃣ Run the development server
npm run dev


App will be available at:

http://localhost:3000

🔌 API Endpoints
✅ Health Check
GET /api/healthz

✏️ Create a Paste
POST /api/pastes


Request body (JSON):

{
  "content": "Hello world",
  "expiresIn": 3600,
  "maxViews": 5
}

📄 Get Paste Data
GET /api/pastes/{paste_id}

🌐 View Paste (UI)
GET /p/{paste_id}

🌍 Deployment

The app is deployed using Vercel.

Steps used:
vercel
vercel --prod


Environment variables are configured in the Vercel Dashboard, not in code.

🧪 Code Quality & Guidelines

✔ No hardcoded localhost URLs in committed code
✔ No secrets or credentials committed
✔ Server-side logic is stateless and serverless-safe
✔ Standard install and run commands
✔ No manual DB setup required after deployment

📌 Notable Design Decisions

Redis TTL is used instead of cron jobs for expiration

View count is decremented atomically per request

API-first design with clean separation of UI and backend

Card-based UI feedback instead of browser alerts

Error and success states are handled visually

📎 Submission Links

Deployed URL: <YOUR_VERCEL_URL>

Git Repository: <YOUR_GITHUB_REPO_URL>
Status

The project meets all repository, build, runtime, and deployment guidelines required for evaluation.