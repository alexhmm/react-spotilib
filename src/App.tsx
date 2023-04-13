import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import {
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
} from '@mui/material';
import clsx from 'clsx';

// Components
import Header from './shared/components/Header/Header';
import LibraryNavigation from './modules/library/components/LibraryNavigation/LibraryNavigation';
import Sidebar from './shared/components/Sidebar/Sidebar';
import Snackbar from './shared/ui/Snackbar/Snackbar';
import Tabs from './shared/components/Tabs/Tabs';

// Hooks
import useBreakpoints from './shared/hooks/use-breakpoints.hook';
import useTheme from './shared/hooks/use-theme.hook';

// Router
import AppRouter from './shared/router/AppRouter';
import ScrollToTop from './shared/router/ScrollToTop';

// Stores
import useSharedStore from './shared/stores/use-shared.store';

// Styles
import styles from './App.module.scss';
import './shared/styles/styles.scss';

// Utils
import './shared/utils/i18n';
import './shared/utils/fa';

function App() {
  const { lgDown } = useBreakpoints();
  const queryClient = new QueryClient();
  const { activeThemeGet } = useTheme();

  // Shared store state
  // Error: react-router useLocation() may be used only in the context of a <Router> component.
  const [pathname] = useSharedStore((state) => [state.pathname]);

  return (
    <QueryClientProvider client={queryClient}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={activeThemeGet()}>
          <CssBaseline />
          <BrowserRouter>
            <ScrollToTop />
            <div className={styles['app']}>
              <Header />
              {lgDown && pathname?.includes('library') && <LibraryNavigation />}
              <div className={styles['app-main']}>
                <Sidebar />
                <div
                  className={clsx(styles['app-main-content'], 'mb-16 lg:mb-0')}
                >
                  <AppRouter />
                </div>
              </div>
              <Tabs />
            </div>
            <Snackbar />
          </BrowserRouter>
        </ThemeProvider>
      </StyledEngineProvider>
    </QueryClientProvider>
  );
}

export default App;
