import { memo, useCallback, useState } from 'react';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@mui/material';

// Components
import ArtistCard from '../../artist/components/ArtistCard/ArtistCard';
import TrackCard from '../../../shared/components/TrackCard/TrackCard';

// Hooks
import useFetch from '../../../shared/hooks/use-fetch.hook';
import usePlayerHttp from '../../../shared/hooks/use-player-http.hook';
import useShared from '../../../shared/hooks/use-shared.hook';

// Stores
import useAuthStore from '../../auth/use-auth.store';

// Styles
import styles from './Home.module.scss';

// Types
import { ArtistCard as IArtistCard } from '../../artist/artist.types';
import {
  SpotifyArtist,
  SpotifyDataGetResponse,
  SpotifyTopTimeRange,
} from '../../../shared/types/spotify.types';
import {
  TopTracksGetResponse,
  TrackCard as ITrackCard,
} from '../../../shared/types/track.types';

// UI
import H2 from '../../../shared/ui/H2/H2';
import H3 from '../../../shared/ui/H3/H3';
// import Popover from '../../../shared/ui/Popover/Popover';

// Utils
import { artistDataMap } from '../../artist/artist.utils';
import { trackDataMap } from '../../../shared/utils/track.utils';

const Home = () => {
  const { fetchData, handleError } = useFetch();
  const { playPutMutation } = usePlayerHttp();
  const { topTitleByTimeRangeGet } = useShared();
  const { t } = useTranslation();

  // Auth store state
  const [token] = useAuthStore((state) => [state.token]);

  // Component state
  // const [anchorPopover1, setAnchorPopover1] = useState<
  //   HTMLButtonElement | undefined
  // >(undefined);
  // const [anchorPopover2, setAnchorPopover2] = useState<
  //   HTMLButtonElement | undefined
  // >(undefined);
  // const [anchorPopover3, setAnchorPopover3] = useState<
  //   HTMLButtonElement | undefined
  // >(undefined);
  const [topArtists, setTopArtists] = useState<IArtistCard[]>([]);
  const [topArtistsTimeRange, setTopArtistsTimeRange] =
    useState<SpotifyTopTimeRange>(SpotifyTopTimeRange.Short_Term);
  const [topTracks, setTopTracks] = useState<ITrackCard[]>([]);
  const [topTracksTimeRange, setTopTracksTimeRange] =
    useState<SpotifyTopTimeRange>(SpotifyTopTimeRange.Short_Term);

  // ####### //
  // QUERIES //
  // ####### //

  // Get profile on access token change.
  // eslint-disable-next-line
  const topArtistsQuery = useQuery<SpotifyDataGetResponse<SpotifyArtist[]>>(
    ['top-artists', token, topArtistsTimeRange],
    () =>
      fetchData(
        `me/top/artists?limit=20&offset=0&time_range=${topArtistsTimeRange}`
      ),
    {
      refetchOnWindowFocus: false,
      onError: (error: any) => {
        const errRes = error?.response;
        if (errRes) {
          console.error('Error on getting top artists:', error);
          handleError(errRes.status);
        }
      },
      onSuccess: (data) => {
        setTopArtists(artistDataMap(data.items));
      },
    }
  );

  // Get profile on access token change.
  // eslint-disable-next-line
  const topTracksQuery = useQuery<TopTracksGetResponse>(
    ['top-tracks', token, topTracksTimeRange],
    () =>
      fetchData(
        `me/top/tracks?limit=20&offset=0&time_range=${topTracksTimeRange}`
      ),
    {
      refetchOnWindowFocus: false,
      onError: (error: any) => {
        const errRes = error?.response;
        if (errRes) {
          console.error('Error on getting top tracks:', error);
          handleError(errRes.status);
        }
      },
      onSuccess: (data) => {
        setTopTracks(trackDataMap(data.items));
      },
    }
  );

  // ######### //
  // CALLBACKS //
  // ######### //

  /**
   * Handler to play selected track.
   * @param trackUri Spotify track URI to play
   */
  const onTrackPlay = useCallback((trackUri: string) => {
    playPutMutation.mutate({
      body: {
        uris: [trackUri],
      },
    });
    // eslint-disable-next-line
  }, []);

  /**
   * Handler to change top artists time range.
   * @param timeRange SpotifyTopTimeRange
   */
  const onTopArtistsTimeRangeChange = useCallback(
    (timeRange: SpotifyTopTimeRange) => {
      if (timeRange !== topArtistsTimeRange) {
        setTopArtists([]);
        setTopArtistsTimeRange(timeRange);
      }
    },
    [topArtistsTimeRange]
  );

  /**
   * Handler to change top tracks time range.
   * @param timeRange SpotifyTopTimeRange
   */
  const onTopTracksTimeRangeChange = useCallback(
    (timeRange: SpotifyTopTimeRange) => {
      if (timeRange !== topTracksTimeRange) {
        setTopTracks([]);
        setTopTracksTimeRange(timeRange);
      }
    },
    [topTracksTimeRange]
  );

  return (
    <div className={styles['home']}>
      <H2>{t('app.hello')}</H2>
      <H3
        menuItems={[
          {
            action: SpotifyTopTimeRange.Short_Term,
            title: t('app.top.short_term'),
          },
          {
            action: SpotifyTopTimeRange.Medium_Term,
            title: t('app.top.medium_term'),
          },
          {
            action: SpotifyTopTimeRange.Long_Term,
            title: t('app.top.long_term'),
          },
        ]}
        menuTitle={topTitleByTimeRangeGet(topArtistsTimeRange)}
        onMenuAction={onTopArtistsTimeRangeChange}
      >
        {t('app.top.artists')}
      </H3>
      <div className={styles['home-top-artists']}>
        {(topArtistsQuery.isLoading || topArtistsQuery.isRefetching) &&
          [...Array(20)].map((element, index) => {
            return (
              <Skeleton
                key={index}
                className={styles['home-top-item-loading']}
                height={220}
                variant="rectangular"
              />
            );
          })}
        {topArtists?.map((artist) => (
          <ArtistCard key={artist.id} artist={artist} />
        ))}
      </div>
      <H3
        classes="pt-2 lg:pt-4"
        menuItems={[
          {
            action: SpotifyTopTimeRange.Short_Term,
            title: t('app.top.short_term'),
          },
          {
            action: SpotifyTopTimeRange.Medium_Term,
            title: t('app.top.medium_term'),
          },
          {
            action: SpotifyTopTimeRange.Long_Term,
            title: t('app.top.long_term'),
          },
        ]}
        menuTitle={topTitleByTimeRangeGet(topTracksTimeRange)}
        onMenuAction={onTopTracksTimeRangeChange}
      >
        {t('app.top.tracks')}
      </H3>
      <div className={styles['home-top-tracks']}>
        {(topTracksQuery.isLoading || topTracksQuery.isRefetching) &&
          [...Array(20)].map((element, index) => {
            return (
              <Skeleton
                key={index}
                className={styles['home-top-item-loading']}
                height={40}
                variant="rectangular"
              />
            );
          })}
        {topTracks?.map((track) => (
          <TrackCard
            key={track.id}
            track={track}
            onPlay={() => onTrackPlay(track.uri)}
          />
        ))}
      </div>
      {/* <div className={styles['home-content-popovers']}>
        <Popover
          anchor={anchorPopover1}
          anchorOrigin={{
            horizontal: 'left',
            vertical: 'bottom',
          }}
          buttonClasses="mr-4"
          buttonTitle="Origin Left"
          transformOrigin={{
            horizontal: 'left',
            vertical: 'top',
          }}
          onClose={() => setAnchorPopover1(undefined)}
          onOpen={(anchor) => setAnchorPopover1(anchor)}
        >
          <div>Left Left Left Left 1</div>
          <div>Left Left Left Left 2</div>
          <div>Left Left Left Left 3</div>
          <div>Left Left Left Left 4</div>
        </Popover>
        <Popover
          anchor={anchorPopover2}
          buttonClasses="mr-4"
          buttonTitle="Simple Popover"
          onClose={() => setAnchorPopover2(undefined)}
          onOpen={(anchor) => setAnchorPopover2(anchor)}
        >
          <div>Test Test Test 1</div>
          <div>Test Test Test 2</div>
          <div>Test Test Test 3</div>
          <div>Test Test Test 4</div>
        </Popover>
        <Popover
          anchor={anchorPopover3}
          buttonTitle="Custom Icon"
          icon={['fas', 'sun']}
          onClose={() => setAnchorPopover3(undefined)}
          onOpen={(anchor) => setAnchorPopover3(anchor)}
        >
          <div>Custom Icon Custom Icon 1</div>
          <div>Custom Icon Custom Icon 2</div>
          <div>Custom Icon Custom Icon 3</div>
          <div>Custom Icon Custom Icon 4</div>
        </Popover>
      </div> */}
    </div>
  );
};

export default memo(Home);
