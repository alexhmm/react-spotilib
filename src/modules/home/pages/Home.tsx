import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Button } from '@mui/material';

// Stores
import { useThemeStore } from '../../../shared/stores/use-theme.store';

// Styles
import styles from './Home.module.scss';

// Types
import { Theme } from '../../../shared/types/shared.types';

// UI
import { Icon } from '../../../shared/ui/Icon/Icon';

const Home = () => {
  const { i18n, t } = useTranslation();

  // Theme store state
  const [theme, setTheme] = useThemeStore((state) => [
    state.theme,
    state.setTheme,
  ]);

  return (
    <div className={styles['home']}>
      <Box className={styles['home-header']} sx={{ borderColor: 'border.app' }}>
        <div className={styles['home-header-text']}>{t('app.hello')}</div>
        <Icon icon={['fas', theme === Theme.Dark ? 'moon' : 'sun']} />
      </Box>
      <div className={styles['home-content']}>
        <Button
          onClick={() =>
            setTheme(theme === Theme.Light ? Theme.Dark : Theme.Light)
          }
        >
          {t('app.theme.toggle')}
        </Button>
        <Button
          onClick={() => {
            i18n.language === 'en'
              ? i18n.changeLanguage('de')
              : i18n.changeLanguage('en');
          }}
        >
          {i18n.language === 'en'
            ? t('app.language.german')
            : t('app.language.english')}
        </Button>
      </div>
    </div>
  );
};

export default memo(Home);
