import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

// Hooks
import { useLogout } from '../../hooks/use-logout.hook';

// Stores
import { useAuthStore } from '../../../modules/auth/use-auth.store';

// Styles
import styles from './Nav.module.scss';

const Nav = () => {
  const { logout } = useLogout();
  const navigate = useNavigate();

  // Auth store state
  const [token] = useAuthStore((state) => [state.token]);

  return (
    <div className={styles['nav']}>
      <Button onClick={() => navigate('/')}>Home</Button>
      <Button onClick={() => navigate('/notes')}>Notes</Button>
      {token && <Button onClick={logout}>Logout</Button>}
    </div>
  );
};

export default memo(Nav);
