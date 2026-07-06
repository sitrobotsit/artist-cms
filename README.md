# Artist CMS

A content management system for artists with analytics integration.

## Features

- **Analytics Dashboard**: Track your artist metrics in real-time
- **Live Metrics**: View your Bandsintown follower count and 30-day growth
- **Historical Tracking**: Automatic tracking of follower changes over time

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Bandsintown artist profile

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd artist-cms
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Bandsintown artist name:
```
BANDSINTOWN_ARTIST_NAME=Your Artist Name
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

- `BANDSINTOWN_ARTIST_NAME` (required): Your artist name as it appears on Bandsintown
- `BANDSINTOWN_APP_ID` (optional): Your Bandsintown App ID (defaults to 'artist-cms')

## Usage

### Analytics Dashboard

Navigate to `/analytics` to view your analytics dashboard.

### Live Metrics

Navigate to `/analytics/live` to view real-time Bandsintown metrics including:
- Current follower count
- 30-day follower change
- Last updated timestamp

The system automatically tracks historical data to calculate trends.

## Project Structure

```
artist-cms/
├── app/
│   ├── analytics/
│   │   ├── live/
│   │   │   └── page.tsx       # Live metrics page
│   │   ├── layout.tsx         # Analytics layout with sidebar
│   │   └── page.tsx           # Analytics overview
│   ├── api/
│   │   └── bandsintown/
│   │       └── followers/
│   │           └── route.ts   # API endpoint for Bandsintown data
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── types/
│   └── bandsintown.ts         # TypeScript type definitions
├── data/                      # Historical data storage
└── package.json
```

## Technologies

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Bandsintown API**: Artist metrics and follower tracking

## License

MIT
