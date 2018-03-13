import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import scss from 'rollup-plugin-scss'
import autoprefixer from 'autoprefixer'
import postcss from 'postcss'
import { writeFileSync } from 'fs'
const prefixer = postcss([ autoprefixer ]);

const jsInput = process.cwd() + '/src/js2/index.js';
const jsOutput = process.cwd() + '/build/dubplus.js';
const sassOutput = process.cwd() + '/build/dubplus.css';

export default {
  input: jsInput,
  output: {
    file : jsOutput,
    format: 'iife',
    name: 'DubPlus',
    sourcemap : true,
    treeshake : true
  },
  watch : {
    clearScreen: false
  },
  plugins: [
    resolve(),
    scss({
      output : function(css,styles){
        // console.log(styles);
        writeFileSync(sassOutput, prefixer.process(css))
      }
    }),
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    }),
    uglify()
  ]
};