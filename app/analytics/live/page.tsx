'use client';

import { useState } from 'react';
import { BandsintownFollowerData } from '@/types/bandsintown';

export default function LivePage() {
  const [data, setData] = useState<BandsintownFollowerData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [artistName, setArtistName] = useState('');
  const [currentArtist, setCurrentArtist] = useState<string | null>(null);

  const fetchBandsintownData = async (artist: string) => {
    if (!artist.trim()) {
      setError('Please enter an artist name');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `/api/bandsintown/followers?artist=${encodeURIComponent(artist)}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch data');
      }
      const result = await response.json();
      setData(result);
      setCurrentArtist(artist);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBandsintownData(artistName);
  };

  const handleRefresh = () => {
    if (currentArtist) {
      fetchBandsintownData(currentArtist);
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Live</h1>

      <form
        onSubmit={handleSubmit}
        style={{ marginBottom: '2rem', maxWidth: '600px' }}
      >
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label
              htmlFor="artistName"
              style={{
                display: 'block',
                marginBottom: '8px',
                fontWeight: '500',
                color: '#333',
              }}
            >
              Artist Name
            </label>
            <input
              id="artistName"
              type="text"
              value={artistName}
              onChange={(e) => setArtistName(e.target.value)}
              placeholder="Enter artist name (e.g., Coldplay)"
              style={{
                width: '100%',
                padding: '10px 12px',
                fontSize: '1rem',
                border: '1px solid #ddd',
                borderRadius: '6px',
                outline: 'none',
              }}
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !artistName.trim()}
            style={{
              padding: '10px 24px',
              backgroundColor: loading || !artistName.trim() ? '#ccc' : '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: loading || !artistName.trim() ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
              whiteSpace: 'nowrap',
            }}
          >
            {loading ? 'Loading...' : 'Get Data'}
          </button>
        </div>
      </form>

      {error && (
        <div
          style={{
            padding: '20px',
            backgroundColor: '#fee',
            borderRadius: '8px',
            color: '#c00',
            marginBottom: '2rem',
          }}
        >
          <p>Error: {error}</p>
        </div>
      )}

      {data && currentArtist && (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
              marginBottom: '24px',
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
                  marginBottom: '8px',
                }}
              >
                <h3
                  style={{
                    fontSize: '1.1rem',
                    color: '#666',
                    fontWeight: '500',
                  }}
                >
                  {currentArtist}
                </h3>
              </div>
              <div
                style={{
                  fontSize: '0.9rem',
                  color: '#999',
                  marginBottom: '16px',
                }}
              >
                Bandsintown Followers
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
                  {data.current.toLocaleString()}
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
                    color: data.change30Days >= 0 ? '#00c853' : '#ff3d00',
                  }}
                >
                  {data.change30Days >= 0 ? '+' : ''}
                  {data.change30Days}
                </span>
                <span style={{ fontSize: '0.9rem', color: '#999' }}>
                  in the last 30 days
                </span>
              </div>

              {data.lastUpdated && (
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
            onClick={handleRefresh}
            disabled={loading}
            style={{
              padding: '10px 20px',
              backgroundColor: loading ? '#ccc' : '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
            }}
          >
            {loading ? 'Loading...' : 'Refresh Data'}
          </button>
        </>
      )}
    </div>
  );
}
