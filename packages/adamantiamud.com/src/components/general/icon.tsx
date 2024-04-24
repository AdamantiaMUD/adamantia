import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { SvgIcon } from '@mui/material';
import { type ForwardedRef, forwardRef } from 'react';

interface FontAwesomeSvgIconProps {
    icon: IconDefinition;
}

export const Icon = forwardRef<SVGSVGElement, FontAwesomeSvgIconProps>(
    (props: FontAwesomeSvgIconProps, ref: ForwardedRef<SVGSVGElement>) => {
        const { icon } = props;

        const {
            icon: [width, height, , , svgPathData],
        } = icon;

        return (
            <SvgIcon ref={ref} viewBox={`0 0 ${width} ${height}`}>
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
                    /* eslint-disable @typescript-eslint/no-magic-numbers, id-length, react/forbid-dom-props, react/jsx-key */
                    svgPathData.map((d: string, i: number) => (
                        <path style={{ opacity: i === 0 ? 0.4 : 1 }} d={d} />
                    ))
                    /* eslint-enable @typescript-eslint/no-magic-numbers, id-length, react/forbid-dom-props, react/jsx-key */
                )}
            </SvgIcon>
        );
    }
);

export default Icon;
