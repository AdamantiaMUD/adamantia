const base = require('../../.eslintrc.cjs');

module.exports = {
    ...base,
    extends: [
        ...base.extends,
        '@chimericdream/jsx-a11y',
        '@chimericdream/react',
        '@chimericdream/react-hooks',
    ],
    root: true,
    env: {
        ...base.env,
        browser: true,
    },
    parserOptions: {
        project: './tsconfig.eslint.json',
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
    rules: {
        'react/require-default-props': 'off',
    },
};
