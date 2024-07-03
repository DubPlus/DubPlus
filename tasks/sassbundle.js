const fs = require('fs');
const path = require('path');
const sass = require('sass');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const prefixer = postcss([autoprefixer]);
const log = require('./colored-console.js');
const { pathToFileURL } = require('url');

// our own custom module
var gitInfo = require(process.cwd() + '/tasks/repoInfo.js');
console.log(`SASS $resourceSrc set to ${gitInfo.resourceSrc}`);

/*************************************************************************
 * Build SASS
 * in order to pass variables to SASS we use the "data" options in node-sass
 * and pass that a SASS string with our variables first and an @import of
 * our main SASS file right after
 */

/**
 * @type {import('sass').StringOptions}
 */
const options = {
  functions: {
    'getSrc()': function (args) {
      return new sass.SassString(gitInfo.resourceSrc);
    },
  },
};

const file = path.resolve(__dirname, '../src/sass/dubplus.scss');

function compileSASS() {
  return sass.compileAsync(file, options).then((result) => {
    fs.writeFileSync('./css/dubplus.css', prefixer.process(result.css));
  });
}

function minifySASS() {
  return sass
    .compileAsync(file, { style: 'compressed', ...options })
    .then((result) => {
      fs.writeFileSync('./css/dubplus.min.css', prefixer.process(result.css));
    });
}

function watchingSASS() {
  // create our own sass file watch with node
  fs.watch(
    './src/sass',
    {
      recursive: true,
    },
    function (event, filename) {
      if (filename && /s[ca]ss/i.test(path.extname(filename))) {
        console.log(`SASS ${event} event detected`);
        console.log(`file: ${filename}`);
        compileSASS();
      } else {
        log.error('Filename missing. NOT compiling. Try again');
      }
    }
  );
}

module.exports = {
  compile: compileSASS,
  watch: watchingSASS,
  minify: minifySASS,
};
