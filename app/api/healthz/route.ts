import { getRedis } from "@/lib/redis";

export async function GET() {
  try {
    const redis = await getRedis();
    await redis.ping();

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false, error: String(err) }),
      { status: 500 }
    );
  }
}
