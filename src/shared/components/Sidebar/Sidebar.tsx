import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Box, Divider, useTheme } from '@mui/material';

// Stores
import { useAuthStore } from '../../../modules/auth/use-auth.store';

// Styles
import styles from './Sidebar.module.scss';

type SidebarLinkProps = {
  title: string;
  to: string;
};

const SidebarLink = (props: SidebarLinkProps) => {
  return (
    <Box
      sx={{
        a: {
          color: 'text.primary',
        },
        'a:hover': {
          color: 'primary.main',
        },
      }}
    >
      <Link className={styles['sidebar-link']} to={props.to}>
        {props.title}
      </Link>
    </Box>
  );
};

const Sidebar = () => {
  const theme = useTheme();

  // Auth store state
  const [token] = useAuthStore((state) => [state.token]);

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
          <SidebarLink title="Home" to="/" />
          <SidebarLink title="Notes" to="/notes" />
        </div>
        <Divider
          className={styles['sidebar-nav-divider']}
          sx={{ color: 'border.app' }}
        />
      </div>
      <div className={styles['sidebar-content']}>
        <div className={styles['sidebar-content-playlists']}>
          <div>Sidebar</div>
          <div>Sidebar</div>
          <div>Sidebar</div>
          <div>Sidebar</div>
          <div>Sidebar</div>
          <div>Sidebar</div>
          <div>Sidebar</div>
          <div>Sidebar</div>
          <div>Sidebar</div>
          <div>Sidebar</div>
          <div>Sidebar</div>
          <div>Sidebar</div>
          <div>Sidebar</div>
          <div>Sidebar</div>
          <div>Sidebar</div>
          <div>Sidebar</div>
          <div>Sidebar</div>
          <div>Sidebar</div>
          <div>Sidebar</div>
          <div>Sidebar</div>
          <div>Sidebar</div>
          <div>Sidebar</div>
          <div>Sidebar</div>
          <div>Sidebar</div>
          <div>Sidebar</div>
          <div>Sidebar</div>
          <div>Sidebar</div>
          <div>Sidebar</div>
          <div>Sidebar</div>
          <div>Sidebar</div>
          <div>Sidebar</div>
          <div>Sidebar</div>
          <div>Sidebar</div>
          <div>Sidebar</div>
          {token && (
            <>
              {/* {playlists &&
            playlists.items.length > 0 &&
            playlists.items.map((playlist) => (
              <Link
                key={playlist.id}
                className={styles['sidebar-content-playlists-item']}
                href={`/playlists/${playlist.id}`}
              >
                {playlist.name}
              </Link>
            ))} */}
            </>
          )}
        </div>
        <div className={styles['sidebar-content-info']}>© 2022 Spotilib</div>
      </div>
    </div>
  );
};

export default memo(Sidebar);
