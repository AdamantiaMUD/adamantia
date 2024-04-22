/** @jsx jsx */
import {jsx} from '@emotion/core';
import {FC, PropsWithChildren as PWC} from 'react';
import {useTheme} from 'emotion-theming';

import {SiteTheme} from '../../util/site-theme';

export const Footer: FC = (props: PWC<never>) => {
    const {layout} = useTheme<SiteTheme>();

    const css = {
        lineHeight: layout.siteFooterHeight,
    };

    return (
        <footer css={css} {...props}>
            © {new Date().getFullYear()}, Built with <a href="https://www.gatsbyjs.org">Gatsby</a>
        </footer>
    );
};

export default Footer;
