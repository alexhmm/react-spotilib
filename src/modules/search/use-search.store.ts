import create from 'zustand';

// Types
import { SearchData } from './search.types';

// Models
export interface SearchState {
  search: string | undefined;
  searchData: SearchData | undefined;
  searchLoading: boolean;
  resetState: () => void;
  setSearch: (search: string | undefined) => void;
  setSearchData: (searchData: SearchData | undefined) => void;
  setSearchLoading: (searchLoading: boolean) => void;
}

const initialSearchState = {
  search: undefined,
  searchData: undefined,
  searchLoading: false,
};

const useSearchStore = create<SearchState>((set) => ({
  ...initialSearchState,
  resetState: () => {
    set(initialSearchState);
  },
  setSearch: (search: string | undefined) => {
    set({ search });
  },
  setSearchData: (searchData: SearchData | undefined) => {
    set({ searchData });
  },
  setSearchLoading: (searchLoading: boolean) => {
    set({ searchLoading });
  },
}));

export default useSearchStore;
