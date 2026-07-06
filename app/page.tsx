import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>
        Artist CMS
      </h1>
      <div style={{ marginBottom: '2rem' }}>
        <Link
          href="/analytics"
          style={{
            display: 'inline-block',
            padding: '12px 24px',
            backgroundColor: '#0070f3',
            color: 'white',
            borderRadius: '8px',
            fontWeight: '600',
          }}
        >
          Go to Analytics
        </Link>
      </div>
    </main>
  );
}
