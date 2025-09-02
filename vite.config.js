import terser from '@rollup/plugin-terser';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

// Read version from package.json
const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));
const version = packageJson.version;

/**
 * Rollup has a "banner" option but it doesn't work for minified files. So
 * we need to add the banner manually using this custom plugin. It also places
 * it first above all the code which is an improvement over how Vite injects it.
 */
const bannerPlugin = () => {
  return {
    name: 'banner-plugin',
    generateBundle(options, bundle) {
      // Iterate over all files in the bundle
      Object.keys(bundle).forEach((fileName) => {
        const file = bundle[fileName];

        // Process JavaScript files
        if (file.type === 'chunk' && fileName.endsWith('.js')) {
          // Add the banner to the top of the file
          file.code = BANNER + '\n' + file.code;
        }
      });
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [svelte(), bannerPlugin()],
    build: {
      sourcemap: false,
      minify: false,
      emptyOutDir: false,
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
            format: 'iife',
            name: 'dubplus',
            dir: process.env.OUTPUT_DIR || './extension/dist',

            // makes sure our output JS file is named dubplus.js
            // otherwise it would create: dubplus.iife.js
            entryFileNames: (chunkInfo) => {
              if (chunkInfo.name === 'main') return 'dubplus.js';
              return chunkInfo.name;
            },
          },
          {
            format: 'iife',
            name: 'dubplus',
            plugins: [terser()],
            dir: '.',

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

    // this will insert our banner at the top of the CSS files.
    css: {
      postcss: {
        plugins: [
          {
            postcssPlugin: 'css-banner',
            Once(root, { result }) {
              // Only add banner to the final output
              if (result.opts.to) {
                root.prepend(`${BANNER}`);
              }
            },
          },
        ],
      },
    },
  };
});

// this is a var instead of a const so I can leave it down here at the bottom of
// this file and JS will hoist it up and I can use it in the config above
var BANNER = `/*!
     /#######            /##                
    | ##__  ##          | ##          /##   
    | ##  \\ ## /##   /##| #######    | ##   
    | ##  | ##| ##  | ##| ##__  ## /########
    | ##  | ##| ##  | ##| ##  \\ ##|__  ##__/
    | ##  | ##| ##  | ##| ##  | ##   | ##   
    | #######/|  ######/| #######/   |__/   
    |_______/  \\______/ |_______/           
                                            
                                            
    https://github.com/DubPlus/DubPlus

    v${version}

    MIT License 

    Copyright (c) ${new Date().getFullYear()} DubPlus

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
