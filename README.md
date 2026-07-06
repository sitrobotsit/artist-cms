# Artist CMS

A content management system for artists with analytics integration.

## Features

- **Analytics Dashboard**: Track your artist metrics in real-time
- **Live Metrics**: View Bandsintown follower counts for multiple artists with 30-day growth tracking
- **Multi-Artist Support**: Search and track metrics for any artist on Bandsintown
- **Historical Tracking**: Automatic tracking of follower changes over time per artist

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

3. (Optional) Configure environment variables:
```bash
cp .env.example .env.local
```

If you want to use a custom Bandsintown App ID, edit `.env.local`:
```
BANDSINTOWN_APP_ID=your-app-id
```

Otherwise, the default `artist-cms` app ID will be used.

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

- `BANDSINTOWN_APP_ID` (optional): Your Bandsintown App ID (defaults to 'artist-cms')

No artist-specific configuration is required - the system supports multiple artists dynamically.

## Usage

### Analytics Dashboard

Navigate to `/analytics` to view your analytics dashboard.

### Live Metrics

Navigate to `/analytics/live` to view real-time Bandsintown metrics for any artist:

1. Enter an artist name (e.g., "Coldplay", "Taylor Swift")
2. Click "Get Data" to fetch their metrics
3. View:
   - Current follower count
   - 30-day follower change
   - Last updated timestamp

The system automatically tracks historical data per artist to calculate trends. You can search and track multiple artists - each artist's data is stored separately.

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
