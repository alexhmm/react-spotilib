import { memo, useState } from 'react';
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
import Popover from '../../../shared/ui/Popover/Popover';

const Home = () => {
  const { i18n, t } = useTranslation();

  // Component state
  const [anchorPopover1, setAnchorPopover1] = useState<
    HTMLButtonElement | undefined
  >(undefined);
  const [anchorPopover2, setAnchorPopover2] = useState<
    HTMLButtonElement | undefined
  >(undefined);
  const [anchorPopover3, setAnchorPopover3] = useState<
    HTMLButtonElement | undefined
  >(undefined);

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
            i18n.language === 'en-US'
              ? i18n.changeLanguage('de-DE')
              : i18n.changeLanguage('en-US');
          }}
        >
          {i18n.language === 'en-US'
            ? t('app.language.german')
            : t('app.language.english')}
        </Button>
      </div>
      <div className={styles['home-content-popovers']}>
        <Popover
          anchor={anchorPopover1}
          anchorOrigin={{
            horizontal: 'left',
            vertical: 'bottom',
          }}
          buttonClasses="mr-4"
          buttonTitle="Origin Left"
          transformOrigin={{
            horizontal: 'left',
            vertical: 'top',
          }}
          onClose={() => setAnchorPopover1(undefined)}
          onOpen={(anchor) => setAnchorPopover1(anchor)}
        >
          <div>Left Left Left Left 1</div>
          <div>Left Left Left Left 2</div>
          <div>Left Left Left Left 3</div>
          <div>Left Left Left Left 4</div>
        </Popover>
        <Popover
          anchor={anchorPopover2}
          buttonClasses="mr-4"
          buttonTitle="Simple Popover"
          onClose={() => setAnchorPopover2(undefined)}
          onOpen={(anchor) => setAnchorPopover2(anchor)}
        >
          <div>Test Test Test 1</div>
          <div>Test Test Test 2</div>
          <div>Test Test Test 3</div>
          <div>Test Test Test 4</div>
        </Popover>
        <Popover
          anchor={anchorPopover3}
          buttonTitle="Custom Icon"
          icon={['fas', 'sun']}
          onClose={() => setAnchorPopover3(undefined)}
          onOpen={(anchor) => setAnchorPopover3(anchor)}
        >
          <div>Custom Icon Custom Icon 1</div>
          <div>Custom Icon Custom Icon 2</div>
          <div>Custom Icon Custom Icon 3</div>
          <div>Custom Icon Custom Icon 4</div>
        </Popover>
      </div>
      <div>Content</div>
      <div>Content</div>
      <div>Content</div>
      <div>Content</div>
      <div>Content</div>
      <div>Content</div>
      <div>Content</div>
      <div>Content</div>
      <div>Content</div>
      <div>Content</div>
      <div>Content</div>
      <div>Content</div>
      <div>Content</div>
      <div>Content</div>
      <div>Content</div>
      <div>Content</div>
      <div>Content</div>
      <div>Content</div>
      <div>Content</div>
      <div>Content</div>
      <div>Content</div>
      <div>Content</div>
      <div>Content</div>
      <div>Content</div>
      <div>Content</div>
      <div>Content</div>
      <div>Content</div>
      <div>Content</div>
      <div>Content</div>
      <div>Content</div>
      <div>Content</div>
      <div>Content</div>
      <div>Content</div>
      <div>Content</div>
      <div>Content</div>
    </div>
  );
};

export default memo(Home);
