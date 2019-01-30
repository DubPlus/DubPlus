const fs = require("fs");
const path = require("path");
const sass = require("node-sass");
const postcss = require("postcss");
const autoprefixer = require("autoprefixer");
const prefixer = postcss([autoprefixer]);
const log = require("./colored-console.js");

function onError(err){
  log.error(err);
}

// our own custom module
var gitInfo = require(process.cwd() + "/tasks/repoInfo.js");
console.log(`SASS $resourceSrc set to ${gitInfo.resourceSrc}`);

/*************************************************************************
 * Build SASS
 * in order to pass variables to SASS we use the "data" options in node-sass
 * and pass that a SASS string with our variables first and an @import of
 * our main SASS file right after
 */

var dataString = `$resourceSrc : "${gitInfo.resourceSrc}"; `;
var sassEntryFile = "./src/sass/dubplus";
dataString += `@import '${sassEntryFile}';`;

function compileSASS() {
  return new Promise(function(resolve, reject) {
    sass.render(
      {
        data: dataString
      },
      function(err, result) {
        if (err) {
          reject(err);
        }
        fs.writeFileSync("./css/dubplus.css", prefixer.process(result.css));
        resolve();
      }
    );
  });
}

function minifySASS() {
  return new Promise(function(resolve, reject) {
    sass.render(
      {
        data: dataString,
        outputStyle: "compressed"
      },
      function(err, result) {
        if (err) {
          reject(err);
        }
        fs.writeFileSync("./css/dubplus.min.css", prefixer.process(result.css));
        resolve();
      }
    );
  });
}

function watchingSASS() {
  // create our own sass file watch with node
  fs.watch(
    "./src/sass",
    {
      recursive: true
    },
    function(event, filename) {
      if (filename && /s[ca]ss/i.test(path.extname(filename))) {
        console.log(`SASS ${event} event detected`);
        console.log(`file: ${filename}`);
        compileSASS();
      } else {
        log.error("Filename missing. NOT compiling. Try again");
      }
    }
  );
}


function plugin () {
  return {
    name: 'sass', // this name will show up in warnings and errors
    buildEnd() {
      compileSASS()
        .then(minifySASS)
        .then(function(){ console.log('sass finished compiling & minifying');})
        .catch(onError);
    }
  };
}

module.exports = {
  compile: compileSASS,
  watch: watchingSASS,
  minify: minifySASS,
  plugin: plugin
};

if (require.main === module) {
  compileSASS()
    .then(minifySASS)
    .then(() => {
      console.log("sass finished compiling & minifying");
    })
    .catch(err => console.error(err));
}
