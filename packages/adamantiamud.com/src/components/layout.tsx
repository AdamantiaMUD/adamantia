import type { FC, PropsWithChildren as PWC } from 'react';

import Header from './layout/header';
import LeftNav from './layout/left-nav';
import MainWrapper from './layout/main-wrapper';
import SiteContent from './layout/site-content';
import SiteWrapper from './layout/site-wrapper';

export const Layout: FC<PWC> = ({ children }: PWC) => (
    <SiteWrapper>
        <Header />
        <MainWrapper>
            <LeftNav />
            <SiteContent>{children}</SiteContent>
        </MainWrapper>
    </SiteWrapper>
);

export default Layout;
