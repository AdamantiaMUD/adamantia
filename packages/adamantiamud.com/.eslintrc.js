/* global module */

module.exports = {
    'root': true,
    'extends': [
        '@chimericdream',
        '@chimericdream/babel',
        '@chimericdream/jest',
        '@chimericdream/jsx-a11y',
        '@chimericdream/react',
        '@chimericdream/react-hooks',
        '@chimericdream/react-redux',
        '@chimericdream/typescript',
    ],
    'parser': '@typescript-eslint/parser',
    'parserOptions': {
        project: './.eslint.tsconfig.json',
        sourceType: 'module',
    },
    'settings': {
        'react': {
            'version': 'detect'
        }
    },
    'rules': {
        'babel/camelcase': 'off',
        'react/jsx-filename-extension': [
            'error',
            {
                extensions: [
                    '.js',
                    '.jsx',
                    '.tsx',
                ],
            },
        ],
        'react/jsx-pascal-case': [
            'error',
            {
                allowAllCaps: false,
                ignore: ['SEO'],
            },
        ],
    }
};
