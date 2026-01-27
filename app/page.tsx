'use client';
import { useState } from 'react';

export default function Home() {
  const [content, setContent] = useState('');
  const [ttl, setTtl] = useState('');
  const [maxViews, setMaxViews] = useState('');
  const [result, setResult] = useState('');

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setResult('');
    try {
      const res = await fetch('/api/pastes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          ttl_seconds: ttl ? parseInt(ttl) : undefined,
          max_views: maxViews ? parseInt(maxViews) : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) setResult(JSON.stringify(data));
      else setResult(`Paste URL: ${data.url}`);
    } catch (err) {
      setResult('Error creating paste');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Pastebin-Lite</h1>
      <form onSubmit={handleSubmit}>
        <textarea placeholder="Paste content" value={content} onChange={(e) => setContent(e.target.value)} rows={10} cols={50}></textarea><br/>
        <input type="number" placeholder="TTL seconds (optional)" value={ttl} onChange={(e) => setTtl(e.target.value)} /><br/>
        <input type="number" placeholder="Max views (optional)" value={maxViews} onChange={(e) => setMaxViews(e.target.value)} /><br/>
        <button type="submit">Create Paste</button>
      </form>
      {result && <div style={{ marginTop: '1rem', whiteSpace: 'pre-wrap' }}>{result}</div>}
    </div>
  );
}
