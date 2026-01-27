// app/api/pastes/[id]/route.ts
import { getRedis } from "@/lib/redis";

type Paste = {
  content: string;
  created_at: number;
  ttl_seconds: number | null;
  max_views: number | null;
  views: number;
};

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const redis = await getRedis();
  const raw = await redis.get(params.id);

  if (!raw) {
    return new Response(
      JSON.stringify({ error: "Paste not found" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  // ✅ FIXED
  const text = typeof raw === "string" ? raw : raw.toString();
  const paste: Paste = JSON.parse(text);

  const now = Date.now();
  if (
    (paste.ttl_seconds &&
      paste.created_at + paste.ttl_seconds * 1000 <= now) ||
    (paste.max_views && paste.views >= paste.max_views)
  ) {
    return new Response(
      JSON.stringify({ error: "Paste expired" }),
      { status: 404, headers: { "Content-Type": "application/json" } }
    );
  }

  paste.views += 1;

  if (paste.ttl_seconds) {
    await redis.set(params.id, JSON.stringify(paste), {
      EX: paste.ttl_seconds,
    });
  } else {
    await redis.set(params.id, JSON.stringify(paste));
  }

  return new Response(
    JSON.stringify(paste),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
