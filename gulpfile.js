require('dotenv').config()

const gulp = require('gulp');
const cache = require('gulp-cache');
var cached = require('gulp-cached');
const { series, parallel, dest } = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const changed = require('gulp-changed');
const replace = require('gulp-replace');
const dircompare = require('dir-compare');
const image = require('gulp-image');
const data = require('gulp-data');
const path = require('path');
const fs = require('fs');
const glob = require('glob');
const dirTree = require("directory-tree");
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const nunjucksRender = require('gulp-nunjucks-render');
const htmlbeautify = require('gulp-html-beautify');
const purgecss = require('gulp-purgecss')
const cleanCSS = require('gulp-clean-css');
const gulpif = require('gulp-if');
const autoprefixer = require('gulp-autoprefixer');
const babel = require('gulp-babel');
const rename = require('gulp-rename');
const exec = require('child_process').exec;
const argv = require('yargs').argv;

const browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

const cssbeautify = require('gulp-cssbeautify');

var postcss = require('gulp-postcss');
var cssvariables = require("postcss-css-variables");
var posCssRgb = require("postcss-rgb");
var posCssParent = require('postcss-parent-selector');

// var favicons = require('gulp-favicons');
var del = require('del');
var gutil = require('gulp-util');
var ftp = require('vinyl-ftp');
const filter = require('gulp-filter');
var yarn = require('gulp-yarn');
var git = require('gulp-git');
var process = require("process");
var prompt = require('prompt');
var RevAll = require("gulp-rev-all");

var defSourceName = './src';
var rootSrc = '';
var sourceFolderName = 'src';
var desFolderName = 'dist';
var staticFolderName = 'static';
var themeSourceFolderName = sourceFolderName;

var _ = require('lodash');

if (argv.src) {
  rootSrc = `theme/${argv.src}/`
  themeSourceFolderName = `theme/${argv.src}`;
  desFolderName = `dist-theme/${argv.src}`;
  if (fs.existsSync(themeSourceFolderName + '/color-theme') && !argv.colorTheme) {
    desFolderName += '/default'
  }
}


rootSrc = './' + rootSrc;
var gulpThemeSrc = rootSrc;
var sourceName = './' + sourceFolderName;
var desFolder = './' + desFolderName;
var themeSourceName = './' + themeSourceFolderName;


if (argv.colorTheme) {
  gulpThemeSrc += `color-theme/${argv.colorTheme}/`
  desFolderName += `/${argv.colorTheme}`
  desFolder = './' + desFolderName
}

var staticFolder = desFolder.replace('dist', 'static');
staticFolderName = desFolderName.replace('dist', 'static');

if (argv.src) {
  if (fs.existsSync(themeSourceName + '/custom/css')) {
    var customCssSrcName = themeSourceName;
  } else {
    var customCssSrcName = defSourceName;
  }

  if (fs.existsSync(themeSourceName + '/scss')) {
    var customScssSrcName = themeSourceName;
  } else {
    var customScssSrcName = defSourceName;
  }

  if (fs.existsSync(themeSourceName + '/gulp_plugins_config.js')) {
    var gulpPluginSrc = themeSourceName + '/';
  } else {
    var gulpPluginSrc = './';
  }

} else {
  var gulpPluginSrc = './';
  var customCssSrcName = defSourceName;
  var customScssSrcName = defSourceName;
}

var plugins = require(gulpPluginSrc + 'gulp_plugins_config.js').plugins

var pluginsBundlesJsVal = [];
var pluginsBundlesCssVal = [];
var commitMessage = '';

Array.prototype.diff = function (a) {
  return this.filter(function (i) { return a.indexOf(i) < 0; });
};

var options = {
  indent_size: 2,
  max_preserve_newlines: 0
};

const cssDiff = require('@romainberger/css-diff')
function cssDiffer (cb) {
  cssA = fs.readFileSync('./static-theme/bidv/default/css/style.css')
  cssB = fs.readFileSync('./static-theme/bidv/vip/css/style.css')
  const diff = cssDiff(cssA, cssB)
  fs.writeFile('./dist/themetest/theme.css', diff, () => { });
  gulp.src('./dist/themetest/theme.css')
    .pipe(cleanCSS({level: 2}))
    .pipe(postcss([posCssParent({selector: '.theme-vip'})]))
    .pipe(gulp.dest('./dist//themetest/'));
  cb()
}

function execPromise (cmd) {
  return new Promise(function (resolve, reject) {
    exec(cmd, function (err, stdout) {
      if (err) return reject(err);
      resolve(stdout);
    });
  });
}

function buildTheme (cb) {
  var themeName = fs.readdirSync('./theme');
  themeName.forEach(element => {
    if (fs.existsSync(`./theme/${element}/color-theme`)) {
      var themeColorName = fs.readdirSync(`./theme/${element}/color-theme`);
      themeColorName.forEach(element2 => {
        var themeColorText = `${element} --colorTheme ${element2}`
        themeName.push(themeColorText)
      })
    }
  })
  themeName = themeName.map((element) => {
    return `gulp devTheme --src ${element}`;
  });
  themePushFtpName = themeName.map((element) => {
    return element.replace('devTheme', 'pushFtpTheme');
  });
  console.log(themeName)
  themeName.reduce(function (p, cmd) {
    return p.then(function (results) {
      console.log(`Start building ${cmd}`)
      return execPromise(cmd).then(function (stdout) {
        console.log(`Finish building ${cmd}`)
        results.push(stdout);
        return results;
      });
    });
  }, Promise.resolve([])).then(function (results) {
    themePushFtpName.forEach(cmd => {
      execPromise(cmd)
    })
  }, function (err) {
    // error here
  });
  cb();
}

function settings () {
  var settingSearch = ''
  var themeName = fs.readdirSync('./theme');
  if (argv.src) {
    settingSearch =
      `"src/fonts/**/*": true,
    "gulp_themes_config.js": true,
    "gulp_icons-color-config.js": true,`
    if (fs.existsSync(themeSourceName + '/custom/css')) {
      settingSearch += `"src/custom/css": true,`
    }

    if (fs.existsSync(themeSourceName + '/scss')) {
      settingSearch += `"src/scss": true,`
    }

    themeName.forEach(element => {
      if (element != argv.src) {
        settingSearch += `\n"theme/${element}": true,`
      }
    });
  }
  else {
    settingSearch =
      `"theme/*": true,`
  }
  settingSearch = `// settingSearch\n${settingSearch}\n// endSettingSearch`
  return gulp.src(['./.vscode/settings.json'])
    .pipe(replace(/(\/\/ settingSearch)([\S\s]*?)(\/\/ endSettingSearch)/, settingSearch))
    .pipe(gulp.dest('./.vscode/'));
}

var postCssPlugins = [
  posCssRgb()
];

function postCss () {
  return gulp.src(desFolder + '/css/custom.bundles.css')
    .pipe(postcss(postCssPlugins))
    .pipe(gulp.dest(desFolder + '/css/'));
}


