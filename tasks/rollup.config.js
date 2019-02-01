const rollup = require("rollup");
const resolve = require("rollup-plugin-node-resolve");
const babel = require("rollup-plugin-babel");
const { uglify } = require("rollup-plugin-uglify");
const replace = require("rollup-plugin-replace");
const sassTasks = require("./sassbundle.js");

const watchMode = process.env.WATCH === "true";

// our own custom module
var gitInfo = require("./repoInfo.js");
var pkg = require("../package.json");

// we only want to pass a few things from package.json
var pkgInfo = {
  version: pkg.version,
  description: pkg.description,
  license: pkg.license,
  bugs: pkg.bugs.url
};

const introBanner = `
/*
     /$$$$$$$            /$$
    | $$__  $$          | $$          /$$
    | $$  | $$ /$$   /$$| $$$$$$$    | $$
    | $$  | $$| $$  | $$| $$__  $$ /$$$$$$$$
    | $$  | $$| $$  | $$| $$  | $$|__  $$__/
    | $$  | $$| $$  | $$| $$  | $$   | $$
    | $$$$$$$/|  $$$$$$/| $$$$$$$/   |__/
    |_______/  \______/ |_______/


    https://github.com/DubPlus/DubPlus

    This source code is licensed under the MIT license
    found here: https://github.com/DubPlus/DubPlus/blob/master/LICENSE

    Copyright (c) 2017-present DubPlus

    more info at https://dub.plus
*/`;

const defaultPlugins = [
  resolve(),
  replace({
    // so that we can point to the proper branch during testing or production
    _RESOURCE_SRC_: JSON.stringify(gitInfo.resourceSrc),
    // so that we can insert it as a cache busting query string for CSS
    _TIME_STAMP_: JSON.stringify(Date.now()),
    // pass our selected pkg info
    _PKGINFO_: JSON.stringify(pkgInfo)
  }),
  babel({
    babelrc: false,
    include: ["src/js2/**", "node_modules/preact-portal/**"],
    plugins: [
      "@babel/plugin-transform-spread",
      "@babel/plugin-proposal-class-properties",
      [
        "@babel/plugin-transform-react-jsx",
        {
          pragma: "h",
          pragmaFrag: '"span"' // for now transform Fragments into a <span>
        }
      ]
    ],
    presets: [
      [
        "@babel/preset-env",
        {
          modules: false,
          targets: {
            ie: "11"
          }
        }
      ]
    ]
  })
];

const inputOptions = {
  input: process.cwd() + "/src/js2/index.js",
  treeshake: true,
  plugins: [...defaultPlugins, sassTasks.plugin()]
};

const outputOptions = {
  banner: introBanner,
  file: process.cwd() + "/dist/dubplus.js",
  format: "iife",
  name: "DubPlus"
};

/***********************************************
 * This builds the regular version
 */
async function build() {
  try {
    // create a bundle
    const bundle = await rollup.rollup(inputOptions);
    // or write the bundle to disk
    await bundle.write(outputOptions);
  } catch (e) {
    console.log(e);
  }
}
build();

/***********************************************
 * This builds the minified version
 * note: no need to build sass again
 */
inputOptions.plugins = [
  ...defaultPlugins,
  uglify({
    output: {
      preamble: introBanner
    }
  })
];

outputOptions.file = process.cwd() + "/dist/dubplus.min.js";
async function buildMin() {
  try {
    // create a bundle
    const bundle = await rollup.rollup(inputOptions);
    // or write the bundle to disk
    await bundle.write(outputOptions);
  } catch (e) {
    console.log("error during minify build");
    console.log(e);
  }
}
buildMin();
