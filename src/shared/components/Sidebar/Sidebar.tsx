import {
  forwardRef,
  memo,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useLocation } from 'react-router-dom';
import { useMutation } from 'react-query';
import { useTranslation } from 'react-i18next';
import {
  Box,
  CircularProgress,
  Tab,
  Tabs,
  Tooltip,
  useTheme,
} from '@mui/material';
import { IconName, IconPrefix } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import InfiniteScroll from 'react-infinite-scroll-component';

// Hooks
import useFetch from '../../hooks/use-fetch.hook';
import usePlaylist from '../../../modules/playlist/use-playlist.hook';
import useUserHttp from '../../../modules/user/use-user-http.hook';

// Stores
import useAuthStore from '../../../modules/auth/use-auth.store';
import usePlaylistStore from '../../../modules/playlist/use-playlist.store';

// Styles
import styles from './Sidebar.module.scss';

// Types
import { PlaylistsGetParams } from '../../../modules/playlist/playlist.types';
import { SidebarTabType } from '../../types/shared.types';

// UI
import Icon from '../../ui/Icon/Icon';
import Link from '../../ui/Link/Link';

type SidebarItemProps = {
  active?: boolean;
  children: ReactNode;
  classes?: string;
  icon?: [IconPrefix, IconName];
  to: string;
};

const SidebarItem = (props: SidebarItemProps) => {
  return (
    <Box
      className={clsx(styles['sidebar-item'], props.classes && props.classes)}
      sx={{
        a: {
          color: props.active ? 'text.primary' : 'text.secondary',
        },
      }}
    >
      <Link classes={styles['sidebar-item-link']} to={props.to}>
        {props.icon && (
          <div className={styles['sidebar-item-link-icon']}>
            <Icon icon={props.icon} />
          </div>
        )}
        <div className={styles['sidebar-item-link-text']}>{props.children}</div>
      </Link>
    </Box>
  );
};

type TabIconProps = {
  icon: [IconPrefix, IconName];
};

const TabIcon = forwardRef<HTMLDivElement, TabIconProps>((props, ref) => {
  return (
    <div {...props} ref={ref}>
      <Icon icon={props.icon} />
    </div>
  );
});

