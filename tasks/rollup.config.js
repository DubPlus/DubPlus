import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import replace from 'rollup-plugin-replace';
import { writeFileSync } from 'fs';

// our own custom module
var gitInfo = require('./repoInfo.js');
var pkg = require('../package.json');

// we only want to pass a few things from package.json 
var pkgInfo = {
  version : pkg.version,
  description : pkg.description,
  license : pkg.license,
  bugs : pkg.bugs.url
};

const jsInput = process.cwd() + '/src/js2/index.js';
const jsOutput = process.cwd() + '/dist/dubplus.js';

export default {
  input: jsInput,
  output: {
    file : jsOutput,
    format: 'iife',
    name: 'DubPlus',
    treeshake : true,
    globals : {
      jquery: '$'
    }
  },
  watch : {
    clearScreen: false
  },
  plugins: [
    resolve(),
    replace({
      // so that we can point to the proper branch during testing or production
      _RESOURCE_SRC_: JSON.stringify(gitInfo.resourceSrc),
      // so that we can insert it as a cache busting query string for CSS
      _TIME_STAMP_ : JSON.stringify(Date.now()),
      // pass our selected pkg info
      PKGINFO : JSON.stringify(pkgInfo)
    }),
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    }),
    uglify()
  ]
};