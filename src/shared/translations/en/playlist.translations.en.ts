import { PlaylistTranslations } from '../types/playlist.translations.interface';

export const playlistTranslationsEN: PlaylistTranslations = {
  detail: {
    action: {
      edit_details: {
        description: {
          label: 'Description',
          placeholder: 'Add optional description',
        },
        disclaimer:
          'By proceeding, you agree to give Spotify access to the image you choose to upload. Please make sure you have the right to upload the image.',
        image: 'Select image',
        name: {
          error: 'Playlist name is required.',
          label: 'Name',
          placeholder: 'Add name',
        },
        success: 'Playlist details has been edited',
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
