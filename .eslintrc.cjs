module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['@rosmarinus/eslint-config-rosmarinus'],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.eslint.json',
  },
  globals: {},
};
