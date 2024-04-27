import { Box } from '@mui/material';
import type { FC, PropsWithChildren as PWC } from 'react';

import { siteLayout } from '../../util/site-theme';

import Footer from './footer';

export const SiteContent: FC<PWC> = ({ children }: PWC) => {
    const { gridGutter, contentMaxWidth } = siteLayout;

    return (
        <Box
            sx={{
                display: 'grid',
                gridTemplateRows: `1fr min-content`,
                overflow: 'auto',
                padding: `${gridGutter} ${gridGutter} 0 ${gridGutter}`,
            }}
        >
            <Box
                component="main"
                sx={{
                    maxWidth: contentMaxWidth,
                    overflow: 'auto',
                    paddingBlock: '1rem',
                }}
            >
                {children}
            </Box>
            <Footer />
        </Box>
    );
};

export default SiteContent;
