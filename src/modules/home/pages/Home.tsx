import { memo, useState } from 'react';
import { useQuery } from 'react-query';
import { useTranslation } from 'react-i18next';
import { Box, Button, Skeleton } from '@mui/material';

// Components
import ArtistCard from '../../artists/components/ArtistCard/ArtistCard';
import TrackCard from '../../tracks/components/TrackCard/TrackCard';

// Hooks
import { useFetch } from '../../../shared/hooks/use-fetch.hook';

// Stores
import { useAuthStore } from '../../auth/use-auth.store';
import { useThemeStore } from '../../../shared/stores/use-theme.store';

// Styles
import styles from './Home.module.scss';

// Types
import { TopArtistsGetResponse } from '../../artists/artists.types';
import { Theme } from '../../../shared/types/shared.types';
import { TopTracksGetResponse } from '../../tracks/tracks.types';

// UI
import H2 from '../../../shared/ui/H2/H2';
import H3 from '../../../shared/ui/H3/H3';
import { Icon } from '../../../shared/ui/Icon/Icon';
import Popover from '../../../shared/ui/Popover/Popover';

const Home = () => {
  const { fetchData } = useFetch();
  const { i18n, t } = useTranslation();

  // Auth store state
  const [token] = useAuthStore((state) => [state.token]);

  // Theme store state
  const [theme, setTheme] = useThemeStore((state) => [
    state.theme,
    state.setTheme,
  ]);

  // Component state
  const [anchorPopover1, setAnchorPopover1] = useState<
    HTMLButtonElement | undefined
  >(undefined);
  const [anchorPopover2, setAnchorPopover2] = useState<
    HTMLButtonElement | undefined
  >(undefined);
  const [anchorPopover3, setAnchorPopover3] = useState<
    HTMLButtonElement | undefined
  >(undefined);
  const [topArtists, setTopArtists] = useState<
    TopArtistsGetResponse | undefined
  >(undefined);
  const [topTracks, setTopTracks] = useState<TopTracksGetResponse | undefined>(
    undefined
  );

  // ####### //
  // QUERIES //
  // ####### //

  // Get profile on access token change.
  // eslint-disable-next-line
  const topArtistsQuery = useQuery(
    ['top-artists', token],
    () => fetchData('me/top/artists?limit=20&offset=0&time_range=long_term'),
    {
      refetchOnWindowFocus: false,
      onError: (error: unknown) => {
        console.error('Error on getting top artists:', error);
      },
      onSuccess: (data: TopArtistsGetResponse) => {
        setTopArtists(data);
      },
    }
  );

  // Get profile on access token change.
  // eslint-disable-next-line
  const topTracksQuery = useQuery(
    ['top-tracks', token],
    () => fetchData('me/top/tracks?limit=20&offset=0&time_range=long_term'),
    {
      refetchOnWindowFocus: false,
      onError: (error: unknown) => {
        console.error('Error on getting top tracks:', error);
      },
      onSuccess: (data: TopTracksGetResponse) => {
        setTopTracks(data);
      },
    }
  );

  return (
    <div className={styles['home']}>
      <H2>{t('app.hello')}</H2>
      <H3>{t('app.top_artists')}</H3>
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
        {topArtists?.items.map((artist) => (
          <ArtistCard key={artist.id} artist={artist} />
        ))}
      </div>
      <H3 classes="pt-2 lg:pt-4">{t('app.top_tracks')}</H3>
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
        {topTracks?.items.map((track) => (
          <TrackCard key={track.id} track={track} />
        ))}
      </div>
      <Box className={styles['home-header']} sx={{ borderColor: 'border.app' }}>
        <div className={styles['home-header-text']}>{t('app.hello')}</div>
        <Icon icon={['fas', theme === Theme.Dark ? 'moon' : 'sun']} />
      </Box>
      <div className={styles['home-content']}>
        <Button
          onClick={() =>
            setTheme(theme === Theme.Light ? Theme.Dark : Theme.Light)
          }
        >
          {t('app.theme.toggle')}
        </Button>
        <Button
          onClick={() => {
            i18n.language === 'en-US'
              ? i18n.changeLanguage('de-DE')
              : i18n.changeLanguage('en-US');
          }}
        >
          {i18n.language === 'en-US'
            ? t('app.language.german')
            : t('app.language.english')}
        </Button>
      </div>
      <div className={styles['home-content-popovers']}>
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
      </div>
    </div>
  );
};

export default memo(Home);
