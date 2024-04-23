import { Box } from '@mui/material';
import type { FC, PropsWithChildren as PWC } from 'react';

import { siteLayout } from '~/util/site-theme';

export const SiteWrapper: FC<PWC> = ({ children }: PWC) => (
    <Box
        sx={{
            display: 'grid',
            gridTemplateRows: `${siteLayout.siteNavHeight} 1fr`,
            height: '100%',
            overflow: 'hidden',
        }}
    >
        {children}
    </Box>
);

export default SiteWrapper;
