import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { CircularProgress } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';

// Components
import ArtistCard from '../../../artist/components/ArtistCard/ArtistCard';

// Hooks
import useFetch from '../../../../shared/hooks/use-fetch.hook';
import useUserHttp from '../../../user/use-user-http.hook';

// Stores
import useSharedStore from '../../../../shared/stores/use-shared.store';

// Styles
import styles from './Artists.module.scss';

// Types
import { ArtistCard as IArtistCard } from '../../../artist/artist.types';
import { SpotifyItemType } from '../../../../shared/types/spotify.types';
import { FollowedArtistsGetRequest } from '../../../user/user.types';

// UI
import H3 from '../../../../shared/ui/H3/H3';

// Utils
import { artistDataMap } from '../../../artist/artist.utils';
import { concatArray, setTitle } from '../../../../shared/utils/shared.utils';

const Artists = () => {
  const { handleError, handleRetry } = useFetch();
  const { followedArtistsGet } = useUserHttp();
  const { t } = useTranslation();

  // Shared store state
  const [setPathName] = useSharedStore((state) => [state.setPathname]);

  // Component state
  const [followedArtists, setFollowedArtists] = useState<IArtistCard[]>([]);
  const [followedArtistsTotal, setFollowedArtistsTotal] = useState<
    number | undefined
  >(undefined);
  const [followedArtistsGetParams, setFollowedArtistsGetParams] =
    useState<FollowedArtistsGetRequest>({
      limit: 50,
      type: SpotifyItemType.Artist,
    });

  // ####### //
  // QUERIES //
  // ####### //

  // Get followed artists on component mount.
  // eslint-disable-next-line
  const followedArtistsQuery = useQuery(
    ['followed-artists', followedArtistsGetParams],
    () => followedArtistsGet(followedArtistsGetParams),
    {
      refetchOnWindowFocus: false,
      onError: (error: any) => {
        const errRes = error?.response;
        if (errRes) {
          console.error('Error on getting followed artists:', error);
          handleError(errRes.status);
        }
      },
      onSuccess: (data) => {
        if (data) {
          !followedArtistsTotal && setFollowedArtistsTotal(data.artists.total);
          setFollowedArtists(
            concatArray(followedArtists, artistDataMap(data.artists.items))
          );
        }
      },
      retry: handleRetry,
    }
  );

  // ####### //
  // EFFECTS //
  // ####### //

  /**
   * Set pathname and page title on mount.
   */
  useEffect(() => {
    setPathName('/library/artists');
    setTitle(t('artist.title').toString());
    return () => {
      setPathName(undefined);
      setTitle();
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div className={styles['artists']}>
      <H3>{t('artist.title')}</H3>
      <InfiniteScroll
        className="context-grid"
        dataLength={followedArtists.length}
        hasMore={
          followedArtistsTotal && followedArtists.length < followedArtistsTotal
            ? true
            : false
        }
        loader={<CircularProgress />}
        next={() =>
          setFollowedArtistsGetParams({
            after: followedArtists[followedArtists.length - 1].id,
            limit: 50,
            type: SpotifyItemType.Artist,
          })
        }
        scrollThreshold={1}
      >
        {followedArtists &&
          followedArtists.length > 0 &&
          followedArtists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
      </InfiniteScroll>
    </div>
  );
};

export default memo(Artists);