const Sidebar = () => {
  const { handleError, handleRetry } = useFetch();
  const location = useLocation();
  const { playlistsAddEffect, playlistsGetEffect } = usePlaylist();
  const { playlistsGet } = useUserHttp();
  const theme = useTheme();
  const { t } = useTranslation();

  // Auth store state
  const [token] = useAuthStore((state) => [state.token]);

  // Playlists store state
  const [playlists] = usePlaylistStore((state) => [state.playlists]);

  // Component state
  const [tabActive, setTabActive] = useState<SidebarTabType>(
    SidebarTabType.Playlists
  );

  // ######### //
  // MUTATIONS //
  // ######### //

  // GET Add Playlists mutation
  const playlistsAddMutation = useMutation(
    (params?: PlaylistsGetParams) => playlistsGet(params),
    {
      onError: (error: any) => {
        const errRes = error?.response;
        if (errRes) {
          handleError(errRes.status);
        }
      },
      onSuccess: (data) => {
        try {
          data &&
            playlistsAddEffect({
              items: data.items,
              limit: data.limit,
              offset: data.offset,
              total: data.total,
            });
        } catch (error) {
          console.error('ERROR on adding playlists:', error);
        }
      },
      retry: (failureCount, error: any) => handleRetry(failureCount, error),
    }
  );

  // GET Playlists mutation
  const playlistsGetMutation = useMutation(
    (params?: PlaylistsGetParams) => playlistsGet(params),
    {
      onError: (error: any) => {
        const errRes = error?.response;
        if (errRes) {
          handleError(errRes.status);
        }
      },
      onSuccess: (data) => {
        try {
          data &&
            playlistsGetEffect({
              items: data.items,
              limit: data.limit,
              offset: data.offset,
              total: data.total,
            });
        } catch (error) {
          console.error('ERROR on getting playlists:', error);
        }
      },
      retry: (failureCount, error: any) => handleRetry(failureCount, error),
    }
  );

  // ####### //
  // EFFECTS //
  // ####### //

  useEffect(() => {
    playlistsGetMutation.mutate({
      limit: 25,
      offset: 0,
    });
    // eslint-disable-next-line
  }, [token]);

  // ######### //
  // CALLBACKS //
  // ######### //

  /**
   * Handler to add playlists.
   */
  const onAddPlaylists = useCallback(() => {
    if (playlists.items.length < playlists.total) {
      playlistsAddMutation.mutate({
        limit: 25,
        offset: playlists.offset,
      });
    }
    // eslint-disable-next-line
  }, [playlists]);

  const onTabChange = useCallback(
    (event: React.SyntheticEvent, newValue: SidebarTabType) => {
      setTabActive(newValue);
    },
    []
  );

  return (
    <Box className={styles['sidebar']} sx={{ backgroundColor: 'bg.sidebar' }}>
      <div className={styles['sidebar-nav']}>
        <Box
          className={styles['sidebar-nav-bg']}
          sx={{
            background: `linear-gradient(${theme.palette.bg.sidebar}, rgba(0,0,0,0))`,
          }}
        />
        <div className={styles['sidebar-nav-links']}>
          <SidebarItem
            active={location.pathname === '/' ? true : false}
            classes="mb-4"
            icon={['fas', 'house']}
            to="/"
          >
            {t('app.sidebar.home')}
          </SidebarItem>
          <SidebarItem
            active={location.pathname.includes('search') ? true : false}
            classes="mb-4"
            icon={['fas', 'magnifying-glass']}
            to="/search"
          >
            {t('search.title')}
          </SidebarItem>
          <SidebarItem
            active={location.pathname.includes('library') ? true : false}
            icon={['fas', 'book']}
            to="/library"
          >
            {t('app.sidebar.library')}
          </SidebarItem>
        </div>
        {token && (
          <>
            <Tabs
              aria-label="basic tabs example"
              className={styles['sidebar-nav-tabs']}
              value={tabActive}
              sx={{
                '.MuiTab-root': {
                  padding: 0,
                  width: '50%',
                },
              }}
              onChange={onTabChange}
            >
              <Tab
                label={
                  <Tooltip title={t('collection.title')}>
                    <TabIcon icon={['fas', 'record-vinyl']} />
                  </Tooltip>
                }
                value={SidebarTabType.Collections}
              />
              <Tab
                label={
                  <Tooltip title={t('playlist.title')}>
                    <TabIcon icon={['fas', 'music']} />
                  </Tooltip>
                }
                value={SidebarTabType.Playlists}
              />
            </Tabs>
          </>
        )}
      </div>
      <div className={styles['sidebar-content']} id="content">
        <InfiniteScroll
          className={styles['sidebar-content-scroll']}
          dataLength={playlists.items.length}
          hasMore={!!token}
          loader={null}
          next={onAddPlaylists}
          scrollableTarget="content"
          scrollThreshold={1}
        >
          {token && (
            <>
              {tabActive === SidebarTabType.Collections && (
                <>{t('app.coming_soon')}</>
              )}
              {tabActive === SidebarTabType.Playlists &&
                playlists &&
                playlists.items.length > 0 &&
                playlists.items.map((playlist) => (
                  <SidebarItem
                    key={playlist.id}
                    active={
                      location.pathname.includes(playlist.id) ? true : false
                    }
                    classes={'mb-2'}
                    to={`/playlist/${playlist.id}`}
                  >
                    {playlist.name}
                  </SidebarItem>
                ))}
            </>
          )}
          {playlistsAddMutation.isLoading && <CircularProgress />}
        </InfiniteScroll>
        <div className={styles['sidebar-content-info']}>© 2023 Spotilib</div>
      </div>
    </Box>
  );
};

export default memo(Sidebar);
