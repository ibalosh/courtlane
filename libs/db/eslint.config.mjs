import baseConfig from '../../eslint.config.mjs';

export default [
  {
    ignores: ['src/generated/**'],
  },
  ...baseConfig,
];
