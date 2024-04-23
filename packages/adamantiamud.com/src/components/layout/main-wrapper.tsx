import { Box } from '@mui/material';
import type { FC, PropsWithChildren as PWC } from 'react';

import { siteLayout } from '../../util/site-theme';

export const MainWrapper: FC<PWC> = ({ children, ...restProps }: PWC) => {
    const { leftNavWidth } = siteLayout;

    const css = {
        display: 'grid',
        gridTemplateColumns: `${leftNavWidth} 1fr`,
        height: '100%',
        overflow: 'hidden',
    };

    return (
        <Box sx={css} {...restProps}>
            {children}
        </Box>
    );
};

export default MainWrapper;
