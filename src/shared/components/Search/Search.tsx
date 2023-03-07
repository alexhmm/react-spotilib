import { memo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { InputAdornment, OutlinedInput } from '@mui/material';
import clsx from 'clsx';

// Hooks
import useDebouncedEffect from '../../hooks/use-debounced-effect.hook';

// Stores
import useSearchStore from '../../../modules/search/use-search.store';

// Styles
import styles from './Search.module.scss';

// UI
import Icon from '../../ui/Icon/Icon';
import IconButton from '../../ui/IconButton/IconButton';

type SearchProps = {
  classes?: string;
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
};

const Search = (props: SearchProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Search store state
  const [setSearch, setSearchData] = useSearchStore((state) => [
    state.setSearch,
    state.setSearchData,
  ]);

  // Navigate to search result page after debounced input
  useDebouncedEffect(
    () => {
      setSearchData(undefined);
      if (props.value && props.value.length > 0) {
        navigate(`/search/${props.value}`);
      } else {
        navigate('/search');
      }
    },
    [props.value],
    500
  );

  // Reset search string on component unmount
  useEffect(() => {
    return () => {
      setSearch(undefined);
    };
    // eslint-disable-next-line
  }, []);

  return (
    <OutlinedInput
      autoFocus
      classes={{
        root: clsx(styles['search'], props.classes && props.classes),
        input: styles['search-input'],
        notchedOutline: styles['search-outline'],
      }}
      disabled={props.disabled}
      placeholder={t('search.title').toString()}
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
