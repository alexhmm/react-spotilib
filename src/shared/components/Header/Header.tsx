import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { Box, Button } from '@mui/material';

// Hooks
import { useFetch } from '../../hooks/use-fetch.hook';
import { useLogout } from '../../hooks/use-logout.hook';

// Stores
import { useAuthStore } from '../../../modules/auth/use-auth.store';
import { useThemeStore } from '../../stores/use-theme.store';

// Stores
import { useUserStore } from '../../../modules/user/use-user.store';

// Styles
import styles from './Header.module.scss';

// Types
import { Theme } from '../../types/shared.types';

const Header = () => {
  const { fetchData } = useFetch();
  const { logout } = useLogout();
  const { i18n, t } = useTranslation();

  // User store state
  const [profile, setProfile] = useUserStore((state) => [
    state.profile,
    state.setProfile,
  ]);

  // Auth store state
  const [token] = useAuthStore((state) => [state.token]);

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

  return (
    <Box
      className={styles['header']}
      sx={{ backgroundColor: 'background.default' }}
    >
      <Box className={styles['header-logo']}>Spotilib</Box>
      <div className={styles['header-info']}>
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
    </Box>
  );
};

export default memo(Header);
