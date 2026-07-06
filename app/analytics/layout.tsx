import Link from 'next/link';
import { ReactNode } from 'react';

export default function AnalyticsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div
      style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fff' }}
    >
      <nav
        style={{
          width: '250px',
          backgroundColor: '#1a1a1a',
          color: 'white',
          padding: '20px',
        }}
      >
        <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>Analytics</h2>
        <ul style={{ listStyle: 'none' }}>
          <li style={{ marginBottom: '1rem' }}>
            <Link
              href="/analytics"
              style={{
                color: 'white',
                display: 'block',
                padding: '8px 12px',
                borderRadius: '4px',
                transition: 'background-color 0.2s',
              }}
            >
              Overview
            </Link>
          </li>
          <li style={{ marginBottom: '1rem' }}>
            <Link
              href="/analytics/live"
              style={{
                color: 'white',
                display: 'block',
                padding: '8px 12px',
                borderRadius: '4px',
                transition: 'background-color 0.2s',
              }}
            >
              Live
            </Link>
          </li>
        </ul>
      </nav>
      <main style={{ flex: 1, padding: '40px' }}>{children}</main>
    </div>
  );
}
