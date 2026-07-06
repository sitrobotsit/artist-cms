'use client';

import { useEffect, useState } from 'react';
import { BandsintownFollowerData } from '@/types/bandsintown';

export default function LivePage() {
  const [data, setData] = useState<BandsintownFollowerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBandsintownData();
  }, []);

  const fetchBandsintownData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/bandsintown/followers');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Live</h1>
        <p style={{ color: '#666' }}>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Live</h1>
        <div
          style={{
            padding: '20px',
            backgroundColor: '#fee',
            borderRadius: '8px',
            color: '#c00',
          }}
        >
          <p>Error: {error}</p>
          <p style={{ marginTop: '10px', fontSize: '0.9rem' }}>
            Make sure to set your BANDSINTOWN_ARTIST_NAME environment variable
            and optionally BANDSINTOWN_APP_ID.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Live</h1>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginTop: '24px',
        }}
      >
        <div
          style={{
            backgroundColor: '#fff',
            border: '1px solid #e0e0e0',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}
          >
            <h3
              style={{
                fontSize: '1.1rem',
                color: '#666',
                fontWeight: '500',
              }}
            >
              Bandsintown Followers
            </h3>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="10" stroke="#00d4aa" strokeWidth="2" />
              <circle cx="12" cy="12" r="3" fill="#00d4aa" />
            </svg>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <div
              style={{
                fontSize: '3rem',
                fontWeight: '700',
                color: '#1a1a1a',
                lineHeight: '1',
              }}
            >
              {data?.current.toLocaleString()}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span
              style={{
                fontSize: '1rem',
                fontWeight: '600',
                color:
                  data && data.change30Days >= 0 ? '#00c853' : '#ff3d00',
              }}
            >
              {data && data.change30Days >= 0 ? '+' : ''}
              {data?.change30Days}
            </span>
            <span style={{ fontSize: '0.9rem', color: '#999' }}>
              in the last 30 days
            </span>
          </div>

          {data?.lastUpdated && (
            <div
              style={{
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: '1px solid #f0f0f0',
                fontSize: '0.85rem',
                color: '#999',
              }}
            >
              Last updated:{' '}
              {new Date(data.lastUpdated).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              })}
            </div>
          )}
        </div>
      </div>

      <button
        onClick={fetchBandsintownData}
        style={{
          marginTop: '24px',
          padding: '10px 20px',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: '500',
        }}
      >
        Refresh Data
      </button>
    </div>
  );
}
