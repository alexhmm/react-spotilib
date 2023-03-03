import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { CircularProgress } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';

// Components
import AlbumCard from '../../../album/components/AlbumCard/AlbumCard';

// Hooks
import useFetch from '../../../../shared/hooks/use-fetch.hook';
import useUserHttp from '../../../user/use-user-http.hook';

// Stores
import useSharedStore from '../../../../shared/stores/use-shared.store';
import useUserStore from '../../../user/use-user.store';

// Styles
import styles from './Albums.module.scss';

// Types
import { SavedAlbumCard } from '../../../album/album.types';
import { SpotifyMarket } from '../../../../shared/types/spotify.types';
import { SavedAlbumsGetParams } from '../../../user/user.types';

// UI
import H3 from '../../../../shared/ui/H3/H3';

// Utils
import { savedAlbumDataMap } from '../../../album/album.utils';
import { concatArray, setTitle } from '../../../../shared/utils/shared.utils';

const Albums = () => {
  const { handleError, handleRetry } = useFetch();
  const { t } = useTranslation();
  const { savedAlbumsGet } = useUserHttp();

  // Shared store state
  const [setPathName] = useSharedStore((state) => [state.setPathname]);

  // User store state
  const [profile] = useUserStore((state) => [state.profile]);

  // Component state
  const [savedAlbums, setSavedAlbums] = useState<SavedAlbumCard[]>([]);
  const [savedAlbumsTotal, setSavedAlbumsTotal] = useState<number | undefined>(
    undefined
  );
  const [savedAlbumsGetParams, setSavedAlbumsGetParams] =
    useState<SavedAlbumsGetParams>({
      limit: 50,
      market: profile?.country as SpotifyMarket,
      offset: 0,
    });

  // ####### //
  // QUERIES //
  // ####### //

  // Get saved albums on component mount.
  // eslint-disable-next-line
  const savedAlbumsQuery = useQuery(
    ['saved-albums', savedAlbumsGetParams],
    () => savedAlbumsGet(savedAlbumsGetParams),
    {
      refetchOnWindowFocus: false,
      onError: (error: any) => {
        const errRes = error?.response;
        if (errRes) {
          console.error('Error on getting saved albums:', error);
          handleError(errRes.status);
        }
      },
      onSuccess: (data) => {
        if (data) {
          !savedAlbumsTotal && setSavedAlbumsTotal(data.total);
          setSavedAlbums(
            concatArray(savedAlbums, savedAlbumDataMap(data.items))
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
    setPathName('/library/albums');
    setTitle(t('album.title').toString());
    return () => {
      setPathName(undefined);
      setTitle();
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div className={styles['albums']}>
      <H3>{t('album.title')}</H3>
      <InfiniteScroll
        className="context-grid"
        dataLength={savedAlbums.length}
        hasMore={
          savedAlbumsTotal && savedAlbums.length < savedAlbumsTotal
            ? true
            : false
        }
        loader={<CircularProgress />}
        next={() =>
          setSavedAlbumsGetParams({
            limit: 50,
            offset: savedAlbums.length,
          })
        }
        scrollThreshold={1}
      >
        {savedAlbums &&
          savedAlbums.length > 0 &&
          savedAlbums.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
      </InfiniteScroll>
    </div>
  );
};

export default memo(Albums);
