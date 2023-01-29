import { CircularProgress } from '@mui/material';
import { memo, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Components
import AlbumCard from '../../../albums/components/AlbumCard/AlbumCard';
import ArtistCard from '../../../artists/components/ArtistCard/ArtistCard';
import TrackCard from '../../../tracks/components/TrackCard/TrackCard';

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
   * Handler to play context by uri.
   * @param context_uri Spotify URI of the context to play
   */
  const onPlayContext = useCallback((context_uri: string) => {
    playPutMutation.mutate({
      body: {
        context_uri,
      },
    });
    // eslint-disable-next-line
  }, []);

  /**
   * Handler to play selected track.
   * @param track_uri Spotify track URI to play
   */
  const onPlayTrack = useCallback((track_uri: string) => {
    playPutMutation.mutate({
      body: {
        uris: [track_uri],
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
                onPlay={() => onPlayContext(album.uri)}
              />
            ))}
          </div>
          <H3>{t('artists.title')}</H3>
          <div className={styles['search-context']}>
            {searchData.artists?.map((artist) => (
              <ArtistCard
                key={artist.id}
                artist={artist}
                onPlay={() => onPlayContext(artist.uri)}
              />
            ))}
          </div>
          <H3>{t('tracks.title')}</H3>
          <div className={styles['search-tracks']}>
            {searchData.tracks?.map((track) => (
              <TrackCard
                key={track.id}
                track={track}
                onPlay={() => onPlayTrack(track.uri)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default memo(Search);
