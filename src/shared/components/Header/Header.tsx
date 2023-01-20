import { memo, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { IconName, IconPrefix } from '@fortawesome/free-solid-svg-icons';
import { Box, Button, Divider, Popover, Switch } from '@mui/material';
import clsx from 'clsx';

// Hooks
import { useAuth } from '../../../modules/auth/use-auth.hook';
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

// UI
import { Icon } from '../../ui/Icon/Icon';
import TextButtonOutlined from '../../ui/TextButtonOutlined/TextButtonOutlined';

type HeaderMenuButtonItemProps = {
  classes?: string;
  icon: [IconPrefix, IconName];
  title: string;
  onClick: () => void;
};

const HeaderMenuButtonItem = (props: HeaderMenuButtonItemProps) => {
  return (
    <Button
      className={clsx(
        styles['header-menu-button-item'],
        props.classes && props.classes
      )}
      color="inherit"
      onClick={props.onClick}
    >
      <div className={styles['header-menu-button-item-icon']}>
        <Icon icon={props.icon} />
      </div>
      <div className={styles['header-menu-button-item-text']}>
        {props.title}
      </div>
    </Button>
  );
};

type HeaderMenuSwitchItemProps = {
  classes?: string;
  checked: boolean;
  icon: [IconPrefix, IconName];
  title: string;
  onChange: (checked: boolean) => void;
};

const HeaderMenuSwitchItem = (props: HeaderMenuSwitchItemProps) => {
  return (
    <Button
      className={clsx(
        styles['header-menu-switch-item'],
        props.classes && props.classes
      )}
      color="inherit"
      onClick={() => props.onChange(!props.checked)}
    >
      <div className={styles['header-menu-switch-item-icon']}>
        <Icon icon={props.icon} />
      </div>
      <div className={styles['header-menu-switch-item-content']}>
        <div className={styles['header-menu-switch-item-text']}>
          {props.title}
        </div>
        <Switch checked={props.checked} />
      </div>
    </Button>
  );
};

const HeaderMenu = () => {
  const { smDown } = useBreakpoints();
  const { logout } = useLogout();
  const { t } = useTranslation();

  // Theme store state
  const [theme, setTheme] = useThemeStore((state) => [
    state.theme,
    state.setTheme,
  ]);

  // User store state
  const [profile] = useUserStore((state) => [state.profile]);

  // Component state
  const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);

  return (
    <>
      <Button
        className={styles['header-menu-button']}
        color="inherit"
        disableElevation
        onClick={(event) => setAnchor(event.currentTarget)}
      >
        {profile?.images[0]?.url && (
          <img
            alt={t('app.profile').toString()}
            className={styles['header-menu-button-image']}
            src={profile?.images[0].url}
          />
        )}
        {!smDown && (
          <>
            <div className={styles['header-menu-button-name']}>
              {profile?.display_name}
            </div>
            <Icon
              classes={clsx(
                styles['header-menu-button-icon'],
                anchor && styles['header-menu-button-icon-rotate']
              )}
              icon={['fas', 'chevron-down']}
            />
          </>
        )}
      </Button>
      <Popover
        anchorEl={anchor}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        classes={{
          paper: styles['header-menu-popover-paper'],
          root: styles['header-menu-popover'],
        }}
        open={Boolean(anchor)}
        transformOrigin={{
          horizontal: 'right',
          vertical: 'top',
        }}
        onClose={() => setAnchor(null)}
      >
        <Box
          className={clsx(
            styles['header-menu-popover-content'],
            theme === Theme.Dark && 'border border-solid'
          )}
          sx={{
            backgroundColor: 'background.default',
            borderColor: theme === Theme.Dark ? 'border.app' : undefined,
          }}
        >
          {profile && (
            <>
              <HeaderMenuButtonItem
                icon={['fas', 'user']}
                title={t('app.profile')}
                onClick={() => console.log('profile')}
              />
              <HeaderMenuButtonItem
                icon={['fas', 'gear']}
                title={t('app.settings')}
                onClick={() => console.log('settings')}
              />
              <HeaderMenuSwitchItem
                checked={theme === Theme.Dark ? true : false}
                classes="mb-1"
                icon={['fas', 'paint-brush']}
                title="Dunkles Design"
                onChange={(checked) =>
                  setTheme(checked ? Theme.Dark : Theme.Light)
                }
              />
              <Divider />
              <HeaderMenuButtonItem
                classes="mt-1"
                icon={['fas', 'right-from-bracket']}
                title={t('app.logout')}
                onClick={logout}
              />
            </>
          )}
        </Box>
      </Popover>
    </>
  );
};

const Header = () => {
  const { authorize } = useAuth();
  const { lgDown } = useBreakpoints();
  const { fetchData } = useFetch();
  const { t } = useTranslation();

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
          {/*
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
          )} */}
          {profile ? (
            <HeaderMenu />
          ) : (
            <TextButtonOutlined classes="w-fit" onClick={authorize}>
              {t('auth.login.title_short')}
            </TextButtonOutlined>
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
