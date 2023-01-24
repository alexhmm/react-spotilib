import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    '2xl': true;
    '3xl': true;
    '4xl': true;
    '5xl': true;
  }
}

/**
 * Custom hook to get current used breakpoint.
 * @returns Theme breakpoints with current usage status
 */
export const useBreakpoints = () => {
  const theme = useTheme();
  const xs = useMediaQuery(theme.breakpoints.between('xs', 'md'));
  const xsUp = useMediaQuery(theme.breakpoints.up('xs'));
  const sm = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
  const smDown = useMediaQuery(theme.breakpoints.down('sm'));
  const smUp = useMediaQuery(theme.breakpoints.up('sm'));
  const md = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const mdDown = useMediaQuery(theme.breakpoints.down('md'));
  const mdUp = useMediaQuery(theme.breakpoints.up('md'));
  const lg = useMediaQuery(theme.breakpoints.between('lg', 'xl'));
  const lgDown = useMediaQuery(theme.breakpoints.down('lg'));
  const lgUp = useMediaQuery(theme.breakpoints.up('lg'));
  const xl = useMediaQuery(theme.breakpoints.between('xl', '2xl'));
  const xlDown = useMediaQuery(theme.breakpoints.down('xl'));
  const xlUp = useMediaQuery(theme.breakpoints.up('xl'));
  const xxl = useMediaQuery(theme.breakpoints.between('2xl', '3xl'));
  const xxlDown = useMediaQuery(theme.breakpoints.down('2xl'));
  const xxlUp = useMediaQuery(theme.breakpoints.up('2xl'));
  const xxxl = useMediaQuery(theme.breakpoints.up('3xl'));
  const xxxlDown = useMediaQuery(theme.breakpoints.down('3xl'));
  const xxxlUp = useMediaQuery(theme.breakpoints.up('3xl'));
  const xxxxl = useMediaQuery(theme.breakpoints.up('4xl'));
  const xxxxlDown = useMediaQuery(theme.breakpoints.down('4xl'));
  const xxxxlUp = useMediaQuery(theme.breakpoints.up('4xl'));
  const xxxxxl = useMediaQuery(theme.breakpoints.up('5xl'));
  const xxxxxlDown = useMediaQuery(theme.breakpoints.down('5xl'));
  const xxxxxlUp = useMediaQuery(theme.breakpoints.up('5xl'));

  return {
    xs,
    xsUp,
    sm,
    smDown,
    smUp,
    md,
    mdDown,
    mdUp,
    lg,
    lgDown,
    lgUp,
    xl,
    xlDown,
    xlUp,
    xxl,
    xxlDown,
    xxlUp,
    xxxl,
    xxxlDown,
    xxxlUp,
    xxxxl,
    xxxxlDown,
    xxxxlUp,
    xxxxxl,
    xxxxxlDown,
    xxxxxlUp,
  };
};
