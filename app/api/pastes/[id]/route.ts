// app/api/pastes/[id]/route.ts
import { getRedis } from "@/lib/redis";

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

  const paste = JSON.parse(
    typeof raw === "string" ? raw : raw.toString()
  );

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

  await redis.set(params.id, JSON.stringify(paste), {
    EX: paste.ttl_seconds ?? undefined,
  });

  return new Response(
    JSON.stringify({
      content: paste.content,
      remaining_views: paste.max_views
        ? paste.max_views - paste.views
        : null,
      expires_at: paste.ttl_seconds
        ? new Date(
            paste.created_at + paste.ttl_seconds * 1000
          ).toISOString()
        : null,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
