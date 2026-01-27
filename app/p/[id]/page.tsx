import { getRedis } from "@/lib/redis";
import { notFound } from "next/navigation";

type Paste = {
  content: string;
  created_at: number;
  ttl_seconds?: number;
  max_views?: number;
  views: number;
};

export default async function PastePage({
  params,
}: {
  params: { id: string };
}) {
  const redis = await getRedis(); // ✅ THIS WAS MISSING

  const raw = await redis.get(`paste:${params.id}`);
  if (!raw) return notFound();

  const paste: Paste = JSON.parse(
    typeof raw === "string" ? raw : raw.toString()
  );

  // TTL / max views check
  const now = Date.now();
  const expired =
    (paste.ttl_seconds &&
      paste.created_at + paste.ttl_seconds * 1000 <= now) ||
    (paste.max_views && paste.views >= paste.max_views);

  if (expired) return notFound();

  // increment views
  paste.views += 1;

  if (paste.ttl_seconds) {
    await redis.set(
      `paste:${params.id}`,
      JSON.stringify(paste),
      { EX: paste.ttl_seconds }
    );
  } else {
    await redis.set(`paste:${params.id}`, JSON.stringify(paste));
  }

  const expiresAt = paste.ttl_seconds
    ? new Date(
        paste.created_at + paste.ttl_seconds * 1000
      ).toLocaleString()
    : "Never";

  const remainingViews = paste.max_views
    ? paste.max_views - paste.views
    : "Unlimited";

  return (
    <div className="mx-auto mt-8 max-w-xl rounded-lg border p-6">
      <h1 className="mb-4 text-xl font-semibold">Your Paste</h1>

      <pre className="rounded bg-gray-100 p-4 text-sm">
        {paste.content}
      </pre>

      <div className="mt-4 text-sm text-gray-600">
        <p><strong>Expires at:</strong> {expiresAt}</p>
        <p><strong>Remaining views:</strong> {remainingViews}</p>
      </div>
    </div>
  );
}
