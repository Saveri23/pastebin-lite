
export const dynamic = "force-dynamic";

import Link from "next/link";

type Paste = {
  content: string;
  created_at: number;
  ttl_seconds?: number;
  max_views?: number;
  views: number;
};


export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Pastebin Lite
        </h1>

        <p className="text-gray-600 text-center mb-6">
          Create and share temporary text pastes securely.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/new"
            className="bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700"
          >
            Create New Paste
          </Link>

          <Link
            href="/api/healthz"
            className="border border-gray-300 text-center py-2 rounded hover:bg-gray-50"
          >
            Health Check
          </Link>
        </div>
      </div>
    </main>
  );
}
