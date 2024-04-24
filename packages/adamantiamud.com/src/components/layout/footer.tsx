import { Box } from '@mui/material';
import type { FC } from 'react';

export const Footer: FC = () => (
    <Box component="footer" sx={{ paddingBlock: '0.5rem' }}>
        © {new Date().getFullYear()}
    </Box>
);

export default Footer;
