import { CircularProgress } from '@mui/material';
import { memo, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Components
import AlbumCard from '../../../albums/components/AlbumCard/AlbumCard';

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
          <div className={styles['search-albums']}>
            {searchData.albums.map((album) => (
              <AlbumCard
                key={album.id}
                album={album}
                onPlay={() => onPlayContextUri(album.uri)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default memo(Search);
