import resolve from "rollup-plugin-node-resolve";
import babel from "rollup-plugin-babel";
import { uglify } from "rollup-plugin-uglify";
import replace from "rollup-plugin-replace";
import sassTasks from "./sassbundle.js";

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

const jsInput = process.cwd() + "/src/js2/index.js";
const jsOutput = process.cwd() + "/dist/dubplus.js";

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

export default {
  input: jsInput,
  output: {
    banner: introBanner,
    file: jsOutput,
    format: "iife",
    name: "DubPlus",
    treeshake: true
  },
  watch: {
    clearScreen: false
  },
  plugins: [
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
    }),
    // // only uglify when NOT in watching mode
    // uglify({
    //   output: {
    //     preamble: introBanner
    //   }
    // }),
    sassTasks.plugin()
  ]
};
