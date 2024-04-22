/** @jsx jsx */
import {jsx} from '@emotion/core';
import {FC, PropsWithChildren as PWC} from 'react';
import {useTheme} from 'emotion-theming';

import {SiteTheme} from '../../util/site-theme';
import Footer from './footer';

export const SiteContent: FC = (props: PWC<never>) => {
    const {layout} = useTheme<SiteTheme>();
    const {children} = props;

    const css = {
        display: 'grid',
        gridTemplateRows: `1fr ${layout.siteFooterHeight}`,
        overflow: 'auto',
        padding: `${layout.gridGutter} ${layout.gridGutter} 0 ${layout.gridGutter}`,
    };

    return (
        <section css={css}>
            <main css={{maxWidth: layout.contentMaxWidth}}>
                {children}
            </main>
            <Footer />
        </section>
    );
};

export default SiteContent;
