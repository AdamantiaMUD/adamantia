/* global __dirname, module */
/* eslint-disable import/no-commonjs */

module.exports = {
    'root': true,
    'env': {
        browser: true,
        es2020: true,
        jest: true,
    },
    'extends': [
        '@chimericdream',
        '@chimericdream/babel',
        '@chimericdream/import',
        '@chimericdream/jest',
        '@chimericdream/jsx-a11y',
        '@chimericdream/react',
        '@chimericdream/react-hooks',
        '@chimericdream/typescript',
    ],
    'parser': '@typescript-eslint/parser',
    'parserOptions': {
        extraFileExtensions: ['.cjs'],
        project: `${__dirname}/tsconfig.eslint.json`,
    },
    'settings': {
        'import/resolver': {
            typescript: {
                project: `${__dirname}/tsconfig.eslint.json`,
            },
        },
        'react': {
            version: 'detect',
        },
    },
};
