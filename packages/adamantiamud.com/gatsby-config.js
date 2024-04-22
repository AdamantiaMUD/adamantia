/* global __dirname, module */

module.exports = {
    siteMetadata: {
        title: 'AdamantiaMUD',
        /* eslint-disable-next-line max-len */
        description: 'Documentation, examples, and other information related to the Adamantia MUD engine.',
        author: '@chimericdream',
    },
    plugins: [
        'gatsby-plugin-typescript',
        'gatsby-plugin-react-helmet',
        {
            resolve: 'gatsby-source-filesystem',
            options: {
                name: 'images',
                path: `${__dirname}/src/images`,
            },
        },
        'gatsby-transformer-sharp',
        'gatsby-plugin-sharp',
        'gatsby-plugin-emotion',
        {
            resolve: 'gatsby-plugin-manifest',
            /* eslint-disable @typescript-eslint/camelcase, id-match */
            options: {
                name: 'AdamantiaMUD Documentation',
                short_name: 'Adamantia Docs',
                start_url: '/',
                background_color: '#639',
                theme_color: '#639',
                display: 'minimal-ui',

                // This path is relative to the root of the site.
                icon: 'src/images/gatsby-icon.png',
            },
            /* eslint-enable @typescript-eslint/camelcase, id-match */
        },

        /*
         * this (optional) plugin enables Progressive Web App + Offline functionality
         * To learn more, visit: https://gatsby.dev/offline
         */
        'gatsby-plugin-offline',
    ],
};
