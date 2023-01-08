import { createTheme, Theme } from '@mui/material/styles';

// Stores
import { useThemeStore } from '../stores/use-theme.store';

// Types
import { Theme as ETheme } from '../types/shared.types';

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    '2xl': true;
    '3xl': true;
    '4xl': true;
  }

  interface Palette {
    bg: {
      sidebar: string;
    };
  }

  interface PaletteOptions {
    bg: {
      sidebar: string;
    };
    border: {
      app: string;
    };
    // orange: {
    //   light: string;
    //   main: string;
    // };
  }

  interface PaletteColor {
    sidebar?: string;
  }

  interface SimplePaletteColorOptions {
    sidebar?: string;
  }

  interface Theme {
    bg: {
      sidebar: React.CSSProperties['color'];
    };
  }

  interface ThemeOptions {
    bg: {
      sidebar: React.CSSProperties['color'];
    };
  }
}

const breakpoints = {
  values: {
    xs: 0,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
    '3xl': 1920,
    '4xl': 2560,
  },
};

const primary = {
  dark: '#0ABE33',
  light: '#62E390',
  main: '#1ED760',
};

// const success = {
//   light: '#48d55e26',
//   main: '#48d55e',
// };

const typography = {
  fontFamily: "'Montserrat', 'sans-serif'",
};

export const themeDark = createTheme({
  breakpoints,
  bg: {
    sidebar: '#0e0e0e',
  },
  palette: {
    background: {
      default: '#171717',
      paper: '#202020',
    },
    bg: {
      sidebar: '#0e0e0e',
    },
    border: {
      app: '#3a3a3a',
    },
    mode: 'dark',
    // orange,
    primary: primary,
    // success,
  },
  typography,
});

export const themeLight = createTheme({
  breakpoints,
  bg: {
    sidebar: '#fafafa',
  },
  palette: {
    background: {
      default: '#fcfcfc',
    },
    bg: {
      sidebar: '#fafafa',
    },
    border: {
      app: '#eaeaea',
    },
    mode: 'light',
    // orange,
    primary: primary,
    // success,
    // text: {
    //   primary: '#444d58',
    //   secondary: '#8ea3b6',
    // },
  },
  typography,
});

export const useTheme = () => {
  // Theme store state
  const [theme] = useThemeStore((state) => [state.theme]);

  /**
   * Returns active mui theme.
   * @returns Active MUI theme
   */
  const activeThemeGet = (): Theme => {
    switch (theme) {
      case ETheme.Dark:
        return themeDark;
      default:
        return themeLight;
    }
  };

  return {
    activeThemeGet,
  };
};
