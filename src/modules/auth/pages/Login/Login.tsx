import { Button } from '@mui/material';

// Hooks
import { useAuth } from '../../use-auth.hook';

// Styles
import styles from './Login.module.scss';

const Login = () => {
  const { authorize } = useAuth();

  return (
    <div className={styles['login']}>
      <Button onClick={authorize}>Login</Button>
    </div>
  );
};

export default Login;
