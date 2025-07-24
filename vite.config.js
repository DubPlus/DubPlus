import { resolve } from 'path';
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import terser from '@rollup/plugin-terser';
import pkg from './package.json';
import { getCurrentBranch } from './tasks/git-branch';
import { getTimestamp } from './tasks/timestamp';

// only want to pass a few things from package, delete the rest
delete pkg.main;
delete pkg.scripts;
delete pkg.repository;
delete pkg.bugs;
delete pkg.devDependencies;
delete pkg.dependencies;
delete pkg.type;
delete pkg.browserslist;
delete pkg.engines;

function getCdnRoot() {
  const currentBranch = getCurrentBranch();
  if (currentBranch && currentBranch !== 'master' && currentBranch !== 'main') {
    return `DubPlus@${currentBranch}`;
  } else {
    return 'DubPlus';
  }
}

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [svelte()],
    define: {
      __TIME_STAMP__: JSON.stringify(getTimestamp()),
      __GIT_BRANCH__: JSON.stringify(getCdnRoot()),
      __PKGINFO__: JSON.stringify(pkg),
    },
    build: {
      sourcemap: false,
      minify: false,

      // This places the "dubplus.js" and "dubplus.css" files in the root
      // of this repo. We are doing this instead of a subdirectory for
      // legacy reasons. If we change it, then many people who have linked
      // directly to the dubplus.js file will see it break and have to manually
      // update their links. So we are keeping it in the root for now.
      outDir: '.',

      /*************************************************
       * !! DO NOT CHANGE THIS !!
       * 'emptyOutDir' must always be 'false'.
       * If set to 'true', it will delete the entire repo
       */
      emptyOutDir: false,
      /************************************************* */

      lib: {
        entry: resolve(__dirname, '/src/main.js'),
        name: 'dubplus',
        fileName: 'dubplus',
        formats: ['iife'],
      },
      copyPublicDir: false,
      rollupOptions: {
        output: [
          {
            // inserts the Dub+ ascii logo and license into the top of the output
            banner: BANNER,
            format: 'iife',
            name: 'dubplus',

            // makes sure our output JS file is named dubplus.js
            // otherwise it would create: dubplus.iife.js
            entryFileNames: (chunkInfo) => {
              if (chunkInfo.name === 'main') return 'dubplus.js';
              return chunkInfo.name;
            },
          },
          {
            // inserts the Dub+ ascii logo and license into the top of the output
            banner: BANNER,
            format: 'iife',
            name: 'dubplus',
            plugins: [terser()],

            // makes sure our output JS file is named dubplus.min.js
            // otherwise it would create: dubplus.iife.js
            entryFileNames: (chunkInfo) => {
              if (chunkInfo.name === 'main') return 'dubplus.min.js';
              return chunkInfo.name;
            },
          },
        ],
      },
    },
  };
});

// this is a var instead of a const so I can leave it down here at the bottom of
// this file and JS will hoist it up and I can use it in the config above
var BANNER = `
/*!
     /#######            /##                
    | ##__  ##          | ##          /##   
    | ##  \\ ## /##   /##| #######    | ##   
    | ##  | ##| ##  | ##| ##__  ## /########
    | ##  | ##| ##  | ##| ##  \\ ##|__  ##__/
    | ##  | ##| ##  | ##| ##  | ##   | ##   
    | #######/|  ######/| #######/   |__/   
    |_______/  \\______/ |_______/           
                                            
                                            
    https://github.com/DubPlus/DubPlus

    MIT License 

    Copyright (c) 2024 DubPlus

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
*/`;
