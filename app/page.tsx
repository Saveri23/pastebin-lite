import { redis } from '../lib/redis';
import { notFound } from 'next/navigation';

type Paste = {
  content: string;
  created_at: number;
  ttl_seconds?: number;
  max_views?: number;
  views: number;
};

export default async function PastePage({ params }: { params: { id: string } }) {
  const raw = await redis.get(params.id);
  if (!raw) return notFound();

  const paste: Paste = JSON.parse(typeof raw === 'string' ? raw : raw.toString());

  // TTL check
  const now = Date.now();
  if ((paste.ttl_seconds && paste.created_at + paste.ttl_seconds * 1000 <= now) ||
      (paste.max_views && paste.views >= paste.max_views)) {
    return notFound();
  }

  paste.views += 1;
  await redis.set(params.id, JSON.stringify(paste), { EX: paste.ttl_seconds ?? undefined });

  const expiresAt = paste.ttl_seconds
    ? new Date(paste.created_at + paste.ttl_seconds * 1000).toLocaleString()
    : 'Never';

  const remainingViews = paste.max_views ? paste.max_views - paste.views : 'Unlimited';

  return (
    <div style={{ maxWidth: 600, margin: '2rem auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>Your Paste</h1>
      <div
        style={{
          padding: 16,
          border: '1px solid #ccc',
          borderRadius: 8,
          backgroundColor: '#f9f9f9',
          whiteSpace: 'pre-wrap',
          fontFamily: 'monospace',
        }}
      >
        {paste.content}
      </div>
      <div style={{ marginTop: 12 }}>
        <p><strong>Expires at:</strong> {expiresAt}</p>
        <p><strong>Remaining views:</strong> {remainingViews}</p>
      </div>
    </div>
  );
}