function themeGenerator () {
  return gulp.src(desFolder + '/css/style.css')
    .pipe(cssbeautify())
    .pipe(replace(/^((?!3f3bec|{|}|^(.*[^,])\,$).)*$/gm, ''))
    .pipe(replace(/.*(transition|transform).*/gm, ''))
    .pipe(replace(/\/\*\!/g, ''))
    .pipe(cleanCSS({ level: 2 }))
    .pipe(gulp.dest(desFolder + '/css-test'));
}

function genVarFilesFunc (srcPath, content) {
  if (!fs.existsSync(srcPath)) {
    fs.writeFile(srcPath, content, () => { });
  };
}

function genStatic () {
  return gulp.src([desFolder + '/**/*', '!' + desFolder + '/dev-only{,/**}', '!' + desFolder + '/pages/theme/!(' + argv.src + ')/**'])
    .pipe(gulp.dest(staticFolder + '/'));
}

function genVarFiles (cb) {
  var importGenPath = sourceName + '/_imports/_gen-varibles.njk'
  var importGenContent = '{# gtc-text-njk #}\n{# end-gtc-text-njk #}\n\n{# gtc-color-njk #}\n{# end-gtc-color-njk #}'

  var devGenPath = sourceName + '/dev-only/devSrc/_dev-gen-varibles.njk'
  var devGenContent = '{# link-media-njk #}\n{# end-link-media-njk #}\n\n{# icon-color-njk #}\n{# end-icon-color-njk #}\n\n{# link-icon-color-njk #}\n{# end-link-icon-color-njk #}'


  var snippetGenPath = './.vscode/njk-snippet.code-snippets'
  var snippetGenContent = '{\n\t//generated-snippet\n//end-generated-snippet\n\n//component-snippet\n/end-component-snippet\n}'

  var scssGenPath = customScssSrcName + '/scss/varibles/_gen-varibles.scss'
  var scssGenContent = '//gtc-text-scss\n//end-gtc-text-scss\n\n//gtc-color-scss\n//end-gtc-color-scss'

  var cssGenPath = customCssSrcName + '/custom/css/0-gen-varibles.css'
  var cssGenContent = '/*gtc-css*/\n/*end-gtc-css*/'

  genVarFilesFunc(importGenPath, importGenContent);
  genVarFilesFunc(devGenPath, devGenContent);
  genVarFilesFunc(scssGenPath, scssGenContent);
  genVarFilesFunc(cssGenPath, cssGenContent);
  genVarFilesFunc(snippetGenPath, snippetGenContent);

  cb()
}

// ----------------------------THEME----------------------------

var themeColor = [];
var themeColorMapText = '';
var themeColorMapArr = {};
var themeColorVarText = '';
var themeColorVarTextArr = {};
var themeTextVarText = '';
var themeTextVarTextArr = {};

var themeColorVarTextArr2 = {};
var themeColorVarText2 = '';

function themeMapFunction (mapName, propName, propKey, themeName) {
  if (mapName[propName]) {
    !themeColorMapArr[propName] ? themeColorMapArr[propName] = '' : ''
    if (!/#|\./.test(mapName[propName])) {
      return themeColorMapArr[propName] += '\t' + propKey + ': ' + themeName + '-' + mapName[propName] + ',\n';
    } else {
      return themeColorMapArr[propName] += '\t' + propKey + ': ' + mapName[propName] + ',\n';
    }
  }
}

function themeVarFunction (mapName, propName, propKey, themeName) {
  if (mapName[propName]) {
    var propNameTxt = propName + '-';
    !themeColorVarTextArr[propName] ? themeColorVarTextArr[propName] = '' : ''
    propName == 'color' ? propNameTxt = '' : ''
    return themeColorVarTextArr[propName] += themeName + '-' + propNameTxt + propKey + ': ' + mapName[propName] + ';\n';
  }
}

// function themeMapFunction (mapName, propName, propKey, themeName) {
//   if (mapName[propName]) {
//     var propertyTxt
//     propName == 'color' ? propertyTxt = 'color-' :  propertyTxt = 'color-' + propName + '-'
//     !themeColorMapArr[propName] ? themeColorMapArr[propName] = '' : ''
//     return themeColorMapArr[propName] += '\t' + propKey + ': var(--' + propertyTxt + propKey + '),\n';
//   }
// }

// function themeVarFunction (mapName, propName, propKey, themeName) {
//   if (mapName[propName]) {
//     var propNameTxt = propName + '-';
//     !themeColorVarTextArr[propName] ? themeColorVarTextArr[propName] = '' : ''
//     propName == 'color' ? propNameTxt = '' : ''
//     !themeColorVarTextArr2[propName] ? themeColorVarTextArr2[propName] = '' : ''
//     themeColorVarTextArr2[propName] += themeName + '-' + propNameTxt + propKey + ': var(--' + themeName.replace('$', '') + '-' + propNameTxt + propKey + ');\n';
//     return themeColorVarTextArr[propName] += themeName + '-' + propNameTxt + propKey + ': ' + mapName[propName] + ';\n';
//   }
// }

