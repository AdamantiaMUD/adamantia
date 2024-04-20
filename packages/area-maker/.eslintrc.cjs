const base = require('../../.eslintrc.cjs');

module.exports = {
    ...base,
    root: true,
    env: {
        ...base.env,
        browser: true,
    },
    parserOptions: {
        project: './tsconfig.eslint.json',
    },
};
