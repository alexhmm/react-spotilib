import { CircularProgress } from '@mui/material';
import { memo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

// Components
import AlbumCard from '../../../album/components/AlbumCard/AlbumCard';
import ArtistCard from '../../../artist/components/ArtistCard/ArtistCard';
import PlaylistCard from '../../../playlist/components/PlaylistCard/PlaylistCard';
import TrackCard from '../../../../shared/components/TrackCard/TrackCard';

// Hooks
import usePlayerHttp from '../../../../shared/hooks/use-player-http.hook';

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
  const [searchData, searchLoading] = useSearchStore((state) => [
    state.searchData,
    state.searchLoading,
  ]);

  // ######### //
  // CALLBACKS //
  // ######### //

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
          <H3>{t('album.title')}</H3>
          <div className="context-grid">
            {searchData.albums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
          <H3>{t('artist.title')}</H3>
          <div className="context-grid">
            {searchData.artists?.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
          <H3>{t('playlist.title')}</H3>
          <div className="context-grid">
            {searchData.playlists?.map((playlist) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
          <H3>{t('track.title')}</H3>
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