function theme () {
  delete require.cache[require.resolve(gulpThemeSrc + 'gulp_themes_config.js')];

  //theme globalScss
  themeGlobVarText = '\n';
  themeGlob = require(gulpThemeSrc + 'gulp_themes_config.js').globalScss;
  if (themeGlob) {
    Object.keys(themeGlob).forEach(key => {
      var value = themeGlob[key];
      if (typeof value === 'object') {
        var text = `${key}: ` + JSON.stringify(value).replace(/"/g, '').replace(/{/g, '(').replace(/}/g, ')') + ';\n'
        themeGlobVarText += text;

      } else {
        themeGlobVarText += `$${key}: ${value};\n`;
      }
    });
  }
  //end theme globalScss
  //theme text
  themeTextMapText = '';
  themeTextVarText = '';
  themeText = require(gulpThemeSrc + 'gulp_themes_config.js').themeText;
  var themeTextMapText = '\n$map-h-font: ' + JSON.stringify(themeText, null, "\t").replace(/{/g, '(').replace(/}/g, ')') + ';\n';
  for (var property in themeText) {
    themeTextVarText += '$fz-' + property + ': ' + themeText[property]["font-size"] + ';\n' + '$fz-' + property + '-line-height: ' + themeText[property]["line-height"] + ';\n';
  }

  var themeTextMapAllText = '//gtc-text-scss' + themeGlobVarText + themeTextMapText + themeTextVarText + '\n//end-gtc-text-scss';

  var themeTextNjk = '{# gtc-text-njk #}\n{% set textName = [\n' + JSON.stringify(themeText, null, "\t") + '\n] %}\n{# end-gtc-text-njk #}';

  //end theme text
  // theme color
  themeColorMapText = '';
  themeColorMapArr = {};

  themeColorVarText = '';
  themeColorVarTextArr = {};

  themeColor = require(gulpThemeSrc + 'gulp_themes_config.js').themeColor;

  var themeColorNjk = '{# gtc-color-njk #}\n{% set colorName = [\n' + JSON.stringify(themeColor.default, null, "\t") + '\n] %}\n{# end-gtc-color-njk #}';

  for (var property in themeColor.default.normal) {
    var themeColorMap = themeColor.default.normal[property]
    for (var property1 in themeColorMap) {
      themeMapFunction(themeColorMap, property1, property, '$color');
      themeVarFunction(themeColorMap, property1, property, '$color');
    }
  }
  for (var property in themeColor.default.level) {
    var colorMap = themeColor.default.level[property]
    var colorMap = themeColor.default.normal[colorMap]
    for (var property1 in colorMap) {
      themeMapFunction(colorMap, property1, property, '$color');
      themeVarFunction(colorMap, property1, property, '$color');
    }
  }
  for (var property in themeColorMapArr) {
    var propertyTxt = '-' + property
    property == 'color' ? propertyTxt = '' : ''
    themeColorMapText += '\n$map-color' + propertyTxt + ': (\n' + themeColorMapArr[property] + ');\n'
  }

  for (var property in themeColorVarTextArr) {
    // themeColorVarText2 += '\n' + themeColorVarTextArr2[property] + '\n'
    themeColorVarText += '\n' + themeColorVarTextArr[property] + '\n'
  }
  // end theme color

  themeColorTextAllCss = '/*gtc-css*/\n:root {\n' + themeColorVarText.replace(/\$/g, '\t--') + themeTextVarText.replace(/\$/g, '\t--') + '}\n/*end-gtc-css*/';

  // themeColorVarText = themeColorVarText2;

  themeColorTextAll = '//gtc-color-scss\n' + themeColorVarText + themeColorMapText + '\n//end-gtc-color-scss'


  gulp.src([customCssSrcName + '/custom/css/0-gen-varibles.css'], { base: customCssSrcName + '/' })
    .pipe(replace(/(\/\*gtc-css\*\/)([\S\s]*?)(\/\*end-gtc-css\*\/)/, themeColorTextAllCss))
    .pipe(gulp.dest(customCssSrcName + '/'))

  gulp.src([customScssSrcName + '/scss/varibles/_gen-varibles.scss'], { base: customScssSrcName + '/' })
    .pipe(replace(/(\/\/gtc-text-scss)([\S\s]*?)(\/\/end-gtc-text-scss)/, themeTextMapAllText))
    .pipe(replace(/(\/\/gtc-color-scss)([\S\s]*?)(\/\/end-gtc-color-scss)/, themeColorTextAll))
    .pipe(gulp.dest(customScssSrcName + '/'))

  return gulp.src([defSourceName + '/_imports/_gen-varibles.njk'], { base: defSourceName + '/' })
    .pipe(replace(/({# gtc-text-njk #})([\S\s]*?)({# end-gtc-text-njk #})/, themeTextNjk))
    .pipe(replace(/({# gtc-color-njk #})([\S\s]*?)({# end-gtc-color-njk #})/, themeColorNjk))
    .pipe(gulp.dest(defSourceName + '/'))
};

// ----------------------------END THEME----------------------------

function browserifyJs (cb) {
  return browserify(sourceName + '/plugins-browserify/uppy/uppy.js')
    .bundle()
    .pipe(source('bundle.js'))
    // Start piping stream to tasks!
    .pipe(gulp.dest(desFolder + '/js/vendors/plugins-browserify/'));
};

function cleanVendorsJs (cb) {
  del(desFolder + '/css/vendors/**', { force: true });
  return del(desFolder + '/js/vendors/**', { force: true });
}

function pluginsVendorsJS (cb) {
  delete require.cache[require.resolve(gulpPluginSrc + 'gulp_plugins_config.js')];
  plugins = require(gulpPluginSrc + 'gulp_plugins_config.js').plugins
  plugins.vendors.map((file, index) => {
    if (file.scripts != undefined) {
      if (file.scripts.toString().includes("browserify")) {
        browserify(file.scripts)
          .bundle()
          .pipe(source(file.name + '.bundles.js'))
          .pipe(buffer())
          .pipe(gulpif('!**/*.min.js', cache(uglify())))
          // Start piping stream to tasks!
          .pipe(gulp.dest(desFolder + '/js/vendors/' + file.name));
      }
      else {
        gulp.src(file.scripts, { allowEmpty: true })
          .pipe(gulpif('!**/*.min.js', cache(uglify())))
          .pipe(concat(file.name + '.bundles.js'))
          .pipe(gulp.dest(desFolder + '/js/vendors/' + file.name));
      }
    }
  })
  cb()
}

function pluginsVendorsCss (cb) {
  delete require.cache[require.resolve(gulpPluginSrc + 'gulp_plugins_config.js')];
  plugins = require(gulpPluginSrc + 'gulp_plugins_config.js').plugins
  plugins.vendors.map((file, index) => {
    if (file.styles != undefined) {
      gulp.src(file.styles, { allowEmpty: true })
        .pipe(concat(file.name + '.bundles.css'))
        .pipe(gulp.dest(desFolder + '/css/vendors/' + file.name));
    }
  })
  return cb()
}

function pluginsBundlesJS (cb) {
  delete require.cache[require.resolve(gulpPluginSrc + 'gulp_plugins_config.js')];
  plugins = require(gulpPluginSrc + 'gulp_plugins_config.js').plugins
  pluginsBundlesJsVal = [];
  plugins.bundles.forEach((item) => {
    if (item.scripts != []) {
      pluginsBundlesJsVal = pluginsBundlesJsVal.concat(item.scripts);
    }
  });
  if (pluginsBundlesJsVal.length > 0) {
    return gulp.src(pluginsBundlesJsVal, { allowEmpty: true })
      .pipe(concat('bundles.js'))
      .pipe(gulpif('!**/*.min.js', cache(uglify({
        // output: {comments: true},
        compress: { hoist_funs: false }
      }))))
      .pipe(gulp.dest(desFolder + '/js'));
  }
  cb();
}

function pluginsBundlesCss (cb) {
  delete require.cache[require.resolve(gulpPluginSrc + 'gulp_plugins_config.js')];
  plugins = require(gulpPluginSrc + 'gulp_plugins_config.js').plugins
  plugins.bundles.forEach((item) => {
    if (item.styles != undefined) {
      pluginsBundlesCssVal = pluginsBundlesCssVal.concat(item.styles)

    }
  });
  if (pluginsBundlesCssVal.length > 0) {
    return gulp.src(pluginsBundlesCssVal, { allowEmpty: true })
      .pipe(concat('bundles.css'))
      .pipe(gulp.dest(desFolder + '/css'));
  }
  cb();
}

function pluginsInitJS (cb) {
  delete require.cache[require.resolve(gulpPluginSrc + 'gulp_plugins_config.js')];
  plugins = require(gulpPluginSrc + 'gulp_plugins_config.js').plugins
  var pluginsInitJsVal = [];
  plugins.bundles.forEach((item) => {
    if (item.init != [] && item.init != undefined) {
      pluginsInitJsVal = pluginsInitJsVal.concat(item.init);
    }
  });
  if (pluginsInitJsVal.length > 0) {
    return gulp.src(pluginsInitJsVal, { allowEmpty: true })
      .pipe(concat('bundles.init.js'))
      .pipe(gulp.dest(desFolder + '/js'));
  }
  cb();
}

function pluginsVendorsInitJS (cb) {
  delete require.cache[require.resolve(gulpPluginSrc + 'gulp_plugins_config.js')];
  plugins = require(gulpPluginSrc + 'gulp_plugins_config.js').plugins
  plugins.vendors.map((file, index) => {
    if (file.init != undefined) {
      gulp.src(file.init, { allowEmpty: true })
        .pipe(concat(file.name + '.init.js'))
        .pipe(gulp.dest(desFolder + '/js/vendors/' + file.name));
    }
  })
  return cb()
}

var customCssFiles = [
  defSourceName + '/custom/css/custom.css',
  defSourceName + '/custom/css/component.css',
]

function customCss () {
  if (argv.src) {
    var srcArr = [customCssSrcName + '/custom/css/**/*.css', themeSourceName + '/theme-custom/css/**/*.css']
  }
  else {
    var srcArr = [customCssSrcName + '/custom/css/**/*.css']
  }
  return gulp.src(srcArr)
    .pipe(sourcemaps.init())
    .pipe(changed(customCssSrcName + '/custom/css/**/*.css'))
    .pipe(replace('/' + desFolderName + '/', '../'))
    .pipe(concat('custom.bundles.css'))
    .pipe(postcss(postCssPlugins))
    .pipe(sourcemaps.write('./map'))
    .pipe(gulp.dest(desFolder + '/css'))
    .pipe(browserSync.stream({ match: '**/*.css' }));
}

function customJs () {
  if (argv.src) {
    var srcArr = [defSourceName + '/custom/js/*.js', themeSourceName + '/theme-custom/js/*.js']
  }
  else {
    var srcArr = [defSourceName + '/custom/js/*.js']
  }
  return gulp.src(srcArr)
    .pipe(changed(defSourceName + '/custom/js/*.js'))
    .pipe(gulp.dest(desFolder + '/js'))
}

function style () {
  //1. where is my scss file
  return gulp.src(customScssSrcName + '/scss/**/*.scss')
    //2. pass file through sass compiler
    .pipe(sourcemaps.init({ largeFile: true }))
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write('./map'))
    //3. where do i save the compiled css?
    .pipe(gulp.dest(desFolder + '/css'))
    //4. stream changes to all browser changes
    .pipe(browserSync.stream({ match: '**/*.css' }));
}

function cleanHtml () {
  // var options = {
  //   function (entry1, entry2, state, level, relativePath, options, statistics, diffSet, reason)
  // };
  var right = [];
  var left = [];
  return dircompare.compare(sourceName + '/pages/', desFolder + '/pages/')
    .then(res => {
      res.diffSet.forEach(dif => {
        var nameMain = dif.state == 'left' ? dif.name1 : dif.name2;
        var name = dif.relativePath.replace(/(\\)/, '') + '/' + nameMain;
        dif.state == 'left' && dif.type1 == 'file' ? left.push(name.replace('.njk', '')) : '';
        dif.state == 'right' && dif.type2 == 'file' ? right.push(name.replace('.html', '')) : '';
        dif.state == 'right' && dif.type2 == 'directory' ? del(desFolder + '/pages/' + dif.name2) : '';
      });
      right.diff(left).forEach(item => {
        del(desFolder + '/pages' + item + '.html')
      });
    }
    )
    .catch(error => console.error(error));
}

function cleanMedia (cb) {
  function cleanMediaTemp (src, des) {
    dircompare.compare(src, des, { ignoreCase: true })
      .then(res => res.diffSet.forEach(dif => {
        if (!dif.relativePath.includes('icons-color')) {
          if (!(dif.name2 == 'custom-media' && dif.type2 == 'directory')) {
            dif.type1 == 'missing' ? del(dif.path2.replace(/(\\)/, '') + '/' + dif.name2) : ''
          }
        }
      })
      )
      .catch(error => console.error(error));
  }
  cleanMediaTemp(defSourceName + '/media/', desFolder + '/media/')
  if (fs.existsSync(desFolder + '/custom-media/')) {
    cleanMediaTemp(themeSourceName + '/theme-custom/media/', desFolder + '/media/custom-media/')
  }
  cb();
}

function renameMedia (cb) {
  function renameMediaTemp (src, des) {
    gulp.src(src, { allowEmpty: true })
      .pipe(changed(defSourceName + '/media/**/*'))
      .pipe(rename(function (path) {
        path.basename = path.basename.toLowerCase();
      }))
      .pipe(gulp.dest(des));
  }
  renameMediaTemp([defSourceName + '/media/**/*'], defSourceName + '/media/')
  if (fs.existsSync(themeSourceName + '/theme-custom/media/')) {
    renameMediaTemp([themeSourceName + '/theme-custom/media/**/*'], themeSourceName + '/media/custom/')
  }
  if (fs.existsSync(themeSourceName + '/media') && argv.src) {
    renameMediaTemp(themeSourceName + '/media/', desFolder + '/media')
  }
  cb();
}

function media (cb) {
  function mediaTemp (src, des) {
    gulp.src(src, { allowEmpty: true })
      .pipe(changed(desFolder + '/media/**/*'))
      .pipe(rename(function (path) {
        path.basename = path.basename.toLowerCase();
      }))
      .pipe(gulp.dest(des))
  }
  mediaTemp([defSourceName + '/media/**/*', '!' + defSourceName + '/media/icons-color/**/*'], desFolder + '/media/')
  if (fs.existsSync(themeSourceName + '/theme-custom/media/')) {
    mediaTemp([themeSourceName + '/theme-custom/media/**/*'], desFolder + '/media/custom-media/')
  }
  cb();
}
function imageMinifyTemp (src, des) {
  gulp.src(src)
    .pipe(cache(image({
      pngquant: ['--quality=70-80', '--speed=1'],
      optipng: false,
      zopflipng: true,
      jpegRecompress: false,
      mozjpeg: ['-quality', 90],
      gifsicle: true,
      svgo: false,
      concurrent: 10,
      quiet: true // defaults to false
    })))
    .pipe(cache(rename(function (path) {
      path.basename = path.basename.toLowerCase();
    })))
    .pipe(replace('vector-effect="non-scaling-stroke"', ''))
    .pipe(replace('stroke-width="1.5"', 'stroke-width="1.5" vector-effect="non-scaling-stroke"'))
    .pipe(gulp.dest(des))
}

function imageMinify (cb) {
  imageMinifyTemp([defSourceName + '/media/**/*', '!' + defSourceName + '/media/icons-color/**/*'], desFolder + '/media/')
  if (fs.existsSync(themeSourceName + '/theme-custom/media/')) {
    imageMinifyTemp([themeSourceName + '/theme-custom/media/**/*'], desFolder + '/media/custom-media/')
  };
  cb();
}

function imageMinifyTheme (cb) {
  if (fs.existsSync(themeSourceName + '/media') && argv.src) {
    setTimeout(function () {
      imageMinifyTemp(themeSourceName + '/media/**/*', desFolder + '/media')
    }, 300)
  }
  if (fs.existsSync(themeSourceName + '/color-theme/' + argv.colorTheme + '/theme-custom/media')) {
    setTimeout(function () {
      imageMinifyTemp([themeSourceName + '/color-theme/' + argv.colorTheme + '/theme-custom/media/**/*'], desFolder + '/media/custom-media/')
    }, 300)
  }
  if (fs.existsSync(themeSourceName + '/color-theme/' + argv.colorTheme + '/media') && argv.colorTheme) {
    setTimeout(function () {
      imageMinifyTemp(themeSourceName + '/color-theme/' + argv.colorTheme + '/media/**/*', desFolder + '/media')
    }, 500)
  }
  cb();
}

function snippetMacrosString (shortName, fullName, varName) {
  var str = '\t"🍪' + shortName + '": {\n' +
    '\t\t"scope": "nunjucks",\n' +
    '\t\t"prefix": [\n' +
    '\t\t\t"' + fullName + '",\n' +
    '\t\t\t"' + shortName + '"\n' +
    '\t\t],\n' +
    '\t\t"body": [\n' +
    '\t\t\t"{{ ' + fullName + '(${1}) }}"\n' +
    '\t\t],\n' +
    '\t\t"description": "Nunjucks ' + fullName + '"\n' +
    '\t},\n';
  if (varName) {
    str += '\t"🍺' + shortName + ' varibles": {\n' +
      '\t\t"scope": "nunjucks",\n' +
      '\t\t"prefix": [\n' +
      '\t\t\t"' + fullName + '.var",\n' +
      '\t\t\t"' + shortName + '.var"\n' +
      '\t\t],\n' +
      '\t\t"body": [\n' +
      '\t\t\t"${1|' + varName + '|}"\n' +
      '\t\t],\n' +
      '\t\t"description": "Nunjucks ' + fullName + ' varibles"\n' +
      '\t},\n';
  }

  return str;
}

function snippetComponentString (fullName, content) {
  var str = '\t"🍤' + fullName + '": {\n' +
    '\t\t"scope": "nunjucks",\n' +
    '\t\t"prefix": [\n' +
    '\t\t\t"' + fullName + '"\n' +
    '\t\t],\n' +
    '\t\t"body": [\n' +
    '\t\t\t' + content + '\n' +
    '\t\t],\n' +
    '\t\t"description": "Nunjucks ' + fullName + '"\n' +
    '\t},\n';
  return str;
}

function snippetMacros () {
  var macros = [];
  var contentFile;
  var importNameMap = {};
  var snippetStr = '';
  var files = glob.sync(sourceName + '/_imports/macros/**/*.njk');
  var baseFile = fs.readFileSync(sourceName + '/_imports/based/_based.njk', 'utf8');
  importName = baseFile.match(/(?<={% import ")(.*)(?=" as)/g);
  importNameAlias = baseFile.match(/(?<=" as )(.*)(?= %})/g);
  importName.forEach((value, index) => {
    var value = path.parse(value).name;
    importNameMap[value] = importNameAlias[index]
  });
  files.forEach(element => {
    var fileName = path.parse(element).name;
    fileName = importNameMap[fileName];
    var content = fs.readFileSync(element, 'utf8');
    content = content.replace(/{% macro /g, '{% macro ' + fileName + '.')
    contentFile += content
  });
  macros = contentFile.match(/(?<={% macro)(.*)(?=%})/g);
  macros = macros.map(str => ({
    name: path.parse(str.match(/[^(]*/g)[0].trim()).ext.replace('.', ''),
    fullName: str.match(/[^(]*/g)[0].trim(),
    varName: str.trim().match(/(?<=\()(.*)(?=\))/g)[0].replace(/, /g, ',').replace(/ ,/g, ',').replace(/"/g, '\\"')
  }));
  macros.forEach(element => {
    snippetStr += snippetMacrosString(element.name, element.fullName, element.varName)
  });
  return snippetStr = '//generated-snippet\n' + snippetStr + '\t//end-generated-snippet'
}

function snippetComponent () {
  var file = fs.readFileSync(sourceName + '/pages/components.njk', 'utf8');
  var snippetStr = '';
  var contentStr
  file = file.match(/({# snippet)([\S\s]*?)({# endSnippet #})/g)
  file = file.map(value => {
    var rObj = {};
    rObj['name'] = value.match(/(?<={# snippet)(.*)(?=#})/g)[0].trim();
    rObj['content'] = '';
    var content = value.match(/(?<=#})([\S\s]*?)(?={#)/g)[0].replace("extendAttr = 'required',", '').trim().replace(/"/g, '\\"');
    content = content.split(/\r?\n/);
    content.forEach((element, index) => {
      var str = '"' + element.trim() + '",';
      if (index != 0) {
        str = "\t\t\t" + str
      }
      if (index != content.length - 1) {
        str += '\n'
      }
      rObj['content'] += str
    });
    return rObj;
  });
  file.forEach(element => {
    snippetStr += snippetComponentString(element.name, element.content)
  });
  return snippetStr = '//component-snippet\n' + snippetStr + '\t//end-component-snippet'
}

function snippet () {
  var snippetMacrosStr = snippetMacros();
  var snippetComponentStr = snippetComponent();
  return gulp.src(['./.vscode/njk-snippet.code-snippets'])
    .pipe(replace(/(\/\/generated-snippet)([\S\s]*?)(\/\/end-generated-snippet)/, snippetMacrosStr))
    .pipe(replace(/(\/\/component-snippet)([\S\s]*?)(\/\/end-component-snippet)/, snippetComponentStr))
    .pipe(gulp.dest('./.vscode/'));
}

function iconLink () {
  delete require.cache[require.resolve(gulpThemeSrc + 'gulp_icons-color-config.js')];
  var themeIcon = require(gulpThemeSrc + 'gulp_icons-color-config').themeIconColor;
  themeIcon = '{# icon-color-njk #}\n{% set colorIconName = [\n' + JSON.stringify(themeIcon, null, '\t') + '\n] %}\n{# end-icon-color-njk #}'

  var mediaTree = dirTree(desFolder + '/media/', { exclude: /icons-color/, normalizePath: true });
  mediaTree = JSON.stringify(mediaTree, null, '\t').replace(new RegExp(`${desFolderName}/`, 'g'), '');
  var njkMediaVarName = 'linkMedia'
  var njkMediaTree = '{# link-media-njk #}\n{% set ' + njkMediaVarName + ' = [\n' + mediaTree + '\n] %}\n{# end-link-media-njk #}'

  var iconColorTree = dirTree(defSourceName + '/media/icons-color/', { normalizePath: true });
  iconColorTree = JSON.stringify(iconColorTree, null, '\t').replace(new RegExp(`${sourceFolderName}/`, 'g'), '');
  var njkIconColorVarName = 'linkIconColor'
  var njkIconColorTree = '{# link-icon-color-njk #}\n{% set ' + njkIconColorVarName + ' = [\n' + iconColorTree + '\n] %}\n{# end-link-icon-color-njk #}'

  return gulp.src([sourceName + '/dev-only/devSrc/_dev-gen-varibles.njk'], { base: sourceName + '/' })
    .pipe(replace(/({# link-media-njk #})([\S\s]*?)({# end-link-media-njk #})/, njkMediaTree))
    .pipe(replace(/({# icon-color-njk #})([\S\s]*?)({# end-icon-color-njk #})/, themeIcon))
    .pipe(replace(/({# link-icon-color-njk #})([\S\s]*?)({# end-link-icon-color-njk #})/, njkIconColorTree))
    .pipe(gulp.dest(sourceName + '/'));
}

function iconColor (cb) {
  delete require.cache[require.resolve(gulpThemeSrc + 'gulp_icons-color-config.js')];
  var themeIcon = require(gulpThemeSrc + 'gulp_icons-color-config').themeIconColor;
  var themeIconProps = require(gulpThemeSrc + 'gulp_icons-color-config').themeIconProps;
  var themeIconBase = new RegExp(themeIcon.default, "ig");
  var themeIconStroke = 'stroke-width="' + themeIconProps.stroke + '"';

  for (var item in themeIcon) {
    gulp.src(defSourceName + '/media/icons-color/**/*.svg')
      .pipe(rename(function (path) {
        path.basename = path.basename.toLowerCase();
      }))
      .pipe(replace(themeIconBase, themeIcon[item]))
      .pipe(replace('vector-effect="non-scaling-stroke"', ''))
      .pipe(replace('</svg>', '<style type="text/css" media="screen">path{vector-effect:non-scaling-stroke}</style></svg>'))
      .pipe(replace(/(stroke-width=")([\S\s]*?)(")/, themeIconStroke))
      .pipe(gulp.dest(desFolder + '/media/icons-color/' + item))
  }

  cb()
}

function cleanIconColor (cb) {
  delete require.cache[require.resolve(gulpThemeSrc + 'gulp_icons-color-config.js')];
  var themeIconColor = require(gulpThemeSrc + 'gulp_icons-color-config').themeIconColor;
  var print = function (err, files) {
    for (var item in files) {
      if (!themeIconColor[files[item]]) {
        del(desFolder + '/media/icons-color/' + files[item])
      }
    }
  };

  fs.readdir(desFolder + '/media/icons-color/', print);
  for (var item in themeIconColor) {
    dircompare.compare(defSourceName + '/media/icons-color/', desFolder + '/media/icons-color/' + item + '/', { ignoreCase: true })
      .then(res => res.diffSet.forEach(dif => {
        dif.type1 == 'missing' ? del(dif.path2.replace(/(\\)/, '') + '/' + dif.name2) : ''
      })
      )
      .catch(error => console.error(error));
  }
  cb();
}

function dataTest () {
  return gulp.src(sourceName + '/**/*.html')
    .pipe(cache(data(function (file) {
      return console.log(path.relative(process.cwd(), file.path).replace(/([^\\]+)/g, '..').slice(0, -4));
    })))
}

var manageEnvironment = function (environment) {
  environment.addFilter('isStr', something => typeof something == 'string')
  environment.addFilter('isArr', something => Array.isArray(something))
  environment.addFilter('isDict', something => something.constructor == Object ? true : false)
  environment.addFilter('setAttribute', function (dictionary, key, value) {
    dictionary[key] = value;
    return dictionary;
  });
  environment.addFilter('mergeDeep', function (dictionary, dictionary1) {
    return _.defaultsDeep(dictionary, dictionary1);
  })
}

function devOnly () {
  return gulp.src([sourceName + '/dev-only/devSrc/**/*'])
    .pipe(gulp.dest(desFolder + '/dev-only/devSrc/'))
    .pipe(browserSync.stream({ match: '**/*.css' }));
}

function nunjucksDev () {
  return gulp.src([sourceName + '/dev-only/**/*.njk', '!' + sourceName + '/dev-only/devSrc/**/*.njk'])
    .pipe(data(function (file) {
      return {
        baseLink: path.relative(process.cwd(), file.path).replace(/([^\\]+)/g, '..').slice(0, -4)
      }
    }))
    .pipe(data(function (file) {
      if (!argv.colorTheme) {
        var colorThemeName = 'default'
      } else {
        var colorThemeName = argv.colorTheme
      }
      return {
        file_path: path.relative(process.cwd(), file.path).replace(sourceFolderName + '\\pages\\', '').replace('.njk', '.html').replace(/\\/g, '\/'),
        theme: argv.src,
        colorTheme: colorThemeName
      }
    }))
    .pipe(nunjucksRender({
      path: [sourceName + '/dev-only/', sourceName + '/dev-only/devSrc/', sourceName + '/_imports/'],
      manageEnv: manageEnvironment,
      envOptions: {
        autoescape: false
      }
    }))
    .pipe(replace(`/${desFolderName}/`, ''))
    .pipe(replace(`/dist/`, ''))
    .pipe(replace(/"[^"]*(?:""[^"]*)*"/g, function (m) { return m.replace(/\r?\n|\r/g, ' '); }))
    .pipe(replace(/  +/g, ' '))
    .pipe(replace(' "', '"'))
    .pipe(replace('=" ', '="'))
    .pipe(replace('"/pages', '"pages'))
    .pipe(htmlbeautify(options))
    .pipe(gulp.dest(desFolder + '/dev-only'));
}

function nunjucks () {
  return gulp.src([sourceName + '/**/*.njk', '!' + sourceName + '/_imports/**/*.njk', '!' + sourceName + '/dev-only/**/*.njk'])
    .pipe(cached())
    .pipe(data(function (file) {
      return {
        baseLink: path.relative(process.cwd(), file.path).replace(/([^\\]+)/g, '..').slice(0, -4)
      }
    }))
    .pipe(data(function (file) {
      if (!argv.colorTheme) {
        var colorThemeName = 'default'
      } else {
        var colorThemeName = argv.colorTheme
      }
      return {
        file_path: path.relative(process.cwd(), file.path).replace(sourceFolderName + '\\pages\\', '').replace('.njk', '.html').replace(/\\/g, '\/'),
        theme: argv.src,
        colorTheme: colorThemeName
      }
    }))
    .pipe(nunjucksRender({
      path: [sourceName + '/_imports/', sourceName + '/pages/'],
      manageEnv: manageEnvironment,
      envOptions: {
        autoescape: false
      }
    }))
    .pipe(replace(`/${desFolderName}/`, ''))
    .pipe(replace(`/dist/`, ''))
    .pipe(replace(/"[^"]*(?:""[^"]*)*"/g, function (m) { return m.replace(/\r?\n|\r/g, ' '); }))
    .pipe(replace(/  +/g, ' '))
    .pipe(replace(' "', '"'))
    .pipe(replace('=" ', '="'))
    .pipe(replace('"/pages', '"pages'))
    .pipe(htmlbeautify(options))
    .pipe(gulp.dest(desFolder + ''));
}

function nunjucksForce () {
  return gulp.src([sourceName + '/**/*.njk', '!' + sourceName + '/_imports/**/*.njk', '!' + sourceName + '/dev-only/**/*.njk'])
    .pipe(data(function (file) {
      return {
        baseLink: path.relative(process.cwd(), file.path).replace(/([^\\]+)/g, '..').slice(0, -4)
      }
    }))
    .pipe(data(function (file) {
      if (!argv.colorTheme) {
        var colorThemeName = 'default'
      } else {
        var colorThemeName = argv.colorTheme
      }
      return {
        file_path: path.relative(process.cwd(), file.path).replace(sourceFolderName + '\\pages\\', '').replace('.njk', '.html').replace(/\\/g, '\/'),
        theme: argv.src,
        colorTheme: colorThemeName
      }
    }))
    .pipe(nunjucksRender({
      path: [sourceName + '/_imports/', sourceName + '/pages/'],
      manageEnv: manageEnvironment,
      envOptions: {
        autoescape: false
      }
    }))
    .pipe(replace(`/${desFolderName}/`, ''))
    .pipe(replace(`/dist/`, ''))
    .pipe(replace(/"[^"]*(?:""[^"]*)*"/g, function (m) { return m.replace(/\r?\n|\r/g, ' '); }))
    .pipe(replace(/  +/g, ' '))
    .pipe(replace(' "', '"'))
    .pipe(replace('=" ', '="'))
    .pipe(replace('"/pages', '"pages'))
    .pipe(htmlbeautify(options))
    .pipe(gulp.dest(desFolder + ''));
}

function fontSrc () {
  del(desFolder + '/fonts/main/*')
  return gulp
    .src(sourceName + '/fonts/**/*')
    .pipe(gulp.dest(desFolder + '/fonts/main'));
}


function lowercaseFiles () {
  return gulp.src(sourceName + '/media/svg-new/**/*')
    .pipe(rename(function (path) {
      path.basename = path.basename.toLowerCase().replace(' 24px', '');
      path.extname = path.extname.toLowerCase();
    }))
    .pipe(gulp.dest(sourceName + '/media/svg-export/dark'));
}


// end test section
// production task
function babeljs () {
  return gulp.src(defSourceName + '/custom/**/*.js')
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(gulp.dest(desFolder))
}

function promptMes (cb) {
  var schema = {
    properties: {
      commit: {
        message: 'Enter commit message: ',
        required: true
      }
    }
  };
  prompt.start();
  prompt.get(schema, function (err, result) {
    commitMessage = result.commit
    cb()
  });
}

function gitAdd () {
  return gulp.src(desFolder + '/**/*.css')
    .pipe(git.add({ args: '-A' }));
}

function gitAddAll () {
  return gulp.src(rootSrc)
    .pipe(git.add({ args: ':!.vscode/*' }));
}

function gitCommit () {
  commitMessage != '' ? commitMessage : commitMessage = 'commit'
  return gulp.src('.')
    .pipe(git.commit(commitMessage, {
      disableAppendPaths: true
    }));
}

function gitCommitAll () {
  commitMessage != '' ? commitMessage : commitMessage = 'commit'
  return gulp.src('.')
    .pipe(git.commit(commitMessage, { args: ':!.vscode/*' }));
}

function gitPull (cb) {
  git.pull('origin', 'master', function (err) {
    if (err) throw err;
  });
  cb()
}

function gitPush (cb) {
  git.push('origin', 'master', { args: " -f" }, function (err) {
    if (err) throw err;
  });
  cb()
}

function yarnInstall () {
  return gulp.src(['./package.json', './yarn.lock'])
    .pipe(cache(yarn()));
}

function htmlBeauty () {
  return gulp.src(desFolder + '/**/*.html')
    .pipe(htmlbeautify(options))
    .pipe(gulp.dest(desFolder + ''))
}

function purge () {
  return gulp.src([staticFolder + '/**/*.css', '!' + staticFolder + '/dev-only/**/*'])
    .pipe(purgecss({
      content: [staticFolder + '/**/*.{html,js,xml}'],
      whitelistPatternsChildren: [/las/, /lar/, /lab/, /la-/, /.tooltip/, /modal/, /d-block/, /col/, /select2/, /cr-vp-circle/, /swiper/, /noUi/, /medium-zoom/]
    }))
    .pipe(gulp.dest(staticFolder + '/'))
}

function prefixCss () {
  return gulp.src([desFolder + '/**/*.css', '!' + desFolder + '/dev-only/**/*'])
    .pipe(replace(`/${desFolderName}/`, '../'))
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(gulp.dest(desFolder + '/'));
}

function minifyCss () {
  return gulp.src([staticFolder + '/**/*.css', '!' + staticFolder + '/dev-only/**/*'])
    .pipe(cleanCSS())
    .pipe(gulp.dest(staticFolder + '/'));
}

function rev (cb) {
  var globs = [
    staticFolder + '/**/*'
  ];
   del('./.temp/' + staticFolderName);
  return gulp.src(globs)
    .pipe(RevAll.revision({ dontRenameFile: [/^\/favicon.ico$/g, ".html"], dontUpdateReference: [/^\/favicon.ico$/g, ".html"] }))
    .pipe(dest('./.temp/' + staticFolderName));
}

function pushFtp (cb) {
  var conn = ftp.create({
    host: process.env.FTP_HOST,
    user: process.env.FTP_USER,
    password: process.env.FTP_PASS,
    parallel: 3,
    log: gutil.log
  });
  console.log(`src: ./.temp/${staticFolderName}`)
  console.log(`dest: ${process.env.FTP_PATH}/${staticFolderName}`)

  conn.rmdir(process.env.FTP_PATH + `/${staticFolderName}`, function () {
    gulp.src('./.temp/' + staticFolderName + '/**/*')
      .pipe(conn.dest(process.env.FTP_PATH + `/${staticFolderName}`));
  });
  cb()
}

// end production task
function watch () {
  var currentPort = ''
  browserSync.init({
    open: false,
    snippetOptions: {
      ignorePaths: "dev-only/**/*"
    },
    server: {
      baseDir: desFolder + '/'
    },
    ghostMode: false,
    callbacks: {
      ready: function (err, bs) {
        currentPort = bs.options.get('port');
        gulp.src(['./.vscode/settings.json'])
          .pipe(replace(/(?<=\"vscode-opn.webServerPort\":)(.*)(?=,)/, ' ' + currentPort))
          .pipe(gulp.dest('./.vscode/'));
      }
    }
  });
  gulp.watch(customScssSrcName + '/scss/**/*.scss', style);
  gulp.watch(gulpPluginSrc + 'gulp_plugins_config.js', parallel(pluginsBundlesJS, pluginsBundlesCss, pluginsInitJS, series(cleanVendorsJs, parallel(pluginsVendorsJS, pluginsVendorsCss, pluginsVendorsInitJS))))
  gulp.watch('**/gulp_themes_config.js', theme)
  gulp.watch(gulpThemeSrc + 'gulp_icons-color-config.js', series(iconColor, iconLink, imageMinifyTheme))
  gulp.watch(sourceName + '/plugins/**/*', parallel(pluginsBundlesCss, pluginsBundlesJS, pluginsVendorsJS, pluginsVendorsCss))
  gulp.watch([defSourceName + '/media/**/*', themeSourceName + '/theme-custom/media/**/*', themeSourceName + `/color-theme/${argv.colorTheme}/media/**/*`, themeSourceName + '/media/', '!' + defSourceName + '/media/icons-color/**/*'], series(media, imageMinify, iconLink, iconLink, imageMinifyTheme))
  gulp.watch(defSourceName + '/media/icons-color/**/*', series(iconColor, iconLink, imageMinifyTheme));
  gulp.watch(defSourceName + '/dev-only/devSrc/**/*', devOnly)
  gulp.watch([sourceName + '/dev-only/**/*.njk', sourceName + '/_imports/_gen-varibles.njk'], nunjucksDev)
  gulp.watch(sourceName + '/js/**/*', parallel(pluginsInitJS, pluginsVendorsInitJS))
  gulp.watch([defSourceName + '/custom/**/*.js', themeSourceName + '/theme-custom/js/**/*.js'], customJs)
  gulp.watch(themeSourceName + '/fonts/**/*', fontSrc)
  gulp.watch([customCssSrcName + '/custom/**/*.css', themeSourceName + '/theme-custom/css/**/*.css'], customCss)
  gulp.watch([sourceName + '/**/*.{html,njk}', '!' + sourceName + '/dev-only/**/*.njk'], nunjucks)
  gulp.watch([sourceName + '/_imports/macros/**/*.{html,njk}', sourceName + '/pages/components.njk'], snippet);
  gulp.watch(sourceName + '/_imports/**/*.{html,njk}', nunjucksForce);
  gulp.watch([defSourceName + '/media/**/*', themeSourceName + '/theme-custom/media/**/*', '!' + defSourceName + '/media/icons-color/**/*']).on('unlink', function (path) {
    del(path.replace(themeSourceFolderName + '\\', desFolderName + '\\').toLowerCase())
  });
  gulp.watch(sourceName + '/**/*.{html,njk}').on('unlink', function (path) {
    del(path.replace(sourceFolderName + '\\', desFolderName + '\\').replace('.njk', '.html'))
  });
  gulp.watch(sourceName + '/**/*.{html,njk}').on('unlink', function (path) {
    del(path.replace(sourceFolderName + '\\', desFolderName + '\\').replace('.njk', '.html'))
  });
  gulp.watch([desFolder + '/**/*.html', '!' + desFolder + '/dev-only{,/**}']).on('change', browserSync.reload);
  gulp.watch([desFolder + '/js/**/*.js', '!' + desFolder + '/dev-only{,/**}']).on('change', browserSync.reload);
  gulp.watch([desFolder + '/dev-only/devSrc/**.js']).on('change', browserSync.reload);
}

function clearCache () {
  return cache.clearAll()
}

exports.style = style;
exports.cleanMedia = cleanMedia;
exports.cleanHtml = cleanHtml;
exports.media = media;
exports.imageMinify = imageMinify;
exports.clearCache = clearCache;
exports.dataTest = dataTest;
exports.pluginsBundles = parallel(pluginsBundlesCss, pluginsBundlesJS);
exports.nunjucks = nunjucks;
exports.nunjucksForce = nunjucksForce;
exports.customCss = customCss;
exports.htmlBeauty = htmlBeauty;
exports.watch = watch;
exports.purgeCss = series(purge, minifyCss);
exports.prefixCss = prefixCss;
exports.pluginsVendorsJS = pluginsVendorsJS;
exports.pluginsVendors = series(pluginsVendorsJS, pluginsVendorsCss);
exports.pluginsInitJS = pluginsInitJS;
exports.pluginsVendorsInitJS = pluginsVendorsInitJS;
exports.rev = rev;
exports.yarnInstall = yarnInstall;
exports.gitCommit = gitCommit;
exports.gitPull = gitPull;
exports.gitPush = gitPush;
exports.gitAdd = gitAdd;
exports.babeljs = babeljs;
exports.fontSrc = fontSrc;
exports.lowercaseFiles = lowercaseFiles;
exports.browserifyJs = browserifyJs;
exports.theme = theme;
exports.themeGenerator = themeGenerator;
exports.postCss = postCss;
exports.iconColor = iconColor;
exports.cleanIconColor = cleanIconColor;
exports.iconLink = iconLink;
exports.devOnly = devOnly;
exports.nunjucksDev = nunjucksDev;
exports.snippet = snippet;
exports.renameMedia = renameMedia;
exports.genVarFiles = genVarFiles;
exports.genStatic = genStatic;
exports.gitAddAll = gitAddAll;
exports.purge = purge;
exports.settings = settings;
exports.buildTheme = buildTheme;
exports.pushFtp = pushFtp;
exports.rev = rev;
exports.cssDiffer = cssDiffer;

exports.devTheme = series(yarnInstall, settings, genVarFiles, theme, parallel(devOnly, snippet, series(iconColor, cleanMedia, cleanIconColor, imageMinify, iconColor, cleanMedia, iconLink, cleanIconColor), style, parallel(pluginsBundlesCss, pluginsBundlesJS), series(cleanVendorsJs, parallel(pluginsVendorsJS, pluginsVendorsCss, pluginsVendorsInitJS)), fontSrc, pluginsInitJS, customCss, customJs, series(cleanHtml, nunjucks, htmlBeauty)), imageMinifyTheme, prefixCss, genStatic, purge, minifyCss);

exports.pushFtpTheme = series(rev, pushFtp)

exports.dev = series(yarnInstall, settings, genVarFiles, theme, parallel(devOnly, snippet, series(iconColor, cleanMedia, cleanIconColor, imageMinify, iconColor, cleanMedia, iconLink, cleanIconColor), style, parallel(pluginsBundlesCss, pluginsBundlesJS), series(cleanVendorsJs, parallel(pluginsVendorsJS, pluginsVendorsCss, pluginsVendorsInitJS)), fontSrc, pluginsInitJS, customCss, customJs, series(cleanHtml, nunjucks, nunjucksDev, htmlBeauty)), imageMinifyTheme, watch);

exports.prod = parallel(snippet, series(cleanHtml, nunjucksForce, htmlBeauty), series(prefixCss, purge, minifyCss), iconColor, iconLink, cleanMedia, cleanIconColor)

exports.deploy = series(promptMes, parallel(snippet, series(cleanHtml, nunjucksForce, htmlBeauty), series(prefixCss, purge, minifyCss), iconColor, iconLink, cleanMedia, cleanIconColor), parallel(snippet, series(gitAdd, gitCommit, gitPull, gitPush), series(rev, pushFtp)))

exports.deployAll = series(genVarFiles, promptMes, parallel(snippet, series(cleanHtml, nunjucksForce, htmlBeauty), iconColor, cleanMedia, iconLink, prefixCss), genStatic, purge, minifyCss, parallel(snippet, series(gitAddAll, gitCommitAll, gitPull, gitPush), series(rev, pushFtp)))

exports.deployFtp = series(genVarFiles, parallel(snippet, series(cleanHtml, nunjucksForce, htmlBeauty), iconColor, cleanMedia, iconLink, prefixCss), genStatic, purge, minifyCss, parallel(snippet, series(rev, pushFtp)))
