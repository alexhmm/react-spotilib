import { memo, ReactNode, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from 'react-query';
import { useTranslation } from 'react-i18next';
import { Box, CircularProgress, Divider, useTheme } from '@mui/material';
import { IconName, IconPrefix } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import InfiniteScroll from 'react-infinite-scroll-component';

// Hooks
import { useFetch } from '../../hooks/use-fetch.hook';
import { usePlaylists } from '../../../modules/playlists/use-playlists.hook';
import { usePlaylistsHttp } from '../../../modules/playlists/use-playlists-http.hook';

// Stores
import { useAuthStore } from '../../../modules/auth/use-auth.store';
import { usePlaylistsStore } from '../../../modules/playlists/use-playlists.store';

// Styles
import styles from './Sidebar.module.scss';

// Types
import { PlaylistsGetParams } from '../../../modules/playlists/playlists.types';

// UI
import { Icon } from '../../ui/Icon/Icon';

type SidebarItemProps = {
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
          color: 'text.primary',
        },
        'a:hover': {
          color: 'primary.main',
        },
      }}
    >
      <Link className={styles['sidebar-item-link']} to={props.to}>
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

const Sidebar = () => {
  const { handleError, handleRetry } = useFetch();
  const { playlistsAddEffect, playlistsGetEffect } = usePlaylists();
  const { playlistsGet } = usePlaylistsHttp();
  const theme = useTheme();
  const { t } = useTranslation();

  // Auth store state
  const [token] = useAuthStore((state) => [state.token]);

  // Playlists store state
  const [playlists] = usePlaylistsStore((state) => [state.playlists]);

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
          <SidebarItem classes="mb-4" icon={['fas', 'house']} to="/">
            {t('app.sidebar.home')}
          </SidebarItem>
          <SidebarItem
            classes="mb-4"
            icon={['fas', 'magnifying-glass']}
            to="/search"
          >
            {t('app.sidebar.search')}
          </SidebarItem>
          <SidebarItem icon={['fas', 'book']} to="/library">
            {t('app.sidebar.library')}
          </SidebarItem>
        </div>
        <Divider
          className={styles['sidebar-nav-divider']}
          sx={{ color: 'border.app' }}
        />
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
              {playlists &&
                playlists.items.length > 0 &&
                playlists.items.map((playlist) => (
                  <SidebarItem
                    key={playlist.id}
                    classes={'mb-2'}
                    to={`/playlists/${playlist.id}`}
                  >
                    {playlist.name}
                  </SidebarItem>
                ))}
            </>
          )}
          {playlistsAddMutation.isLoading && <CircularProgress />}
        </InfiniteScroll>
        <div className={styles['sidebar-content-info']}>© 2022 Spotilib</div>
      </div>
    </Box>
  );
};

export default memo(Sidebar);
