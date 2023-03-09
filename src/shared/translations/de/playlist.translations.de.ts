import { PlaylistTranslations } from '../types/playlist.translations.interface';

export const playlistTranslationsDE: PlaylistTranslations = {
  detail: {
    action: {
      make_private: {
        success: 'Deine Playlist wurde auf privat umgestellt',
        title: 'Auf privat umstellen',
      },
      make_public: {
        success: 'Deine Playlist wurde veröffentlicht',
        title: 'Veröffentlichen',
      },
    },
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
