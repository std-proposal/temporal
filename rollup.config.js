import license from 'rollup-plugin-license';
import { join } from 'path';

export default {
  input: 'lib/temporal.mjs',
  plugins: [
    license({
      banner: {
        file: join(__dirname, 'LICENSE'),
        encoding: 'utf-8'
      }
    })
  ],
  output: {
    file: 'index.js',
    name: 'temporal',
    format: 'umd',
    sourcemap: true
  }
};
