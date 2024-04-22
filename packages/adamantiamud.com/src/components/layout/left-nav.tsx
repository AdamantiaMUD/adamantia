/** @jsx jsx */
import {jsx} from '@emotion/core';
import {FC} from 'react';
import {useTheme} from 'emotion-theming';
import {Link} from 'gatsby';

import {SiteTheme} from '../../util/site-theme';

export const LeftNav: FC<{location: Location}> = (props: {location: Location}) => {
    const {colors} = useTheme<SiteTheme>();

    const {location} = props;

    const css = {
        backgroundColor: colors.navBg,
        overflow: 'auto',
    };

    const activeLinkCss = {
        borderLeft: `5px solid ${colors.primary}`,
        paddingLeft: 'calc(1.5rem - 5px)',
    };

    const linkCss = {
        'borderBottom': `1px solid ${colors.secondary}`,
        'display': 'block',
        'padding': '1rem 1rem 1rem 1.5rem',
        'textDecoration': 'none',
        ':hover': {...activeLinkCss, textDecoration: 'underline'},
    };

    const bundlesSub = location.pathname.startsWith('/bundles');

    return (
        <aside css={css}>
            <Link activeStyle={activeLinkCss} css={linkCss} to="/">
                Home
            </Link>
            <Link activeStyle={activeLinkCss} css={linkCss} to="/getting-started/">
                Getting Started
            </Link>
            {!bundlesSub && (
                <Link activeStyle={activeLinkCss} css={linkCss} to="/bundles/core/">
                    Bundles
                </Link>
            )}
            {bundlesSub && (
                <div>
                    <Link
                        css={{...linkCss, ...activeLinkCss}}
                        to="/bundles/core/"
                    >
                        Bundles
                    </Link>
                    <div css={{paddingLeft: '1.5rem'}}>
                        <Link activeStyle={activeLinkCss} css={linkCss} to="/bundles/core/">
                            Core Bundles
                        </Link>
                        <Link activeStyle={activeLinkCss} css={linkCss} to="/bundles/optional/">
                            Optional Bundles
                        </Link>
                    </div>
                </div>
            )}
            <Link activeStyle={activeLinkCss} css={linkCss} to="/release-notes/">
                Release Notes
            </Link>
            <Link activeStyle={activeLinkCss} css={linkCss} to="/contributing/">
                Contributing
            </Link>
            <Link activeStyle={activeLinkCss} css={linkCss} to="/license-credits/">
                License/Credits
            </Link>
            <Link activeStyle={activeLinkCss} css={linkCss} to="/source-docs/">
                Source Docs
            </Link>
        </aside>
    );
};

export default LeftNav;
