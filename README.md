# Pastebin-Lite

A small Pastebin-like application to create, share, and view temporary text pastes securely.  

## Features

- Create a paste with optional TTL (expiry in seconds) and max views.
- View paste content via a unique URL.
- Pastes expire automatically when TTL ends or max views are reached.
- Health check endpoint for monitoring backend status.

## Technology Stack

- **Next.js** (Frontend + Backend API routes)
- **React** (Client components)
- **Redis** (Persistence layer for pastes, hosted on RedisLabs)
- **Vercel** (Deployment)

## Getting Started (Local Development)

1. Clone the repository:


git clone https://github.com/Saveri23/pastebin-lite.git
cd pastebin-lite
Install dependencies:

npm install
Create a .env file in the root:

REDIS_URL=redis://default:F9R5tpWiJQ2Dh7OwPHlaH4HAlRCitBdi@redis-17038.c275.us-east-1-4.ec2.cloud.redislabs.com:17038
NEXT_PUBLIC_BASE_URL=https://pastebin-lite-eosin-one.vercel.app
TEST_MODE=0

Run the development server:

npm run dev
Open http://localhost:3000 in your browser.

API Endpoints
Method	URL	Description
GET	/api/healthz	Health check
POST	/api/pastes	Create a new paste (body: { content, ttl_seconds?, max_views? })
GET	/api/pastes/:id	Fetch paste details (JSON)
GET	/p/:id	View paste in HTML

Design Decisions
Persistence: Redis to store pastes, support TTL and max views.

TTL & Max Views: Each paste can expire by time or by number of views.

Deterministic Testing: x-test-now-ms header to simulate future time.

Deployment: Vercel with REDIS_URL environment variable.
