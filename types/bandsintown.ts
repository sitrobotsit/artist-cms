export interface BandsintownFollowerData {
  current: number;
  change30Days: number;
  lastUpdated: string;
}

export interface BandsintownArtistData {
  name: string;
  url: string;
  image_url?: string;
  thumb_url?: string;
  facebook_page_url?: string;
  mbid?: string;
  tracker_count: number;
  upcoming_event_count?: number;
}
