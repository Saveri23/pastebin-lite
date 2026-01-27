import { redis } from '../../../lib/redis';
import { now } from '../../../lib/time';

interface PastePageProps {
  params: { id: string };
  headers: Headers;
}

export default async function PastePage({ params, headers }: PastePageProps) {
  const { id } = params;

  let raw = await redis.get(id);
  if (!raw) return <h1>Paste not found</h1>;

  // Convert Buffer to string if needed
  const rawString = typeof raw === 'string' ? raw : raw.toString();
  const paste = JSON.parse(rawString);

  const currentTime = now({ headers });

  // TTL or max_views check
  const expired =
    (paste.ttl_seconds && paste.created_at + paste.ttl_seconds * 1000 <= currentTime) ||
    (paste.max_views && paste.views >= paste.max_views);

  if (expired) return <h1>Paste unavailable</h1>;

  // Increment views
  paste.views += 1;
  await redis.set(id, JSON.stringify(paste), { EX: paste.ttl_seconds ?? undefined });

  return (
    <html lang="en">
      <head>
        <title>Paste {id}</title>
      </head>
      <body>
        <pre>{paste.content}</pre>
      </body>
    </html>
  );
}
