import { memo, useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from 'react-query';
import { IconName, IconPrefix } from '@fortawesome/free-solid-svg-icons';
import { Box, Button, Divider, Popover, Switch } from '@mui/material';
import clsx from 'clsx';

// Components
import Search from '../Search/Search';

// Hooks
import useAuth from '../../../modules/auth/use-auth.hook';
import useBreakpoints from '../../hooks/use-breakpoints.hook';
import useFetch from '../../hooks/use-fetch.hook';
import useLogout from '../../hooks/use-logout.hook';

// Stores
import useAuthStore from '../../../modules/auth/use-auth.store';
import useSearchStore from '../../../modules/search/use-search.store';
import useSharedStore from '../../stores/use-shared.store';
import useThemeStore from '../../stores/use-theme.store';
import useUserStore from '../../../modules/user/use-user.store';

// Styles
import styles from './Header.module.scss';

// Types
import { Theme } from '../../types/shared.types';
import { UserProfile } from '../../../modules/user/user.types';

// UI
import Icon from '../../ui/Icon/Icon';
import TextButtonOutlined from '../../ui/TextButtonOutlined/TextButtonOutlined';
import LibraryNavigation from '../../../modules/library/components/LibraryNavigation/LibraryNavigation';

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
  const navigate = useNavigate();
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
            alt={t('user.profile.title').toString()}
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
          className={styles['header-menu-popover-content']}
          sx={{ backgroundColor: 'background.paper' }}
        >
          {profile && (
            <>
              <HeaderMenuButtonItem
                icon={['fas', 'user']}
                title={t('user.profile.title')}
                onClick={() => {
                  navigate(`/user/${profile.id}`);
                  setAnchor(null);
                }}
              />
              <HeaderMenuButtonItem
                icon={['fas', 'gear']}
                title={t('app.settings.title')}
                onClick={() => {
                  navigate('/settings');
                  setAnchor(null);
                }}
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
  const location = useLocation();
  const { t } = useTranslation();

  // Refs
  const headerBgRef = useRef<HTMLDivElement>(null);
  const headerTitleRef = useRef<HTMLDivElement>(null);

  // Auth store state
  const [token] = useAuthStore((state) => [state.token]);

  // User store state
  const [profile, setProfile] = useUserStore((state) => [
    state.profile,
    state.setProfile,
  ]);

  // Search store state
  const [search, setSearch] = useSearchStore((state) => [
    state.search,
    state.setSearch,
  ]);

  // Shared store state
  const [headerTitle] = useSharedStore((state) => [state.headerTitle]);

  // ####### //
  // QUERIES //
  // ####### //

  // Get profile on access token change.
  // eslint-disable-next-line
  const profileQuery = useQuery<UserProfile>(
    ['profile', token],
    () => fetchData('me'),
    {
      refetchOnWindowFocus: false,
      onError: (error: unknown) => {
        console.error('Error on getting profile:', error);
      },
      onSuccess: (data) => {
        setProfile(data);
      },
    }
  );

  // ####### //
  // EFFECTS //
  // ####### //

  // Set refs style by scroll position
  useEffect(() => {
    const onScroll = (event: any) => {
      const smallThreshold =
        location.pathname.includes('library') ||
        location.pathname.includes('search');
      const headerBgThreshold = smallThreshold ? 50 : 150;
      const scrollTop = event.target.documentElement.scrollTop;
      if (scrollTop < headerBgThreshold && headerBgRef.current) {
        headerBgRef.current.style.opacity = '0%';
      }
      if (scrollTop >= headerBgThreshold && headerBgRef.current) {
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
  }, [headerBgRef, headerTitle, headerTitleRef, lgDown, location]);

  return (
    <Box
      className={styles['header']}
      sx={{
        backgroundColor: lgDown ? 'background.default' : undefined,
        '.app-link': {
          backgroundColor: lgDown ? undefined : 'bg.sidebar',
        },
      }}
    >
      <Link className={clsx(styles['header-logo'], 'app-link')} to="/">
        Spotilib
      </Link>
      <div className={styles['header-info']}>
        <div className={styles['header-info-actions']}>
          {location.pathname.includes('search') && (
            <Search
              classes={styles['header-info-actions-search']}
              value={search}
              onChange={setSearch}
            />
          )}
          {!lgDown && location.pathname.includes('library') && (
            <LibraryNavigation />
          )}
          <div
            className={styles['header-info-actions-title']}
            ref={headerTitleRef}
          >
            {headerTitle ?? ''}
          </div>
        </div>
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
