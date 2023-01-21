export enum AlbumTypeEnum {
  Album = 'album',
  Compilation = 'compilation',
  Single = 'single',
}

export enum ArtistType {
  Artist = 'artist',
}

export enum ReleaseDatePrecision {
  Day = 'day',
}

export enum TrackType {
  Track = 'track',
}

export interface ExternalUrls {
  spotify: string;
}

export interface Followers {
  href: string;
  total: number;
}

export interface Image {
  height: number;
  url: string;
  width: number;
}

export interface Owner {
  id: string;
  display_name: string;
  external_urls: ExternalUrls;
  href: string;
  type: string;
  uri: string;
}

export interface SpotifyAlbum {
  album_type: AlbumTypeEnum;
  artists: Owner[];
  available_markets: string[];
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: Image[];
  name: string;
  release_date: string;
  release_date_precision: ReleaseDatePrecision;
  total_tracks: number;
  type: AlbumTypeEnum;
  uri: string;
}

export interface SpotifyArtist {
  external_urls: ExternalUrls;
  followers: Followers;
  genres: string[];
  href: string;
  id: string;
  images: Image[];
  name: string;
  popularity: number;
  type: ArtistType;
  uri: string;
}

export interface SpotifyPlaylist {
  collaborative: boolean;
  description: string;
  external_urls: ExternalUrls;
  followers: Followers;
  href: string;
  id: string;
  images: Image[];
  name: string;
  owner: Owner;
  primary_color: any;
  public: boolean;
  snapshot_id: string;
  tracks: SpotifyPlaylistTracks;
  type: string;
  uri: string;
}

export interface SpotifyPlaylistTracks {
  href: string;
  items: TrackMetaData[];
  total: number;
}

export interface SpotifyTrack {
  album: SpotifyAlbum;
  artists: SpotifyArtist[];
  available_markets: any[];
  disc_number: number;
  duration_ms: number;
  episode: boolean;
  explicit: boolean;
  external_ids: any;
  external_urls: any;
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  popularity: number;
  preview_url: string;
  track: boolean;
  track_number: number;
  type: string;
  uri: string;
}

export interface TrackMetaData {
  added_at: string;
  added_by: {
    external_urls: ExternalUrls;
    href: string;
    id: string;
    type: string;
    uri: string;
  };
  is_local: false;
  primary_color: any;
  track: SpotifyTrack;
  video_thumbnail: { url: any };
}

export interface VideoThumbnail {
  url: null;
}
