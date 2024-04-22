export interface SiteTheme {
    colors: {
        danger: string;
        info: string;
        navBg: string;
        primary: string;
        secondary: string;
        success: string;
        warning: string;
    };
    layout: {
        contentMaxWidth: string;
        gridGutter: string;
        leftNavWidth: string;
        siteFooterHeight: string;
        siteNavHeight: string;
    };
}

export const theme: SiteTheme = {
    colors: {
        danger: '#a02a28',
        info: '#009fc8',
        navBg: '#e3e3e3',
        primary: '#483d8b',
        secondary: '#aeaeae',
        success: '#73c800',
        warning: '#c8a600',
    },
    layout: {
        contentMaxWidth: 'calc(100% - 16rem)',
        gridGutter: '1rem',
        leftNavWidth: '16rem',
        siteFooterHeight: '2rem',
        siteNavHeight: '3rem',
    },
};

export default theme;
