import { ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { RecoilRoot } from 'recoil';

import AreaCanvas from '~/components/canvas/area-canvas';
import { AreaContextProvider } from '~/context/area-context';

const container = document.getElementById('root')!;
const root = createRoot(container);

const theme = createTheme();
const queryClient = new QueryClient();

root.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={theme}>
                <RecoilRoot>
                    <AreaContextProvider>
                        <AreaCanvas />
                    </AreaContextProvider>
                </RecoilRoot>
            </ThemeProvider>
        </QueryClientProvider>
    </React.StrictMode>
);
