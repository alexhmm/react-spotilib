import { memo, ReactNode, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from 'react-query';
import { useTranslation } from 'react-i18next';
import { Box, Divider, useTheme } from '@mui/material';
import { IconName, IconPrefix } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';

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
  const { playlistsGetEffect } = usePlaylists();
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

  // GET Playlists mutation
  const playlistsGetMutation = useMutation(
    (params?: PlaylistsGetParams) => playlistsGet(params),
    {
      retry: (failureCount, error: any) => handleRetry(failureCount, error),
    }
  );

  // Set playlists data on mount
  useEffect(() => {
    if (playlistsGetMutation.data) {
      try {
        playlistsGetEffect({
          items: playlistsGetMutation.data.items,
          limit: playlistsGetMutation.data.limit,
          offset: playlistsGetMutation.data.offset,
          total: playlistsGetMutation.data.total,
        });
      } catch (error) {
        console.error('ERROR on getting playlists:', error);
      }
    }
    if (playlistsGetMutation.error) {
      const errRes = playlistsGetMutation.error?.response;
      if (errRes) {
        handleError(errRes.status);
      }
    }
    // eslint-disable-next-line
  }, [playlistsGetMutation.data, playlistsGetMutation.error]);

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
      <div className={styles['sidebar-content']}>
        <div className={styles['sidebar-content-playlists']}>
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
        </div>
        <div className={styles['sidebar-content-info']}>© 2022 Spotilib</div>
      </div>
    </Box>
  );
};

export default memo(Sidebar);
