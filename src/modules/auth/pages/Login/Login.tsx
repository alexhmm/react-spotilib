import { useTranslation } from 'react-i18next';

// Hooks
import { useAuth } from '../../use-auth.hook';

// Styles
import styles from './Login.module.scss';

// UI
import H2 from '../../../../shared/ui/H2/H2';
import TextButtonOutlined from '../../../../shared/ui/TextButtonOutlined/TextButtonOutlined';

const Login = () => {
  const { authorize } = useAuth();
  const { t } = useTranslation();

  return (
    <div className={styles['login']}>
      <H2>{t('auth.login.title')}</H2>
      <div className={styles['login-text']}>{t('auth.login.text')}</div>
      <TextButtonOutlined classes="w-fit" onClick={authorize}>
        {t('auth.login.title')}
      </TextButtonOutlined>
    </div>
  );
};

export default Login;
