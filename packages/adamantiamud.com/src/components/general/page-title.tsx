import { Typography } from '@mui/material';
import type { FC, PropsWithChildren as PWC } from 'react';

export const PageTitle: FC<PWC> = ({ children }: PWC) => (
    <Typography component="h2" variant="h4" gutterBottom>
        {children}
    </Typography>
);

export default PageTitle;
