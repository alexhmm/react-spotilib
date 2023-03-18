import { PlaylistTranslations } from '../types/playlist.translations.interface';

export const playlistTranslationsEN: PlaylistTranslations = {
  detail: {
    action: {
      edit_details: {
        description: {
          label: 'Description',
          placeholder: 'Add optional description',
        },
        image: 'Select image',
        name: {
          label: 'Name',
          placeholder: 'Add name',
        },
        title: 'Edit details',
      },
      make_private: {
        success: 'Playlist has been made private',
        title: 'Make private',
      },
      make_public: {
        success: 'Playlist has been made public',
        title: 'Make public',
      },
    },
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
