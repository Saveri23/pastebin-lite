import { getRedis } from "@/lib/redis";
import { validatePasteInput } from "@/lib/validate";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  const body = await req.json();
  const errors = validatePasteInput(body);

  if (errors.length > 0) {
    return new Response(JSON.stringify({ errors }), { status: 400 });
  }

  const { content, ttl_seconds, max_views } = body;
  const id = uuidv4();

  const paste = {
    content,
    created_at: Date.now(),
    ttl_seconds: ttl_seconds ?? null,
    max_views: max_views ?? null,
    views: 0,
  };

  const redis = await getRedis();

  if (ttl_seconds) {
    await redis.set(
      `paste:${id}`,
      JSON.stringify(paste),
      { EX: ttl_seconds }
    );
  } else {
    await redis.set(`paste:${id}`, JSON.stringify(paste));
  }

  return new Response(
    JSON.stringify({
      id,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/p/${id}`,
    }),
    {
      status: 201,
      headers: { "Content-Type": "application/json" },
    }
  );
}
