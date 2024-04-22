/** @jsx jsx */
import {FC} from 'react';
import {
    Global,
    SerializedStyles,
    css,
    jsx,
} from '@emotion/core';
import {useTheme} from 'emotion-theming';

import {SiteTheme} from '../util/site-theme';

export const GlobalStyles: FC = () => {
    const {colors} = useTheme<SiteTheme>();

    const styles: SerializedStyles = css`
        html, body, #___gatsby, #gatsby-focus-wrapper {
            height: 100vh;
            margin: 0;
            overflow: hidden;
            padding: 0;
            width: 100vw;
        }

        a {
            color: ${colors.primary};
        }
    `;

    return (<Global styles={styles} />);
};

export default GlobalStyles;
