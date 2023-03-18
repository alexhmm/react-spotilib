export interface PlaylistTranslations {
  detail: {
    action: {
      edit_details: {
        description: {
          label: string;
          placeholder: string;
        };
        image: string;
        name: {
          label: string;
          placeholder: string;
        };
        title: string;
      };
      make_private: {
        success: string;
        title: string;
      };
      make_public: {
        success: string;
        title: string;
      };
    };
    public: {
      false: string;
      true: string;
    };
    title: string;
    track: {
      action: {
        remove_from_playlist: {
          success: string;
          title: string;
        };
        show_album: string;
        show_artist: string;
      };
    };
    tracks: string;
  };
  title: string;
}
