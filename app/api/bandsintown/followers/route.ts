import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import {
  BandsintownArtistData,
  BandsintownFollowerData,
} from '@/types/bandsintown';
import fs from 'fs';
import path from 'path';

interface HistoricalData {
  timestamp: string;
  count: number;
}

interface StoredData {
  history: HistoricalData[];
}

function getDataFilePath(artistName: string): string {
  const sanitizedName = artistName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return path.join(
    process.cwd(),
    'data',
    `followers-${sanitizedName}.json`
  );
}

function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function readHistoricalData(artistName: string): StoredData {
  ensureDataDirectory();
  const dataFile = getDataFilePath(artistName);
  if (!fs.existsSync(dataFile)) {
    return { history: [] };
  }
  try {
    const data = fs.readFileSync(dataFile, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading historical data:', error);
    return { history: [] };
  }
}

function writeHistoricalData(artistName: string, data: StoredData) {
  ensureDataDirectory();
  const dataFile = getDataFilePath(artistName);
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const artistName = searchParams.get('artist');
    const appId = process.env.BANDSINTOWN_APP_ID || 'artist-cms';

    if (!artistName) {
      return NextResponse.json(
        {
          error: 'Artist name is required. Please provide ?artist=ArtistName',
        },
        { status: 400 }
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

    const storedData = readHistoricalData(artistName);

    const now = new Date().toISOString();
    storedData.history.unshift({
      timestamp: now,
      count: currentFollowers,
    });

    storedData.history = storedData.history.slice(0, 100);

    writeHistoricalData(artistName, storedData);

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
