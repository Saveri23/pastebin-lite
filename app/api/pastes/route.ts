// app/api/pastes/route.ts
import { getRedis } from "@/lib/redis";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  const body = await req.json();
  const { content, ttl_seconds, max_views } = body;

  if (!content || typeof content !== "string") {
    return new Response(JSON.stringify({ error: "Content is required" }), { status: 400 });
  }

  const id = uuidv4();
  const paste = {
    content,
    ttl_seconds: ttl_seconds ?? null,
    max_views: max_views ?? null,
    created_at: Date.now(),
    views: 0,
  };

  const redis = await getRedis();

  // Store in Redis
  if (ttl_seconds) {
    await redis.set(id, JSON.stringify(paste), { EX: ttl_seconds });
  } else {
    await redis.set(id, JSON.stringify(paste));
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  return new Response(
    JSON.stringify({ id, url: `${baseUrl}/p/${id}` }),
    { status: 201, headers: { "Content-Type": "application/json" } }
  );
}
