import { redis } from '../../../lib/redis';
import { validatePasteInput } from '../../../lib/validate';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  const body = await req.json();
  const errors = validatePasteInput(body);
  if (errors.length > 0)
    return new Response(JSON.stringify({ errors }), { status: 400 });

  const { content, ttl_seconds, max_views } = body;
  const id = uuidv4();
  const paste = {
    content,
    ttl_seconds: ttl_seconds ?? null,
    max_views: max_views ?? null,
    created_at: Date.now(),
    views: 0,
  };

  // Save paste in Redis
  await redis.set(id, JSON.stringify(paste), {
    EX: ttl_seconds ?? undefined,
  });

  return new Response(
    JSON.stringify({ id, url: `${process.env.NEXT_PUBLIC_BASE_URL}/p/${id}` }),
    { status: 201, headers: { 'Content-Type': 'application/json' } }
  );
}
