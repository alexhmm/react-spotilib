import { memo, ReactNode, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from 'react-query';
import { Box, Divider, useTheme } from '@mui/material';
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

type SidebarLinkProps = {
  children: ReactNode;
  classes?: string;
  to: string;
};

const SidebarLink = (props: SidebarLinkProps) => {
  return (
    <Box
      className={clsx(styles['sidebar-link'], props.classes && props.classes)}
      sx={{
        a: {
          color: 'text.primary',
        },
        'a:hover': {
          color: 'primary.main',
        },
      }}
    >
      <Link to={props.to}>{props.children}</Link>
    </Box>
  );
};

const Sidebar = () => {
  const { handleError, handleRetry } = useFetch();
  const { playlistsGetEffect } = usePlaylists();
  const { playlistsGet } = usePlaylistsHttp();
  const theme = useTheme();

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
    <div className={styles['sidebar']}>
      <div className={styles['sidebar-nav']}>
        <Box
          className={styles['sidebar-nav-bg']}
          sx={{
            background: `linear-gradient(${theme.palette.background.default}, rgba(0,0,0,0))`,
          }}
        />
        <div className={styles['sidebar-nav-links']}>
          <SidebarLink to="/">Home</SidebarLink>
          <SidebarLink to="/notes">Notes</SidebarLink>
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
                  <SidebarLink
                    key={playlist.id}
                    classes={'mb-2'}
                    to={`/playlists/${playlist.id}`}
                  >
                    {playlist.name}
                  </SidebarLink>
                ))}
            </>
          )}
        </div>
        <div className={styles['sidebar-content-info']}>© 2022 Spotilib</div>
      </div>
    </div>
  );
};

export default memo(Sidebar);
