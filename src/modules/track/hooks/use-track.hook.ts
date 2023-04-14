import { useTranslation } from 'react-i18next';

// Types
import { MenuItem, TrackAction } from '../../../shared/types/shared.types';

const useTrack = () => {
  const { t } = useTranslation();

  /**
   * GET track actions.
   * @returns track actions
   */
  const trackActionsGet = (): MenuItem[] => {
    const actions: MenuItem[] = [
      {
        action: TrackAction.Favorite,
        icon: ['far', 'heart'],
        title: t('track.action.favorite.title'),
      },
      {
        action: TrackAction.AddToPlaylist,
        icon: ['far', 'square-plus'],
        title: t('track.action.add_to_playlist.title'),
      },
    ];
    actions.push(
      {
        action: TrackAction.ShowAlbum,
        icon: ['fas', 'record-vinyl'],
        title: t('playlist.detail.track.action.show_album'),
      },
      {
        action: TrackAction.ShowArtist,
        icon: ['fas', 'user'],
        title: t('playlist.detail.track.action.show_artist'),
      }
    );

    return actions;
  };

  return {
    trackActionsGet,
  };
};

export default useTrack;
