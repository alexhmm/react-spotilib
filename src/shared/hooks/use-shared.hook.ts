import { useTranslation } from 'react-i18next';

// Types
import { SpotifyTopTimeRange } from '../types/spotify.types';

const useShared = () => {
  const { t } = useTranslation();

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
    topTitleByTimeRangeGet,
  };
};

export default useShared;
