import { forwardRef } from 'react';
import { SxProps, Theme } from '@mui/material';
import { SvgIcon } from '@mui/material';
import {
  findIconDefinition,
  IconDefinition,
  IconLookup,
  IconName,
  IconPrefix,
} from '@fortawesome/fontawesome-svg-core';
import PropTypes from 'prop-types';

type IconProps = {
  classes?: string;
  color?:
    | 'inherit'
    | 'action'
    | 'disabled'
    | 'primary'
    | 'secondary'
    | 'error'
    | 'info'
    | 'success'
    | 'warning';
  htmlColor?: string;
  icon: [IconPrefix, IconName];
  id?: string;
  secondaryOpacity?: string;
  size?: 'small' | 'medium' | 'large';
  sx?: SxProps<Theme> | undefined;
};

export const Icon = forwardRef(
  (
    props: IconProps,
    ref:
      | ((instance: SVGSVGElement | null) => void)
      | React.RefObject<SVGSVGElement>
      | null
      | undefined
  ) => {
    const iconLookup: IconLookup = {
      prefix: props.icon[0],
      iconName: props.icon[1],
    };
    const icon: IconDefinition = findIconDefinition(iconLookup);
    const {
      icon: [width, height, , , svgPathData],
    } = icon;

    return (
      <SvgIcon
        className={props.classes && props.classes}
        color={props.color && props.color}
        fontSize={props.size ?? 'small'}
        htmlColor={props.htmlColor && props.htmlColor}
        id={props.id}
        sx={props.sx && props.sx}
        ref={ref}
        viewBox={`0 0 ${width} ${height}`}
      >
        {typeof svgPathData === 'string' ? (
          <path d={svgPathData} />
        ) : (
          /**
           * A multi-path Font Awesome icon seems to imply a duotune icon. The 0th path seems to
           * be the faded element (referred to as the "secondary" path in the Font Awesome docs)
           * of a duotone icon. 40% is the default opacity.
           *
           * @see https://fontawesome.com/how-to-use/on-the-web/styling/duotone-icons#changing-opacity
           */
          svgPathData.map((d: string | undefined, i: number) => (
            // <path style={{ opacity: i === 0 ? 0.4 : 1 }} d={d} />
            <path
              key={i}
              style={{ opacity: i === 0 ? props.secondaryOpacity : 1 }}
              d={d}
            />
          ))
        )}
      </SvgIcon>
    );
  }
);

Icon.propTypes = {
  icon: PropTypes.any.isRequired,
};
