export interface IYouTubeVideo {
  id: number;
  title?: string | null;
  youtube_url: string;
  description?: string | null;
  category?: string | null;
  topic?: string | null;
  views: number;
  created_at?: string;
  updated_at?: string;
}

export interface IYouTubeVideoCreateRequest {
  title?: string | null;
  youtube_url: string;
  description?: string | null;
  category?: string | null;
  topic?: string | null;
}

export interface IYouTubeVideoUpdateRequest {
  title?: string | null;
  youtube_url?: string;
  description?: string | null;
  category?: string | null;
  topic?: string | null;
}
