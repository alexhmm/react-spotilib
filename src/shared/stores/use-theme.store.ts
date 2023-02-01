import create from 'zustand';

// Models
import { Theme } from '../types/shared.types';

// Models
export interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const useThemeStore = create<ThemeState>((set) => ({
  theme: (localStorage.getItem('app:theme') as Theme) || Theme.Light,
  setTheme: (theme: Theme) => {
    set({ theme });
    document.documentElement.setAttribute('class', theme);
    localStorage.setItem('app:theme', theme);
  },
}));

export default useThemeStore;
