import { ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { RecoilRoot } from 'recoil';

import AreaCanvas from '~/components/canvas/area-canvas';
import { AreaContextProvider } from '~/context/area-context';

const container = document.getElementById('root')!;
const root = createRoot(container);

const theme = createTheme();

root.render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <RecoilRoot>
                <AreaContextProvider>
                    <AreaCanvas />
                </AreaContextProvider>
            </RecoilRoot>
        </ThemeProvider>
    </React.StrictMode>
);
