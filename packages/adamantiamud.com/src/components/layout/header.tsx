/** @jsx jsx */
import {jsx} from '@emotion/core';
import {CSSProperties, FC} from 'react';
import {Link} from 'gatsby';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {useTheme} from 'emotion-theming';

import {SiteTheme} from '../../util/site-theme';

export interface HeaderProps {
    siteTitle: string;
}

const linkProps: CSSProperties = {color: 'white', textDecoration: 'none'};

export const Header: FC<HeaderProps> = ({siteTitle}: HeaderProps) => {
    const {colors, layout} = useTheme<SiteTheme>();

    const css = {
        backgroundColor: colors.primary,
        display: 'grid',
        gridTemplateColumns: '1fr 6rem',
        lineHeight: layout.siteNavHeight,
        padding: '0 1rem',
    };

    return (
        <header css={css}>
            <h1 style={{fontSize: '1.25rem', margin: 0}}>
                <Link to="/" style={linkProps}>{siteTitle}</Link>
            </h1>
            <div style={{textAlign: 'end'}}>
                <a
                    href="https://github.com/adamantiamud/adamantia-core"
                    style={linkProps}
                >
                    <FontAwesomeIcon icon={['fab', 'github']} />
                </a>
            </div>
        </header>
    );
};

export default Header;
