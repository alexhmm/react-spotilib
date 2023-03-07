import { useTranslation } from 'react-i18next';

// Types
import { NavigationItem, TabItem } from '../types/shared.types';
import { SpotifyTopTimeRange } from '../types/spotify.types';

const useShared = () => {
  const { t } = useTranslation();

  /**
   * GET Translated duration text by milliseconds.
   * @param ms Milliseconds
   */
  const durationByMillisecondsGet = (ms: number): string => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (60 * 1000)) % 60);
    const hours = Math.floor((ms / (3600 * 1000)) % 3600);
    return `${
      hours > 0 ? `${hours} ${t('album.detail.duration.hours')} ` : ''
    }${
      hours > 0
        ? `${minutes} ${t('album.detail.duration.minutes')}`
        : `${minutes} ${t('album.detail.duration.minutes')} `
    }${
      hours < 1 && seconds > 0
        ? `${seconds} ${t('album.detail.duration.seconds')}`
        : ''
    }`;
  };

  /**
   * GET Library navigation items.
   * @returns Library navigation items array.
   */
  const libraryNavigationItemsGet = (): NavigationItem[] => {
    return [
      {
        pathname: '/library/playlists',
        title: t('playlist.title'),
      },
      {
        pathname: '/library/artists',
        title: t('artist.title'),
      },
      {
        pathname: '/library/albums',
        title: t('album.title'),
      },
    ];
  };

  /**
   * GET Mobile tab items.
   * @returns Tab items array.
   */
  const tabItemsGet = (): TabItem[] => {
    return [
      {
        icon: ['fas', 'house'],
        pathname: '/',
        title: t('app.sidebar.home'),
      },
      {
        icon: ['fas', 'magnifying-glass'],
        pathname: '/search',
        title: t('search.title'),
      },
      {
        icon: ['fas', 'book'],
        pathname: '/library',
        title: t('app.sidebar.library'),
      },
    ];
  };

  /**
   * GET Top title translation by time range.
   * @param timeRange SpotifyTopTimeRange
   * @returns Top title translation.
   */
  const topTitleByTimeRangeGet = (timeRange: SpotifyTopTimeRange): string => {
    switch (timeRange) {
      case SpotifyTopTimeRange.Long_Term:
        return t('app.top.long_term');
      case SpotifyTopTimeRange.Medium_Term:
        return t('app.top.medium_term');
      case SpotifyTopTimeRange.Short_Term:
        return t('app.top.short_term');
      default:
        return '';
    }
  };

  return {
    durationByMillisecondsGet,
    libraryNavigationItemsGet,
    tabItemsGet,
    topTitleByTimeRangeGet,
  };
};

export default useShared;
