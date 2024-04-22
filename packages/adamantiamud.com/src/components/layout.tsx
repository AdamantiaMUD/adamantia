/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

/** @jsx jsx */
import {jsx} from '@emotion/core';
import {FC, PropsWithChildren as PWC} from 'react';
import {useStaticQuery, graphql} from 'gatsby';
import {ThemeProvider} from 'emotion-theming';

import '../util/icons';

import theme from '../util/site-theme';

import Header from './layout/header';
import LeftNav from './layout/left-nav';
import MainWrapper from './layout/main-wrapper';
import SiteContent from './layout/site-content';
import SiteWrapper from './layout/site-wrapper';
import GlobalStyles from './global-styles';

export const Layout: FC<{location: Location}> = (props: PWC<{location: Location}>) => {
    const {children, location} = props;

    const data = useStaticQuery(graphql`
        query SiteTitleQuery {
            site {
                siteMetadata {
                    title
                }
            }
        }
    `);

    return (
        <ThemeProvider theme={theme}>
            <GlobalStyles />
            <SiteWrapper>
                <Header siteTitle={data.site.siteMetadata.title} />
                <MainWrapper>
                    <LeftNav location={location} />
                    <SiteContent>
                        {children}
                    </SiteContent>
                </MainWrapper>
            </SiteWrapper>
        </ThemeProvider>
    );
};

export default Layout;
