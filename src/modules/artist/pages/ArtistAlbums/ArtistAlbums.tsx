import { memo, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CircularProgress } from '@mui/material';

// Components
import AlbumCard from '../../../album/components/AlbumCard/AlbumCard';

// Hooks
import useArtistHttp from '../../use-artist-http.hook';
import useFetch from '../../../../shared/hooks/use-fetch.hook';

// Stores
import useSharedStore from '../../../../shared/stores/use-shared.store';
import useUserStore from '../../../user/use-user.store';

// Styles
import styles from './ArtistAlbums.module.scss';

// Types
import { AlbumCard as IAlbumCard } from '../../../album/album.types';
import { ArtistAlbumsGetParams } from '../../artist.types';
import {
  SpotifyArtist,
  SpotifyMarket,
} from '../../../../shared/types/spotify.types';

// UI
import H3 from '../../../../shared/ui/H3/H3';

// Utils
import { mapAlbumData } from '../../../album/album.utils';
import { setTitle } from '../../../../shared/utils/shared.utils';

const ArtistAlbums = () => {
  const { albumsGet, artistGet } = useArtistHttp();
  const { handleError, handleRetry } = useFetch();
  const { id, type } = useParams();

  // Shared store state
  const [setHeaderTitle] = useSharedStore((state) => [state.setHeaderTitle]);

  // User store state
  const [profile] = useUserStore((state) => [state.profile]);

  // Component state
  const [albums, setAlbums] = useState<IAlbumCard[]>([]);
  const [albumsGetParams, setAlbumsGetParams] = useState<ArtistAlbumsGetParams>(
    {
      include_groups: type,
      limit: 20,
      market: profile?.country as SpotifyMarket,
      offset: 0,
    }
  );
  const [albumsTotal, setAlbumsTotal] = useState<number | undefined>(undefined);
  const [artist, setArtist] = useState<SpotifyArtist | undefined>(undefined);

  // ####### //
  // QUERIES //
  // ####### //

  // Get artist albums by id, user country and type.
  // eslint-disable-next-line
  const albumsQuery = useQuery(
    ['albums', id, albumsGetParams, profile, type],
    () => albumsGet(id, albumsGetParams),
    {
      refetchOnWindowFocus: false,
      onError: (error: any) => {
        const errRes = error?.response;
        if (errRes) {
          console.error('Error on getting artist albums:', error);
          handleError(errRes.status);
        }
      },
      onSuccess: (data) => {
        if (data) {
          !albumsTotal && setAlbumsTotal(data.total);
          setAlbums(albums.concat(mapAlbumData(data.items)));
        }
      },
      retry: (failureCount, error: any) => handleRetry(failureCount, error),
    }
  );

  // Get artist by id.
  // eslint-disable-next-line
  const artistQuery = useQuery(
    ['artist', id, profile],
    () => artistGet(profile ? id : ''),
    {
      refetchOnWindowFocus: false,
      onError: (error: any) => {
        const errRes = error?.response;
        if (errRes) {
          console.error('Error on getting artist:', error);
          handleError(errRes.status);
        }
      },
      onSuccess: (data) => {
        if (data) {
          setAlbumsGetParams({
            include_groups: type,
            limit: 20,
            market: profile?.country as SpotifyMarket,
            offset: 0,
          });
          setArtist(data);
          setTitle(data.name);
          // Wait for transition animation
          setTimeout(() => {
            setHeaderTitle(data.name);
          }, 500);
        }
      },
      retry: (failureCount, error: any) => handleRetry(failureCount, error),
    }
  );

  // ####### //
  // EFFECTS //
  // ####### //

  // Reset data on id change.
  useEffect(() => {
    return () => {
      setArtist(undefined);
      setHeaderTitle(undefined);
      setTitle();
    };
    // eslint-disable-next-line
  }, [id]);

  return (
    <div className={styles['artist-albums']} id="content">
      {artist && <H3 link={`/artist/${artist.id}`}>{artist.name}</H3>}
      <InfiniteScroll
        className="context-grid"
        dataLength={albums.length}
        hasMore={albumsTotal && albums.length < albumsTotal ? true : false}
        loader={<CircularProgress />}
        next={() =>
          setAlbumsGetParams({
            include_groups: type,
            market: profile?.country as SpotifyMarket,
            limit: 20,
            offset: albums.length,
          })
        }
        scrollThreshold={1}
      >
        {albums.map((album) => (
          <AlbumCard key={album.id} album={album} />
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default memo(ArtistAlbums);
