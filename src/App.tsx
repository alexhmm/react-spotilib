import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import {
  CssBaseline,
  StyledEngineProvider,
  ThemeProvider,
} from '@mui/material';

// Components
import Nav from './shared/components/Nav/Nav';

// Hooks
import { useTheme } from './shared/hooks/use-theme.hook';

// Router
import { AppRouter } from './shared/router/AppRouter';

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
            <Nav />
            <AppRouter />
          </BrowserRouter>
        </ThemeProvider>
      </StyledEngineProvider>
    </QueryClientProvider>
  );
}

export default App;
