var fs = require("fs");
var mkdirp = require('mkdirp')
var nunjucks = require('nunjucks');
var glob = require("glob");
var path = require('path');
var chokidar = require('chokidar');
var argv = require("commander")
  .option("-p, --path <s>", "Path where template live")
  .option("-o, --out <s>", "Output folder")
  .option("-c, --usecache", "'noCache' set FALSE.")
  .option("-w, --watch", "Watch files change.")
  .parse(process.argv);
var options = {
  path: './src',
  ext: '.html',
  data: {},
  inheritExtension: false,
  envOptions: {
    noCache: true,
    watch: false
  },
  manageEnv: null,
  out: './dist'
};
var colors = {
  black: '\u001b[30m',
  red: '\u001b[31m',
  green: '\u001b[32m',
  yellow: '\u001b[33m',
  blue: '\u001b[34m',
  magenta: '\u001b[35m',
  cyan: '\u001b[36m',
  white: '\u001b[37m',
  reset: '\u001b[0m'
}

if (argv.path) options.path = argv.path;
if (argv.out) options.out = argv.out;
if (argv.usecache) options.envOptions.noCache = !argv.usecache;
if (argv.watch) options.envOptions.watch = argv.watch;

console.log('----\n' + colors.yellow + 'njk-compile:' + colors.reset);
if (!options.envOptions.noCache) console.log(colors.magenta + '  [!]' + colors.reset + ' Use Cache');
// console.log(' path ' + options.path);
// console.log(' out ' + options.out);
// console.log(' -noCache ' + options.envOptions.noCache);

options.chokidar = {
  persistent: true,
  cwd: path.resolve(process.cwd(), path.basename(options.path))
};

nunjucks.configure(options.envOptions);
options.loaders = new nunjucks.FileSystemLoader(options.path, options.envOptions);
var compile = new nunjucks.Environment(options.loaders, options.envOptions);

if (argv.watch) {
  var watcher = chokidar.watch(['**/*.html'], options.chokidar);
  watcher.on('ready', function() { console.log(colors.blue + "  start watching..." + colors.reset); }).on('change', function (file) {
    if (file.indexOf('_') > -1) {
      complieAll();
    } else {
      var realFileName = path.resolve(process.cwd(), path.basename(options.path)) + '/' + file;
      var fileContent = compile.renderString(fs.readFileSync(realFileName, 'utf8'), {});
      var outputFile = path.resolve(path.basename(options.out), file);
      mkdirp.sync(path.dirname(outputFile));
      fs.writeFile(outputFile, fileContent, function(err){
        console.log(colors.blue + '  compile ' + colors.reset + file);
        if(err){
          console.log(err);
        }
      });
    }
  });
} else {
  complieAll();
}

function complieAll() {
  console.log('');
  glob('**/*.html', { ignore: '**/_*.*', cwd: path.resolve(options.path) }, function (err, files) {
    if (err) {
      return console.error(err);
    }
    files.forEach(function (file) {
      var realFileName = path.resolve(process.cwd(), path.basename(options.path)) + '/' + file;
      var fileContent = compile.renderString(fs.readFileSync(realFileName, 'utf8'), {});
      var outputFile = path.resolve(path.basename(options.out), file);
      mkdirp.sync(path.dirname(outputFile));
      fs.writeFile(outputFile, fileContent, function(err){
        console.log(colors.green + '  compile ' + colors.reset + file);
        if(err){
          console.log(err);
        }
      });
    }, this);
  });
}