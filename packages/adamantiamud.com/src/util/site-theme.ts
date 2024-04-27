import { createTheme } from '@mui/material/styles';

/* eslint-disable import/no-unassigned-import */
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

/* eslint-enable import/no-unassigned-import */

export interface SiteLayout {
    contentMaxWidth: string;
    gridGutter: string;
    leftNavWidth: string;
    siteFooterHeight: string;
    siteNavHeight: string;
}

export const siteLayout: SiteLayout = {
    contentMaxWidth: 'calc(100% - 16rem)',
    gridGutter: '1rem',
    leftNavWidth: '16rem',
    siteFooterHeight: '2rem',
    siteNavHeight: '3rem',
};

export const theme = createTheme({
    palette: {
        mode: 'dark',
        error: { main: '#a02a28' },
        info: { main: '#009fc8' },
        primary: { main: '#483d8b' },
        secondary: { main: '#aeaeae' },
        success: { main: '#73c800' },
        warning: { main: '#c8a600' },
    },
    components: {
        MuiLink: {
            styleOverrides: {
                root: ({ theme }) => ({
                    color: theme.palette.primary.light,
                }),
            },
        },
    },
});
