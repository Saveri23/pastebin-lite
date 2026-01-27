import { redis } from '../../../../lib/redis';
import { now } from '../../../../lib/time';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  let raw = await redis.get(id);
  if (!raw) return new Response(JSON.stringify({ error: 'Paste not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });

  // Convert Buffer to string if needed
  const rawString = typeof raw === 'string' ? raw : raw.toString();
  const paste = JSON.parse(rawString);

  const currentTime = now(req);

  // TTL check
  if (paste.ttl_seconds && paste.created_at + paste.ttl_seconds * 1000 <= currentTime) {
    return new Response(JSON.stringify({ error: 'Paste expired' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
  }

  // Max views check
  if (paste.max_views && paste.views >= paste.max_views) {
    return new Response(JSON.stringify({ error: 'View limit exceeded' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
  }

  // Increment views
  paste.views += 1;
  await redis.set(id, JSON.stringify(paste), { EX: paste.ttl_seconds ?? undefined });

  return new Response(JSON.stringify({
    content: paste.content,
    remaining_views: paste.max_views ? paste.max_views - paste.views : null,
    expires_at: paste.ttl_seconds ? new Date(paste.created_at + paste.ttl_seconds * 1000).toISOString() : null,
  }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}
