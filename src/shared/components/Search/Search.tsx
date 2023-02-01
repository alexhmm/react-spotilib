import { memo, useEffect } from 'react';
import { useMutation } from 'react-query';
import { InputAdornment, OutlinedInput } from '@mui/material';
import clsx from 'clsx';

// Hooks
import useDebouncedEffect from '../../hooks/use-debounced-effect.hook';
import useFetch from '../../hooks/use-fetch.hook';
import useSearchHttp from '../../../modules/search/use-search-http.hook';

// Stores
import useSearchStore from '../../../modules/search/use-search.store';

// Styles
import styles from './Search.module.scss';

// Types
import { SearchGetParams } from '../../../modules/search/search.types';
import { SpotifyItemType } from '../../types/spotify.types';

// UI
import Icon from '../../ui/Icon/Icon';
import IconButton from '../../ui/IconButton/IconButton';

// Utils
import { searchDataCreate } from '../../../modules/search/search.utils';

type SearchProps = {
  classes?: string;
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
};

const Search = (props: SearchProps) => {
  const { handleError, handleRetry } = useFetch();
  const { searchGet } = useSearchHttp();

  // Search store state
  const [setSearch, setSearchData, setSearchLoading] = useSearchStore(
    (state) => [state.setSearch, state.setSearchData, state.setSearchLoading]
  );

  // ######### //
  // MUTATIONS //
  // ######### //

  // GET Search mutation
  const searchGetMutation = useMutation(
    (params: SearchGetParams) => searchGet(params),
    {
      onError: (error: any) => {
        setSearchLoading(false);
        const errRes = error?.response;
        if (errRes) {
          handleError(errRes.status);
        }
      },
      onMutate: () => {
        setSearchData(undefined);
        setSearchLoading(true);
      },
      onSuccess: (data) => {
        setSearchLoading(false);
        data && setSearchData(searchDataCreate(data));
      },
      retry: (failureCount, error: any) => handleRetry(failureCount, error),
    }
  );

  // ####### //
  // EFFECTS //
  // ####### //

  // Reset search state on component unmount.
  useEffect(() => {
    return () => {
      setSearchData(undefined);
      setSearch(undefined);
    };
    // eslint-disable-next-line
  }, []);

  // Search after debounced input.
  useDebouncedEffect(
    () => {
      if (props.value && props.value.length > 2) {
        searchGetMutation.mutate({
          q: props.value,
          type: [
            SpotifyItemType.Album,
            SpotifyItemType.Artist,
            SpotifyItemType.Playlist,
            SpotifyItemType.Track,
          ],
        });
      } else {
        setSearchData(undefined);
      }
    },
    [props.value],
    500
  );

  return (
    <OutlinedInput
      autoFocus
      classes={{
        root: clsx(styles['search'], props.classes && props.classes),
        input: styles['search-input'],
        notchedOutline: styles['search-outline'],
      }}
      disabled={props.disabled}
      placeholder="Search"
      size="small"
      startAdornment={
        <InputAdornment
          className={styles['search-adornment-start']}
          position="start"
        >
          <Icon icon={['fas', 'search']} sx={{ color: 'text.secondary' }} />
        </InputAdornment>
      }
      endAdornment={
        props.value &&
        props.value.length > 0 && (
          <InputAdornment
            className={styles['search-adornment-end']}
            position="end"
          >
            <IconButton
              icon={['fas', 'times']}
              padding="0.25rem 0.5rem"
              onClick={() => props.onChange && props.onChange('')}
            />
          </InputAdornment>
        )
      }
      sx={{
        backgroundColor: 'background.paper',
        '& input::placeholder': { color: 'text.secondary' },
        '& .MuiSvgIcon-root': {
          width: '0.85rem',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderWidth: '0px',
        },
      }}
      value={props.value}
      onChange={(event) => {
        props.onChange && props.onChange(event.target.value);
      }}
    />
  );
};

export default memo(Search);
