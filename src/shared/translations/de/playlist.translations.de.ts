import { PlaylistTranslations } from '../types/playlist.translations.interface';

export const playlistTranslationsDE: PlaylistTranslations = {
  detail: {
    public: {
      false: 'privat',
      true: 'öffentlich',
    },
    title: 'Playlist',
    track: {
      action: {
        remove_from_playlist: {
          success: 'Aus Playlist entfernt',
          title: 'Aus Playlist entfernen',
        },
        show_album: 'Album anzeigen',
        show_artist: 'Künstli anzeigen',
      },
    },
    tracks: 'Songs',
  },
  title: 'Playlists',
};
