const rollup = require("rollup");
const resolve = require("rollup-plugin-node-resolve");
const babel = require("rollup-plugin-babel");
const { uglify } = require("rollup-plugin-uglify");
const replace = require("rollup-plugin-replace");
const sassTasks = require("./sassbundle.js");
const stripCode = require("rollup-plugin-strip-code");

const watchMode = process.env.WATCH === "true";
const isExtension = process.env.IS_EXT && process.env.IS_EXT === "true";

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

/**
 * This custom import alias allows you to replace a '@' in an import statement
 * with your src dir so you can have cleaner import statements
 * instead of:
 *    '../../utils/something'  OR  process.cwd() + '/utils/something'
 * you can just do:
 *   '@/utils/something'
 */
function customAlias() {
  let src = process.cwd() + "/src/js";
  function fixExt(id) {
    return /\.js$/.test(id) ? id : id + ".js";
  }
  return {
    name: "customAlias",
    resolveId(importee) {
      if (importee.charAt(0) === "@") {
        return fixExt(importee.replace(/^@/, src));
      }
      return null;
    }
  };
}

const defaultPlugins = [
  customAlias(),
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
    include: ["src/js/**"],
    plugins: [
      "@babel/plugin-transform-spread",
      "@babel/plugin-proposal-class-properties",
      [
        "@babel/plugin-transform-react-jsx",
        {
          pragma: "h",
          pragmaFrag: '"span"' // for now transform Fragments into a <span> until Preact fully supports Fragments
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
  input: process.cwd() + "/src/js/index.js",
  treeshake: true,
  plugins: [
    ...(isExtension
      ? [
          stripCode({
            start_comment: "START.NOT_EXT",
            end_comment: "END.NOT_EXT"
          })
        ]
      : []),
    ...defaultPlugins,
    sassTasks.plugin()
  ]
};

const outputOptions = {
  banner: introBanner,
  file: process.cwd() + "/dubplus.js",
  format: "iife",
  name: "DubPlus"
};

/***********************************************
 * This builds the regular version
 * both min and and non-min SASS built here
 */
async function build(inOpts, outOpts) {
  console.log("building dub+");
  let _in = Object.assign({}, inOpts);
  let _out = Object.assign({}, outOpts);
  try {
    // create a bundle
    const bundle = await rollup.rollup(_in);
    await bundle.write(_out);
  } catch (e) {
    console.log(e);
  }
}
build(inputOptions, outputOptions);

/***********************************************
 * This builds the minified JS version
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

outputOptions.file = process.cwd() + "/dubplus.min.js";

async function buildMin(inOpts, outOpts) {
  console.log("building minified dub+");
  let _in = Object.assign({}, inOpts);
  let _out = Object.assign({}, outOpts);
  try {
    const bundle = await rollup.rollup(_in);
    await bundle.write(_out);
  } catch (e) {
    console.log("error during minify build");
    console.log(e);
  }
}
buildMin(inputOptions, outputOptions);
