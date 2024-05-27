import common from '@rosmarinus/common-plugins';
import { defineConfig } from 'rollup';

const external = [];

/**
 * @param {import('rollup').InternalModuleFormat} format
 * @param {string | undefined} banner
 */
function getConfig(format, banner = undefined) {
  return defineConfig({
    input: 'src/index.ts',
    output: {
      file: `dist/${format}/index.js`,
      format,
      banner,
      sourcemap: true,
    },
    external,
    plugins: [common()],
  });
}

export default [getConfig('cjs'), getConfig('es')];
