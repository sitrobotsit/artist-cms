import { NextResponse } from 'next/server';
import axios from 'axios';
import {
  BandsintownArtistData,
  BandsintownFollowerData,
} from '@/types/bandsintown';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'followers-history.json');

interface HistoricalData {
  timestamp: string;
  count: number;
}

interface StoredData {
  history: HistoricalData[];
}

function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function readHistoricalData(): StoredData {
  ensureDataDirectory();
  if (!fs.existsSync(DATA_FILE)) {
    return { history: [] };
  }
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading historical data:', error);
    return { history: [] };
  }
}

function writeHistoricalData(data: StoredData) {
  ensureDataDirectory();
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function calculate30DayChange(history: HistoricalData[], currentCount: number): number {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const thirtyDayOldEntry = history.find((entry) => {
    const entryDate = new Date(entry.timestamp);
    return entryDate <= thirtyDaysAgo;
  });

  if (thirtyDayOldEntry) {
    return currentCount - thirtyDayOldEntry.count;
  }

  if (history.length > 0) {
    const oldestEntry = history[history.length - 1];
    return currentCount - oldestEntry.count;
  }

  return 0;
}

export async function GET() {
  try {
    const artistName = process.env.BANDSINTOWN_ARTIST_NAME;
    const appId = process.env.BANDSINTOWN_APP_ID || 'artist-cms';

    if (!artistName) {
      return NextResponse.json(
        {
          error:
            'BANDSINTOWN_ARTIST_NAME environment variable is not configured',
        },
        { status: 500 }
      );
    }

    const apiUrl = `https://rest.bandsintown.com/artists/${encodeURIComponent(artistName)}?app_id=${encodeURIComponent(appId)}`;

    const response = await axios.get<BandsintownArtistData>(apiUrl, {
      headers: {
        'User-Agent': 'artist-cms/1.0',
      },
    });

    const artistData = response.data;
    const currentFollowers = artistData.tracker_count;

    const storedData = readHistoricalData();

    const now = new Date().toISOString();
    storedData.history.unshift({
      timestamp: now,
      count: currentFollowers,
    });

    storedData.history = storedData.history.slice(0, 100);

    writeHistoricalData(storedData);

    const change30Days = calculate30DayChange(
      storedData.history,
      currentFollowers
    );

    const result: BandsintownFollowerData = {
      current: currentFollowers,
      change30Days,
      lastUpdated: now,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching Bandsintown data:', error);

    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return NextResponse.json(
          { error: 'Artist not found on Bandsintown' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        {
          error: `Bandsintown API error: ${error.message}`,
        },
        { status: error.response?.status || 500 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to fetch Bandsintown data' },
      { status: 500 }
    );
  }
}
