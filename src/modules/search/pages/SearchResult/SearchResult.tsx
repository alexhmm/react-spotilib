import { memo, useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import { CircularProgress } from '@mui/material';

// Components
import AlbumCard from '../../../album/components/AlbumCard/AlbumCard';
import ArtistCard from '../../../artist/components/ArtistCard/ArtistCard';
import PlaylistCard from '../../../playlist/components/PlaylistCard/PlaylistCard';
import TrackCard from '../../../../shared/components/TrackCard/TrackCard';

// Hooks
import useFetch from '../../../../shared/hooks/use-fetch.hook';
import usePlayerHttp from '../../../../shared/hooks/use-player-http.hook';
import useSearchHttp from '../../use-search-http.hook';

// Stores
import useSearchStore from '../../use-search.store';

// Styles
import styles from './SearchResult.module.scss';

// Types
import { SpotifyItemType } from '../../../../shared/types/spotify.types';

// UI
import H3 from '../../../../shared/ui/H3/H3';

// Utils
import { searchDataCreate } from '../../search.utils';
import { setTitle } from '../../../../shared/utils/shared.utils';

const SearchResult = () => {
  const { handleError } = useFetch();
  const { query } = useParams();
  const { playPutMutation } = usePlayerHttp();
  const { searchGet } = useSearchHttp();
  const { t } = useTranslation();

  // Search store state
  const [searchData, setSearch, setSearchData] = useSearchStore((state) => [
    state.searchData,
    state.setSearch,
    state.setSearchData,
  ]);

  // ####### //
  // QUERIES //
  // ####### //

  // Search by query.
  // eslint-disable-next-line
  const searchQuery = useQuery(
    ['search', query],
    () =>
      searchGet({
        q: query ?? '',
        type: [
          SpotifyItemType.Album,
          SpotifyItemType.Artist,
          SpotifyItemType.Playlist,
          SpotifyItemType.Track,
        ],
      }),
    {
      refetchOnWindowFocus: false,
      onError: (error: any) => {
        const errRes = error?.response;
        if (errRes) {
          console.error('Error on search:', error);
          handleError(errRes.status);
        }
      },
      onSuccess: (data) => {
        if (data) {
          data && setSearchData(searchDataCreate(data));
        }
      },
    }
  );

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

  // ####### //
  // EFFECTS //
  // ####### //

  // Set page title on mount
  useEffect(() => {
    setTitle(t('search.title').toString());
    return () => {
      setSearchData(undefined);
      setTitle();
    };
    // eslint-disable-next-line
  }, []);

  // Set search string by query on mount
  useEffect(() => {
    setSearch(query ?? '');
    // eslint-disable-next-line
  }, [query]);

  return (
    <div className={styles['search-result']}>
      {searchQuery.isLoading && <CircularProgress />}
      {searchData && (
        <>
          {searchData.artists && searchData.artists.length > 0 && (
            <>
              <H3>{t('artist.title')}</H3>
              <div className="context-grid">
                {searchData.artists?.map((artist) => (
                  <ArtistCard key={artist.id} artist={artist} />
                ))}
              </div>
            </>
          )}
          {searchData.albums && searchData.albums.length > 0 && (
            <>
              <H3>{t('album.title')}</H3>
              <div className="context-grid">
                {searchData.albums.map((album) => (
                  <AlbumCard key={album.id} album={album} />
                ))}
              </div>
            </>
          )}
          {searchData.playlists && searchData.playlists.length > 0 && (
            <>
              <H3>{t('playlist.title')}</H3>
              <div className="context-grid">
                {searchData.playlists?.map((playlist) => (
                  <PlaylistCard key={playlist.id} playlist={playlist} />
                ))}
              </div>
            </>
          )}
          {searchData.tracks && searchData.tracks.length > 0 && (
            <>
              <H3>{t('track.title')}</H3>
              <div className={styles['search-result-tracks']}>
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
        </>
      )}
    </div>
  );
};

export default memo(SearchResult);
