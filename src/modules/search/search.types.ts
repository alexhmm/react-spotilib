// Types
import { AlbumCard } from '../album/album.types';
import { ArtistCard } from '../artist/artist.types';
import { PlaylistCard } from '../playlist/playlist.types';
import {
  SpotifyItemType,
  SpotifyAlbum,
  SpotifyArtist,
  SpotifyDataGetResponse,
  SpotifyPlaylist,
  SpotifyTrack,
} from '../../shared/types/spotify.types';
import { TrackCard } from '../track/track.types';

export interface SearchData {
  albums?: AlbumCard[];
  artists?: ArtistCard[];
  playlists?: PlaylistCard[];
  tracks?: TrackCard[];
}

export interface SearchGetParams {
  q: string;
  type: SpotifyItemType[];
}

export interface SearchGetResponse {
  albums: SpotifyDataGetResponse<SpotifyAlbum[]>;
  artists: SpotifyDataGetResponse<SpotifyArtist[]>;
  playlists: SpotifyDataGetResponse<SpotifyPlaylist[]>;
  tracks: SpotifyDataGetResponse<SpotifyTrack[]>;
}
