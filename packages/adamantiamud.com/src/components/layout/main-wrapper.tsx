import { Box } from '@mui/material';
import type { FC, PropsWithChildren as PWC } from 'react';

import { siteLayout } from '../../util/site-theme';

export const MainWrapper: FC<PWC> = ({ children, ...restProps }: PWC) => (
    <Box
        sx={{
            display: 'grid',
            gridTemplateColumns: `${siteLayout.leftNavWidth} 1fr`,
            height: '100%',
            overflow: 'hidden',
        }}
        {...restProps}
    >
        {children}
    </Box>
);

export default MainWrapper;
