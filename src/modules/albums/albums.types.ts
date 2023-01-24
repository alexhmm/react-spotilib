import { SpotifyAlbum } from '../../shared/types/spotify.types';

export type AlbumCard = Pick<
  SpotifyAlbum,
  'artists' | 'id' | 'images' | 'name' | 'release_date' | 'uri'
>;
