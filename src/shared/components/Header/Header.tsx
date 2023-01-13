import { memo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { Box, Button } from '@mui/material';

// Hooks
import { useBreakpoints } from '../../hooks/use-breakpoints.hook';
import { useFetch } from '../../hooks/use-fetch.hook';
import { useLogout } from '../../hooks/use-logout.hook';

// Stores
import { useAuthStore } from '../../../modules/auth/use-auth.store';
import { useSharedStore } from '../../stores/use-shared.store';
import { useThemeStore } from '../../stores/use-theme.store';
import { useUserStore } from '../../../modules/user/use-user.store';

// Styles
import styles from './Header.module.scss';

// Types
import { Theme } from '../../types/shared.types';

const Header = () => {
  const { lgDown } = useBreakpoints();
  const { fetchData } = useFetch();
  const { logout } = useLogout();
  const { i18n, t } = useTranslation();

  // Refs
  const headerBgRef = useRef<HTMLElement>(null);
  const headerTitleRef = useRef<HTMLElement>(null);

  // User store state
  const [profile, setProfile] = useUserStore((state) => [
    state.profile,
    state.setProfile,
  ]);

  // Auth store state
  const [token] = useAuthStore((state) => [state.token]);

  // Shared store state
  const [headerTitle] = useSharedStore((state) => [state.headerTitle]);

  // Theme store state
  const [theme, setTheme] = useThemeStore((state) => [
    state.theme,
    state.setTheme,
  ]);

  // ####### //
  // QUERIES //
  // ####### //

  // Get profile on access token change.
  // eslint-disable-next-line
  const profileQuery = useQuery(['profile', token], () => fetchData('me'), {
    refetchOnWindowFocus: false,
    onError: (error: unknown) => {
      console.error('Error on getting profile:', error);
    },
    onSuccess: (data) => {
      setProfile(data);
    },
  });

  // ####### //
  // EFFECTS //
  // ####### //

  // Set refs style by scroll position
  useEffect(() => {
    const onScroll = (event: any) => {
      const scrollTop = event.target.documentElement.scrollTop;
      if (scrollTop < 150 && headerBgRef.current) {
        headerBgRef.current.style.opacity = '0%';
      }
      if (scrollTop >= 150 && headerBgRef.current) {
        headerBgRef.current.style.opacity = '100%';
      }
      if (scrollTop < 250 && headerTitleRef.current) {
        headerTitleRef.current.style.opacity = '0%';
        headerTitleRef.current.style.visibility = 'hidden';
      }
      if (scrollTop >= 250 && headerTitleRef.current) {
        headerTitleRef.current.style.visibility = 'visible';
        headerTitleRef.current.style.opacity = '100%';
      }
    };
    !lgDown && window.addEventListener('scroll', onScroll);

    // Set initial refs style
    if (headerBgRef.current) {
      headerBgRef.current.style.opacity = '0%';
    }
    if (headerTitleRef.current) {
      headerTitleRef.current.style.opacity = '0%';
      headerTitleRef.current.style.visibility = 'hidden';
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [headerBgRef, headerTitle, headerTitleRef, lgDown]);

  return (
    <Box
      className={styles['header']}
      sx={{ backgroundColor: lgDown ? 'background.default' : undefined }}
    >
      <Box
        className={styles['header-logo']}
        sx={{ backgroundColor: lgDown ? undefined : 'bg.sidebar' }}
      >
        Spotilib
      </Box>
      <div className={styles['header-info']}>
        <Box className={styles['header-info-title']} ref={headerTitleRef}>
          {headerTitle ?? ''}
        </Box>
        <div className={styles['header-info-content']}>
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
          {profile?.display_name && (
            <Button onClick={logout}>{profile?.display_name}</Button>
          )}
        </div>
        <Box
          className={styles['header-info-bg']}
          ref={headerBgRef}
          sx={{
            backgroundColor: lgDown ? undefined : 'bg.sidebar',
          }}
        ></Box>
      </div>
    </Box>
  );
};

export default memo(Header);
