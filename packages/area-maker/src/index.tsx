import { ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { RecoilRoot } from 'recoil';

import AreaCanvas from '~/components/canvas/area-canvas';

const container = document.getElementById('root')!;
const root = createRoot(container);

const theme = createTheme();

root.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <RecoilRoot>
                <AreaCanvas />
            </RecoilRoot>
        </ThemeProvider>
    </React.StrictMode>
);
