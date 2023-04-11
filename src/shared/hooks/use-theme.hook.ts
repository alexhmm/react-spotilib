import { createTheme, Theme } from '@mui/material/styles';

// Stores
import useThemeStore from '../stores/use-theme.store';

// Types
import { Theme as ETheme } from '../types/shared.types';

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    '2xl': true;
    '3xl': true;
    '4xl': true;
    '5xl': true;
  }

  interface Palette {
    bg: {
      card: string;
      form: string;
      sidebar: string;
    };
  }

  interface PaletteOptions {
    bg: {
      card: string;
      form: string;
      sidebar: string;
    };
    border: {
      app: string;
      card: string;
    };
    // orange: {
    //   light: string;
    //   main: string;
    // };
  }

  interface PaletteColor {
    card?: string;
    form?: string;
    sidebar?: string;
  }

  interface SimplePaletteColorOptions {
    card?: string;
    form?: string;
    sidebar?: string;
  }

  interface Theme {
    bg: {
      card: React.CSSProperties['color'];
      form: React.CSSProperties['color'];
      sidebar: React.CSSProperties['color'];
    };
  }

  interface ThemeOptions {
    bg: {
      card: React.CSSProperties['color'];
      form: React.CSSProperties['color'];
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
    '5xl': 3840,
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
    card: '#232323',
    form: '#3c3c3c',
    sidebar: '#0e0e0e',
  },
  palette: {
    background: {
      default: '#171717',
      paper: '#202020',
    },
    bg: {
      card: '#232323',
      form: '#3c3c3c',
      sidebar: '#0e0e0e',
    },
    border: {
      app: '#3a3a3a',
      card: '#8a8a8a',
    },
    mode: 'dark',
    // orange,
    primary: primary,
    text: {
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
    // success,
  },
  typography,
});

export const themeLight = createTheme({
  breakpoints,
  bg: {
    card: '#f3f6f9',
    form: '#eaeaea',
    sidebar: '#f2f3f5',
  },
  palette: {
    action: {
      hover: 'rgba(0, 0, 0, 0.08)',
      selected: 'rgba(0, 0, 0, 0.16)',
    },
    background: {
      default: '#fcfcfc',
      paper: '#f2f2f2',
    },
    bg: {
      card: '#f3f6f9',
      form: '#eaeaea',
      sidebar: '#f2f3f5',
    },
    border: {
      app: '#eaeaea',
      card: '#9a9a9a',
    },
    mode: 'light',
    // orange,
    primary: primary,
    text: {
      secondary: 'rgba(0, 0, 0, 0.75)',
    },
    // success,
    // text: {
    //   primary: '#444d58',
    //   secondary: '#8ea3b6',
    // },
  },
  typography,
});

const useTheme = () => {
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

export default useTheme;
