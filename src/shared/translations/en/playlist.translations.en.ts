import { PlaylistTranslations } from '../types/playlist.translations.interface';

export const playlistTranslationsEN: PlaylistTranslations = {
  detail: {
    public: {
      false: 'Private',
      true: 'Public',
    },
    title: 'Playlist',
    track: {
      action: {
        remove_from_playlist: {
          success: 'Removed from playlist',
          title: 'Remove from this playlist',
        },
        show_album: 'Show album',
        show_artist: 'Show artist',
      },
    },
    tracks: 'Tracks',
  },
  title: 'Playlists',
};
