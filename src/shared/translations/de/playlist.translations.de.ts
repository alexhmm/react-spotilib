import { PlaylistTranslations } from '../types/playlist.translations.interface';

export const playlistTranslationsDE: PlaylistTranslations = {
  detail: {
    action: {
      edit_details: {
        description: {
          label: 'Beschreibung',
          placeholder: 'Optionale Beschreibung hinzufügen',
        },
        disclaimer:
          'Wenn du fortfährst, stimmst du zu, dass Spotify auf dein hochgeladenes Bild zugreift. Stell bitte sicher, dass du berechtigt bist, dieses Bild hochzuladen',
        image: 'Foto auswählen',
        name: {
          error: 'Du musst einen Playlist-Namen eingeben.',
          label: 'Name',
          placeholder: 'Namen eingeben',
        },
        success: 'Playlist Details wurden bearbeitet',
        title: 'Details bearbeiten',
      },
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
