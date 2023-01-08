import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import {
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
} from '@mui/material';

// Components
import Header from './shared/components/Header/Header';
import Sidebar from './shared/components/Sidebar/Sidebar';

// Hooks
import { useTheme } from './shared/hooks/use-theme.hook';

// Router
import { AppRouter } from './shared/router/AppRouter';

// Styles
import styles from './App.module.scss';

// Utils
import './shared/utils/i18n';
import './shared/utils/fa';

function App() {
  const queryClient = new QueryClient();
  const { activeThemeGet } = useTheme();

  return (
    <QueryClientProvider client={queryClient}>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={activeThemeGet()}>
          <CssBaseline />
          <BrowserRouter>
            <div className={styles['app']}>
              <Header />
              <div className={styles['app-main']}>
                <Sidebar />
                <div className={styles['app-main-content']}>
                  <AppRouter />
                </div>
              </div>
            </div>
          </BrowserRouter>
        </ThemeProvider>
      </StyledEngineProvider>
    </QueryClientProvider>
  );
}

export default App;
