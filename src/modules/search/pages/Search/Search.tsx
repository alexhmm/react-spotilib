import { CircularProgress } from '@mui/material';
import { memo, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Components
import AlbumCard from '../../../albums/components/AlbumCard/AlbumCard';
import ArtistCard from '../../../artists/components/ArtistCard/ArtistCard';

// Hooks
import { usePlayerHttp } from '../../../../shared/hooks/use-player-http.hook';

// Stores
import useSearchStore from '../../use-search.store';

// Styles
import styles from './Search.module.scss';

// UI
import H3 from '../../../../shared/ui/H3/H3';

const Search = () => {
  const { playPutMutation } = usePlayerHttp();
  const { t } = useTranslation();

  // Search store state
  const [searchData, searchLoading, setSearchElem] = useSearchStore((state) => [
    state.searchData,
    state.searchLoading,
    state.setSearchElem,
  ]);

  // ####### //
  // EFFECTS //
  // ####### //

  // Set search element on component mount.
  useEffect(() => {
    setSearchElem(true);
    return () => {
      setSearchElem(false);
    };
    // eslint-disable-next-line
  }, []);

  // ######### //
  // CALLBACKS //
  // ######### //

  /**
   * @param context_uri Spotify URI of the context to play
   */
  const onPlayContextUri = useCallback((context_uri: string) => {
    playPutMutation.mutate({
      body: {
        context_uri,
      },
    });
    // eslint-disable-next-line
  }, []);

  return (
    <div className={styles['search']}>
      {searchLoading && <CircularProgress />}
      {searchData?.albums && (
        <>
          <H3>{t('albums.title')}</H3>
          <div className={styles['search-context']}>
            {searchData.albums.map((album) => (
              <AlbumCard
                key={album.id}
                album={album}
                onPlay={() => onPlayContextUri(album.uri)}
              />
            ))}
          </div>
          <H3>{t('artists.title')}</H3>
          <div className={styles['search-context']}>
            {searchData.artists?.map((artist) => (
              <ArtistCard
                key={artist.id}
                artist={artist}
                onPlay={() => onPlayContextUri(artist.uri)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default memo(Search);
