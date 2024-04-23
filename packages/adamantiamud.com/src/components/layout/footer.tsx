import { Box } from '@mui/material';
import type { FC } from 'react';

import { siteLayout } from '../../util/site-theme';

export const Footer: FC = () => (
    <Box component="footer" sx={{ paddingBlock: '0.5rem' }}>
        © {new Date().getFullYear()}
    </Box>
);

export default Footer;
