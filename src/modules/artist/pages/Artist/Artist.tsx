import { memo, useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { CircularProgress } from '@mui/material';

// Components
import AlbumCard from '../../../album/components/AlbumCard/AlbumCard';
import ArtistCard from '../../components/ArtistCard/ArtistCard';
import ArtistTopTrack from '../../components/ArtistTopTrack/ArtistTopTrack';
import ImageFallback from '../../../../shared/components/ImageFallback/ImageFallback';

// Hooks
import useArtistHttp from '../../use-artist-http.hook';
import useFetch from '../../../../shared/hooks/use-fetch.hook';
import usePlayerHttp from '../../../../shared/hooks/use-player-http.hook';
import useUserHttp from '../../../user/use-user-http.hook';

// Stores
import useSharedStore from '../../../../shared/stores/use-shared.store';
import useUserStore from '../../../user/use-user.store';

// Styles
import styles from './Artist.module.scss';

// Types
import { AlbumCard as IAlbumCard } from '../../../album/album.types';
import {
  ArtistCard as IArtistCard,
  ArtistTopTracksGetResponse,
} from '../../artist.types';
import {
  ImageFallbackType,
  RequestMethod,
} from '../../../../shared/types/shared.types';
import {
  SpotifyAlbumType,
  SpotifyArtist,
  SpotifyFollowType,
  SpotifyMarket,
  SpotifyTrack,
} from '../../../../shared/types/spotify.types';
import { ButtonType } from '../../../../shared/types/ui.types';

// UI
import H2 from '../../../../shared/ui/H2/H2';
import H3 from '../../../../shared/ui/H3/H3';
import IconButton from '../../../../shared/ui/IconButton/IconButton';
import TextButton from '../../../../shared/ui/TextButton/TextButton';
import TextButtonContained from '../../../../shared/ui/TextButtonContained/TextButtonContained';
import TextButtonOutlined from '../../../../shared/ui/TextButtonOutlined/TextButtonOutlined';

// Utils
import { mapAlbumData } from '../../../album/album.utils';
import { artistDataMap } from '../../artist.utils';
import { setTitle } from '../../../../shared/utils/shared.utils';

type ArtistAlbumsTypeButtonProps = {
  currentType: SpotifyAlbumType | undefined;
  type?: SpotifyAlbumType;
  title: string;
  onClick: (type: SpotifyAlbumType | undefined) => void;
};

const ArtistAlbumsTypeButton = (props: ArtistAlbumsTypeButtonProps) => {
  return (
    <TextButtonContained
      classes={styles['artist-discography-types-button']}
      preset={
        props.currentType === props.type ? ButtonType.Selected : undefined
      }
      onClick={() => props.onClick(props.type)}
    >
      {props.title}
    </TextButtonContained>
  );
};

const Artist = () => {
  const { albumsGet, artistGet, relatedArtistsGet, topTracksGet } =
    useArtistHttp();
  const { handleError, handleRetry } = useFetch();
  const { id } = useParams();
  const navigate = useNavigate();
  const { playPutMutation } = usePlayerHttp();
  const { t, i18n } = useTranslation();
  const { followingStateGet, followingStatePutDeleteMutation } = useUserHttp();

  // Shared store state
  const [following, setHeaderTitle, setFollowing] = useSharedStore((state) => [
    state.following,
    state.setHeaderTitle,
    state.setFollowing,
  ]);

  // User store state
  const [profile] = useUserStore((state) => [state.profile]);

  // Component state
  const [albums, setAlbums] = useState<IAlbumCard[]>([]);
  const [albumsType, setAlbumsType] = useState<SpotifyAlbumType | undefined>(
    undefined
  );
  const [appearsOn, setAppearsOn] = useState<IAlbumCard[]>([]);
  const [artist, setArtist] = useState<SpotifyArtist | undefined>(undefined);
  const [compilations, setCompilations] = useState<IAlbumCard[]>([]);
  const [releases, setReleases] = useState<IAlbumCard[]>([]);
  const [relatedArtists, setRelatedArtists] = useState<IArtistCard[]>([]);
  const [singles, setSingles] = useState<IAlbumCard[]>([]);
  const [topTracks, setTopTracks] = useState<SpotifyTrack[]>([]);
  const [topTracksMore, setTopTracksMore] = useState<boolean>(false);

  // ####### //
  // QUERIES //
  // ####### //

  // Get artist albums by id, user country.
  // eslint-disable-next-line
  const albumsQuery = useQuery(
    ['albums', id, profile?.country, SpotifyAlbumType.Album],
    () =>
      albumsGet(id, {
        include_groups: SpotifyAlbumType.Album,
        market: (profile?.country as SpotifyMarket) ?? '',
      }),
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
          setAlbums(mapAlbumData(data.items));
        }
      },
      retry: (failureCount, error: any) => handleRetry(failureCount, error),
    }
  );

  // Get artist appears on by id, user country.
  // eslint-disable-next-line
  const appearsOnQuery = useQuery(
    ['appears-on', id, profile?.country],
    () =>
      albumsGet(id, {
        include_groups: SpotifyAlbumType.AppearsOn,
        market: (profile?.country as SpotifyMarket) ?? '',
      }),
    {
      refetchOnWindowFocus: false,
      onError: (error: any) => {
        const errRes = error?.response;
        if (errRes) {
          console.error('Error on getting artist appears on:', error);
          handleError(errRes.status);
        }
      },
      onSuccess: (data) => {
        if (data) {
          setAppearsOn(mapAlbumData(data.items));
        }
      },
      retry: (failureCount, error: any) => handleRetry(failureCount, error),
    }
  );

  // Get artist by id.
  // eslint-disable-next-line
  const artistQuery = useQuery(['artist', id], () => artistGet(id), {
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
        setArtist(data);
        setTitle(data.name);
        // Wait for transition animation
        setTimeout(() => {
          setHeaderTitle(data.name);
        }, 500);
      }
    },
    retry: (failureCount, error: any) => handleRetry(failureCount, error),
  });

  // Get artist compilations by id, user country.
  // eslint-disable-next-line
  const compilationsQuery = useQuery(
    ['albums', id, profile?.country, SpotifyAlbumType.Compilation],
    () =>
      albumsGet(id, {
        include_groups: SpotifyAlbumType.Compilation,
        market: (profile?.country as SpotifyMarket) ?? '',
      }),
    {
      refetchOnWindowFocus: false,
      onError: (error: any) => {
        const errRes = error?.response;
        if (errRes) {
          console.error('Error on getting artist compilations:', error);
          handleError(errRes.status);
        }
      },
      onSuccess: (data) => {
        if (data) {
          setCompilations(mapAlbumData(data.items));
        }
      },
      retry: (failureCount, error: any) => handleRetry(failureCount, error),
    }
  );

  // Get artist following state by id.
  // eslint-disable-next-line
  const followingStateQuery = useQuery(
    ['following', id],
    () =>
      followingStateGet({
        ids: [id ?? ''],
        type: SpotifyFollowType.Artist,
      }),
    {
      refetchOnWindowFocus: false,
      onError: (error: any) => {
        const errRes = error?.response;
        if (errRes) {
          console.error('Error on getting following state for artist:', error);
          handleError(errRes.status);
        }
      },
      onSuccess: (data) => {
        data && setFollowing(data[0]);
      },
      retry: (failureCount, error: any) => handleRetry(failureCount, error),
    }
  );

  // Get all artist releases by id, user country.
  // eslint-disable-next-line
  const releasesQuery = useQuery(
    ['albums', id, profile?.country, undefined],
    () =>
      albumsGet(id, {
        market: (profile?.country as SpotifyMarket) ?? '',
      }),
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
          setReleases(mapAlbumData(data.items));
        }
      },
      retry: (failureCount, error: any) => handleRetry(failureCount, error),
    }
  );

  // Get related artists by artist id.
  // eslint-disable-next-line
  const relatedArtistsQuery = useQuery(
    ['related-artists', id],
    () => relatedArtistsGet(id),
    {
      refetchOnWindowFocus: false,
      onError: (error: any) => {
        const errRes = error?.response;
        if (errRes) {
          console.error('Error on getting related artists:', error);
          handleError(errRes.status);
        }
      },
      onSuccess: (data) => {
        if (data) {
          setRelatedArtists(artistDataMap(data.artists));
        }
      },
      retry: (failureCount, error: any) => handleRetry(failureCount, error),
    }
  );

  // Get artist singles and eps by id, user country.
  // eslint-disable-next-line
  const singlesQuery = useQuery(
    ['albums', id, profile?.country, SpotifyAlbumType.Single],
    () =>
      albumsGet(id, {
        include_groups: SpotifyAlbumType.Single,
        market: (profile?.country as SpotifyMarket) ?? '',
      }),
    {
      refetchOnWindowFocus: false,
      onError: (error: any) => {
        const errRes = error?.response;
        if (errRes) {
          console.error('Error on getting artist singles and eps:', error);
          handleError(errRes.status);
        }
      },
      onSuccess: (data) => {
        if (data) {
          setSingles(mapAlbumData(data.items));
        }
      },
      retry: (failureCount, error: any) => handleRetry(failureCount, error),
    }
  );

  // Get artist top tracks by id and user country.
  // eslint-disable-next-line
  const topTracksQuery = useQuery(
    ['top-tracks', id, profile?.country],
    () => topTracksGet(id, profile?.country),
    {
      refetchOnWindowFocus: false,
      onError: (error: any) => {
        const errRes = error?.response;
        if (errRes) {
          console.error('Error on getting artists top tracks:', error);
          handleError(errRes.status);
        }
      },
      onSuccess: (data: ArtistTopTracksGetResponse) => {
        if (data) {
          setTopTracks(data.tracks);
        }
      },
      retry: (failureCount, error: any) => handleRetry(failureCount, error),
    }
  );

  // ######### //
  // CALLBACKS //
  // ######### //

  /**
   * Handler to change following state.
   */
  const onFollowStateChange = useCallback(() => {
    id &&
      followingStatePutDeleteMutation.mutate({
        body: {
          ids: [id],
        },
        deleteSuccessMessage: t('artist.detail.follow.delete'),
        method: following ? RequestMethod.Delete : RequestMethod.Put,
        params: {
          ids: [id],
          type: SpotifyFollowType.Artist,
        },
        putSuccessMessage: t('artist.detail.follow.put'),
      });
    // eslint-disable-next-line
  }, [following, id]);

  /**
   * Handler to play context by uri.
   * @param contextUri Spotify URI of the context to play
   *
   */
  const onPlayContext = useCallback(
    (contextUri: string) => {
      playPutMutation.mutate({
        body: {
          context_uri: contextUri,
        },
      });
    },
    // eslint-disable-next-line
    []
  );

  /**
   * Handler to play top track from artist starting from selected index.
   */
  const onPlayTopTrack = useCallback(
    (index: number) => {
      const uris: string[] = [];
      for (let i = index; i < topTracks.length; i++) {
        uris.push(topTracks[i].uri);
      }
      playPutMutation.mutate({
        body: {
          uris,
        },
      });
    },
    // eslint-disable-next-line
    [topTracks]
  );

  // ####### //
  // EFFECTS //
  // ####### //

  // Reset data on id change.
  useEffect(() => {
    return () => {
      setAlbums([]);
      setAlbumsType(undefined);
      setAppearsOn([]);
      setArtist(undefined);
      setCompilations([]);
      setHeaderTitle(undefined);
      setRelatedArtists([]);
      setReleases([]);
      setSingles([]);
      setTopTracks([]);
      setTopTracksMore(false);
      setTitle();
    };
    // eslint-disable-next-line
  }, [id]);

  return (
    <>
      {!artist && artistQuery.isLoading && <CircularProgress />}
      {artist && (
        <div className={styles['artist']}>
          <div className={styles['artist-header']}>
            <div className={styles['artist-header-image']}>
              {artist.images[0]?.url ? (
                <img
                  alt={`${t('artist.title')} ${artist.name}`}
                  src={artist.images[0].url}
                />
              ) : (
                <ImageFallback type={ImageFallbackType.Artist} />
              )}
            </div>
            <div className={styles['artist-header-info']}>
              <H2 classes={styles['artist-header-info-name']}>{artist.name}</H2>
              <div className={styles['artist-header-info-followers']}>
                {new Intl.NumberFormat(i18n.language).format(
                  artist.followers.total
                )}
                {' ' + t('app.followers')}
              </div>
            </div>
          </div>
          <div className={styles['artist-actions']}>
            <IconButton
              borderRadius="rounded-full"
              icon={['fas', 'play']}
              iconSize="medium"
              padding="1rem"
              preset={ButtonType.Primary}
              sx={{
                svg: {
                  transform: 'translateX(2px)',
                },
              }}
              onClick={() => onPlayContext(artist.uri)}
            />
            {following !== undefined && (
              <TextButtonOutlined
                classes={styles['artist-actions-follow']}
                preset={following ? ButtonType.Selected : undefined}
                onClick={onFollowStateChange}
              >
                {following ? t('app.follow.active') : t('app.follow.inactive')}
              </TextButtonOutlined>
            )}
          </div>
          <section className={styles['artist-section']}>
            <H3>{t('artist.detail.top_tracks')}</H3>
            {topTracks &&
              topTracks.map((track, index) => {
                if ((!topTracksMore && index < 5) || topTracksMore) {
                  return (
                    <ArtistTopTrack
                      key={track.id}
                      index={index}
                      track={track}
                      onPlay={() => onPlayTopTrack(index)}
                    />
                  );
                }
                return null;
              })}
            {topTracks.length > 5 && (
              <TextButton
                onClick={() =>
                  topTracksMore
                    ? setTopTracksMore(false)
                    : setTopTracksMore(true)
                }
              >
                {topTracksMore ? t('app.show.less') : t('app.show.more')}
              </TextButton>
            )}
          </section>
          <section className={styles['artist-section']}>
            <H3
              actionTitle={t('app.show.all').toString()}
              onAction={() =>
                navigate(`/artist/${id}/discography/${albumsType ?? 'all'}`)
              }
            >
              {t('artist.detail.discography.title')}
            </H3>
            <div className={styles['artist-discography-types']}>
              <ArtistAlbumsTypeButton
                currentType={albumsType}
                title={t('artist.detail.discography.type.all')}
                onClick={() => setAlbumsType(undefined)}
              />
              {albums.length > 0 ? (
                <ArtistAlbumsTypeButton
                  currentType={albumsType}
                  title={t('artist.detail.discography.type.album')}
                  type={SpotifyAlbumType.Album}
                  onClick={() => setAlbumsType(SpotifyAlbumType.Album)}
                />
              ) : null}
              {singles.length > 0 ? (
                <ArtistAlbumsTypeButton
                  currentType={albumsType}
                  title={t('artist.detail.discography.type.single')}
                  type={SpotifyAlbumType.Single}
                  onClick={() => setAlbumsType(SpotifyAlbumType.Single)}
                />
              ) : null}
              {compilations.length ? (
                <ArtistAlbumsTypeButton
                  currentType={albumsType}
                  title={t('artist.detail.discography.type.compilation')}
                  type={SpotifyAlbumType.Compilation}
                  onClick={() => setAlbumsType(SpotifyAlbumType.Compilation)}
                />
              ) : null}
            </div>
            <div className="context-grid">
              {albumsType === undefined &&
                releases.map((album) => (
                  <AlbumCard key={album.id} album={album} />
                ))}
              {albumsType === SpotifyAlbumType.Album &&
                albums.map((album) => (
                  <AlbumCard key={album.id} album={album} />
                ))}
              {albumsType === SpotifyAlbumType.Single &&
                singles.map((album) => (
                  <AlbumCard key={album.id} album={album} />
                ))}
              {albumsType === SpotifyAlbumType.Compilation &&
                compilations.map((album) => (
                  <AlbumCard key={album.id} album={album} />
                ))}
            </div>
          </section>
          <section className={styles['artist-section']}>
            <H3>{t('artist.detail.related_artists')}</H3>
            <div className="context-grid">
              {relatedArtists.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </div>
          </section>
          {appearsOn.length > 0 && (
            <section className={styles['artist-section']}>
              <H3>{t('artist.detail.appears_on')}</H3>
              <div className="context-grid">
                {appearsOn.map((album) => (
                  <AlbumCard key={album.id} album={album} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </>
  );
};

export default memo(Artist);
