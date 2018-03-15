import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import { writeFileSync } from 'fs';

const jsInput = process.cwd() + '/src/js2/index.js';
const jsOutput = process.cwd() + '/dist/dubplus.js';

export default {
  input: jsInput,
  output: {
    file : jsOutput,
    format: 'iife',
    name: 'dubplus',
    sourcemap : true,
    treeshake : true
  },
  watch : {
    clearScreen: false
  },
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    }),
    uglify()
  ]
};