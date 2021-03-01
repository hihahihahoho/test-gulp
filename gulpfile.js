//test 3
require('dotenv').config()

var plugins = require('./gulp_plugins_config.js').plugins
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

const browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

const cssbeautify = require('gulp-cssbeautify');

var postcss = require('gulp-postcss');
var cssvariables = require("postcss-css-variables");
var posCssRgb = require("postcss-rgb");

// var favicons = require('gulp-favicons');
var del = require('del');
var iconfont = require('gulp-iconfont');
var runTimestamp = Math.round(Date.now() / 1000);
var iconfontCss = require('gulp-iconfont-css');
var gutil = require('gulp-util');
var ftp = require('vinyl-ftp');
var cachebust = require('gulp-cache-bust');
const filter = require('gulp-filter');
var yarn = require('gulp-yarn');
var git = require('gulp-git');
var process = require("process");
var prompt = require('prompt');
var RevAll = require("gulp-rev-all");

var imgSrc = [];
var imgDes = 'dist';

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

var postCssPlugins = [
  cssvariables(),
  posCssRgb()
];

function postCss () {
  return gulp.src('./dist/css/custom.bundles.css')
    .pipe(postcss(postCssPlugins))
    .pipe(gulp.dest('./dist/css/'));
}


function themeGenerator () {
  return gulp.src('./dist/css/style.css')
    .pipe(cssbeautify())
    .pipe(replace(/^((?!3f3bec|{|}|^(.*[^,])\,$).)*$/gm, ''))
    .pipe(replace(/.*(transition|transform).*/gm, ''))
    .pipe(replace(/\/\*\!/g, ''))
    .pipe(cleanCSS({ level: 2 }))
    .pipe(gulp.dest('./dist/css-test'));
}

function genVarFilesFunc (srcPath, content) {
  if (!fs.existsSync(srcPath)) {
    fs.writeFile(srcPath, content, () => { });
  };
}

function genStatic () {
  return gulp.src(['./dist/**/*','!./dist/dev-only{,/**}'])
    .pipe(gulp.dest('./static/'));
}

function genVarFiles (cb) {
  var importGenPath = './src/_imports/_gen-varibles.njk'
  var importGenContent = '{# gtc-text-njk #}\n{# end-gtc-text-njk #}\n\n{# gtc-color-njk #}\n{# end-gtc-color-njk #}'

  var devGenPath = './src/dev-only/devSrc/_dev-gen-varibles.njk'
  var devGenContent = '{# link-media-njk #}\n{# end-link-media-njk #}\n\n{# icon-color-njk #}\n{# end-icon-color-njk #}\n\n{# link-icon-color-njk #}\n{# end-link-icon-color-njk #}'

  
  var snippetGenPath = './.vscode/njk-snippet.code-snippets'
  var snippetGenContent = '{\n\t//generated-snippet\n//end-generated-snippet\n\n//component-snippet\n/end-component-snippet\n}'

  var scssGenPath = './src/scss/varibles/_gen-varibles.scss'
  var scssGenContent = '//gtc-text-scss\n//end-gtc-text-scss\n\n//gtc-color-scss\n//end-gtc-color-scss'

  var cssGenPath = './src/custom/css/0-gen-varibles.css'
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

function theme () {
  delete require.cache[require.resolve('./gulp_themes_config.js')];
  //theme text
  themeTextMapText = '';
  themeTextVarText = '';
  themeText = require('./gulp_themes_config.js').themeText;
  var themeTextMapText = '\n$map-h-font: ' + JSON.stringify(themeText, null, "\t").replace(/{/g, '(').replace(/}/g, ')') + ';\n';
  for (var property in themeText) {
    themeTextVarText += '$fz-' + property + ': ' + themeText[property]["font-size"] + ';\n';
  }

  var themeTextMapAllText = '//gtc-text-scss' + themeTextMapText + themeTextVarText + '\n//end-gtc-text-scss';

  var themeTextNjk = '{# gtc-text-njk #}\n{% set textName = [\n' + JSON.stringify(themeText, null, "\t") + '\n] %}\n{# end-gtc-text-njk #}';

  //end theme text
  // theme color
  themeColorMapText = '';
  themeColorMapArr = {};

  themeColorVarText = '';
  themeColorVarTextArr = {};

  themeColor = require('./gulp_themes_config.js').themeColor;

  var themeColorNjk = '{# gtc-color-njk #}\n{% set colorName = [\n' + JSON.stringify(themeColor.default, null, "\t") + '\n] %}\n{# end-gtc-color-njk #}';

  for (var property in themeColor.default.normal) {
    var themeColorMap = themeColor.default.normal[property]
    for (var property1 in themeColorMap) {
      themeMapFunction(themeColorMap, property1, property, '$color');
      property1 != 'text' ? themeVarFunction(themeColorMap, property1, property, '$color') : ''
    }
  }
  for (var property in themeColor.default.level) {
    var colorMap = themeColor.default.level[property]
    var colorMap = themeColor.default.normal[colorMap]
    for (var property1 in colorMap) {
      themeMapFunction(colorMap, property1, property, '$color');
      property1 != 'text' ? themeVarFunction(colorMap, property1, property, '$color') : ''
    }
  }
  for (var property in themeColorMapArr) {
    var propertyTxt = '-' + property
    property == 'color' ? propertyTxt = '' : ''
    themeColorMapText += '\n$map-color' + propertyTxt + ': (\n' + themeColorMapArr[property] + ');\n'
  }

  for (var property in themeColorVarTextArr) {
    themeColorVarText += '\n' + themeColorVarTextArr[property] + '\n'
  }
  // end theme color
  themeColorTextAll = '//gtc-color-scss\n' + themeColorVarText + themeColorMapText + '\n//end-gtc-color-scss'
  themeColorTextAllCss = '/*gtc-css*/\n:root {\n' + themeColorVarText.replace(/\$/g, '\t--') + themeTextVarText.replace(/\$/g, '\t--') + '}\n/*end-gtc-css*/';
  return gulp.src(['./src/scss/varibles/_gen-varibles.scss', './src/custom/css/0-gen-varibles.css', './src/_imports/_gen-varibles.njk'], { base: './src/' })
    .pipe(replace(/({# gtc-text-njk #})([\S\s]*?)({# end-gtc-text-njk #})/, themeTextNjk))
    .pipe(replace(/({# gtc-color-njk #})([\S\s]*?)({# end-gtc-color-njk #})/, themeColorNjk))
    .pipe(replace(/(\/\/gtc-text-scss)([\S\s]*?)(\/\/end-gtc-text-scss)/, themeTextMapAllText))
    .pipe(replace(/(\/\/gtc-color-scss)([\S\s]*?)(\/\/end-gtc-color-scss)/, themeColorTextAll))
    .pipe(replace(/(\/\*gtc-css\*\/)([\S\s]*?)(\/\*end-gtc-css\*\/)/, themeColorTextAllCss))
    .pipe(gulp.dest('./src/'))
};

// ----------------------------END THEME----------------------------

function browserifyJs (cb) {
  return browserify('./src/plugins-browserify/uppy/uppy.js')
    .bundle()
    .pipe(source('bundle.js'))
    // Start piping stream to tasks!
    .pipe(gulp.dest('./dist/js/vendors/plugins-browserify/'));
};

function cleanVendorsJs (cb) {
  del('./dist/css/vendors/**', { force: true });
  return del('./dist/js/vendors/**', { force: true });
}

function pluginsVendorsJS (cb) {
  delete require.cache[require.resolve('./gulp_plugins_config.js')];
  plugins = require('./gulp_plugins_config.js').plugins
  plugins.vendors.map((file, index) => {
    if (file.scripts != undefined) {
      if (file.scripts.toString().includes("browserify")) {
        browserify(file.scripts)
          .bundle()
          .pipe(source(file.name + '.bundles.js'))
          .pipe(buffer())
          .pipe(gulpif('!**/*.min.js', cache(uglify())))
          // Start piping stream to tasks!
          .pipe(gulp.dest('./dist/js/vendors/' + file.name));
      }
      else {
        gulp.src(file.scripts, { allowEmpty: true })
          .pipe(gulpif('!**/*.min.js', cache(uglify())))
          .pipe(concat(file.name + '.bundles.js'))
          .pipe(gulp.dest('./dist/js/vendors/' + file.name));
      }
    }
  })
  cb()
}

function pluginsVendorsCss (cb) {
  delete require.cache[require.resolve('./gulp_plugins_config.js')];
  plugins = require('./gulp_plugins_config.js').plugins
  plugins.vendors.map((file, index) => {
    if (file.styles != undefined) {
      gulp.src(file.styles, { allowEmpty: true })
        .pipe(concat(file.name + '.bundles.css'))
        .pipe(gulp.dest('./dist/css/vendors/' + file.name));
    }
  })
  return cb()
}

function pluginsBundlesJS (cb) {
  delete require.cache[require.resolve('./gulp_plugins_config.js')];
  plugins = require('./gulp_plugins_config.js').plugins
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
      .pipe(gulp.dest('./dist/js'));
  }
  cb();
}

function pluginsBundlesCss (cb) {
  delete require.cache[require.resolve('./gulp_plugins_config.js')];
  plugins = require('./gulp_plugins_config.js').plugins
  plugins.bundles.forEach((item) => {
    if (item.styles != undefined) {
      pluginsBundlesCssVal = pluginsBundlesCssVal.concat(item.styles)

    }
  });
  if (pluginsBundlesCssVal.length > 0) {
    return gulp.src(pluginsBundlesCssVal, { allowEmpty: true })
      .pipe(concat('bundles.css'))
      .pipe(gulp.dest('./dist/css'));
  }
  cb();
}

function pluginsInitJS (cb) {
  delete require.cache[require.resolve('./gulp_plugins_config.js')];
  plugins = require('./gulp_plugins_config.js').plugins
  var pluginsInitJsVal = [];
  plugins.bundles.forEach((item) => {
    if (item.init != [] && item.init != undefined) {
      pluginsInitJsVal = pluginsInitJsVal.concat(item.init);
    }
  });
  if (pluginsInitJsVal.length > 0) {
    return gulp.src(pluginsInitJsVal, { allowEmpty: true })
      .pipe(concat('bundles.init.js'))
      .pipe(gulp.dest('./dist/js'));
  }
  cb();
}

function pluginsVendorsInitJS (cb) {
  delete require.cache[require.resolve('./gulp_plugins_config.js')];
  plugins = require('./gulp_plugins_config.js').plugins
  plugins.vendors.map((file, index) => {
    if (file.init != undefined) {
      gulp.src(file.init, { allowEmpty: true })
        .pipe(concat(file.name + '.init.js'))
        .pipe(gulp.dest('./dist/js/vendors/' + file.name));
    }
  })
  return cb()
}

var customCssFiles = [
  './src/custom/css/custom.css',
  './src/custom/css/component.css',
]

function customCss () {
  return gulp.src('./src/custom/css/**/*.css')
    .pipe(sourcemaps.init())
    .pipe(changed('./src/custom/css/**/*.css'))
    .pipe(replace('/dist/', '../'))
    .pipe(concat('custom.bundles.css'))
    .pipe(postcss(postCssPlugins))
    .pipe(sourcemaps.write('./map'))
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.stream({ match: '**/*.css' }));
}

function customJs () {
  return gulp.src('./src/custom/js/*.js')
    .pipe(changed('./src/custom/js/*.js'))
    .pipe(gulp.dest('./dist/js'))
}

function style () {
  //1. where is my scss file
  return gulp.src('./src/scss/**/*.scss')
    //2. pass file through sass compiler
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write('./map'))
    //3. where do i save the compiled css?
    .pipe(gulp.dest('./dist/css'))
    //4. stream changes to all browser changes
    .pipe(browserSync.stream({ match: '**/*.css' }));
}

// function findImages () {
//   return gulp.src('./src/*.{html,css,js}')
//     .pipe(replace(/([^('"]+)\.(jpg|png|jpeg|gif|svg|pdf|mp4)/g, match => {
//       var src = 'src/**/' + match.match(/([^\\\/:*?\"<>|]+)$/g);
//       imgSrc.indexOf(src) === -1 ? imgSrc.push(src) : '';
//     })
//     )
// }
function cleanMedia () {
  return dircompare.compare('./src/media/', './dist/media/', { ignoreCase: true })
    .then(res => res.diffSet.forEach(dif => {
      if (!dif.relativePath.includes('icons-color')) {
        dif.type1 == 'missing' ? del(dif.path2.replace(/(\\)/, '') + '/' + dif.name2) : ''
      }
    })
    )
    .catch(error => console.error(error));
}

function cleanHtml () {
  // var options = {
  //   function (entry1, entry2, state, level, relativePath, options, statistics, diffSet, reason)
  // };
  var right = [];
  var left = [];
  return dircompare.compare('./src/pages/', './dist/pages/')
    .then(res => {
      res.diffSet.forEach(dif => {
        var nameMain = dif.state == 'left' ? dif.name1 : dif.name2;
        var name = dif.relativePath.replace(/(\\)/, '') + '/' + nameMain;
        dif.state == 'left' && dif.type1 == 'file' ? left.push(name.replace('.njk', '')) : '';
        dif.state == 'right' && dif.type2 == 'file' ? right.push(name.replace('.html', '')) : '';
        dif.state == 'right' && dif.type2 == 'directory' ? del('./dist/pages/' + dif.name2) : '';
      });
      right.diff(left).forEach(item => {
        del('./dist/pages' + item + '.html')
      });
    }
    )
    .catch(error => console.error(error));
}

function renameMedia () {
  return gulp.src(['./src/media/**/*'], { allowEmpty: true })
    .pipe(changed('./src/media/**/*'))
    .pipe(rename(function (path) {
      path.basename = path.basename.toLowerCase();
    }))
    .pipe(gulp.dest('src/media/'))
}

function media () {
  return gulp.src(['./src/media/**/*', '!./src/media/icons-color/**/*'], { allowEmpty: true })
    .pipe(changed('./dist/media/**/*'))
    .pipe(rename(function (path) {
      path.basename = path.basename.toLowerCase();
    }))
    .pipe(gulp.dest('./dist/media/'))
}

function imageMinify () {
  return gulp.src(['./src/media/**/*', '!./src/media/icons-color/**/*'])
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
    .pipe(gulp.dest('./dist/media/'))
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
  var files = glob.sync('./src/_imports/macros/**/*.njk');
  var baseFile = fs.readFileSync('./src/_imports/based/_based.njk', 'utf8');
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
  var file = fs.readFileSync('./src/pages/components.njk', 'utf8');
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
  delete require.cache[require.resolve('./gulp-icons-color-config.js')];
  var themeIcon = require('./gulp-icons-color-config').themeIconColor;
  themeIcon = '{# icon-color-njk #}\n{% set colorIconName = [\n' + JSON.stringify(themeIcon, null, '\t') + '\n] %}\n{# end-icon-color-njk #}'

  var mediaTree = dirTree("./dist/media/", { exclude: /icons-color/, normalizePath: true });
  mediaTree = JSON.stringify(mediaTree, null, '\t').replace(/dist\//g, '');
  var njkMediaVarName = 'linkMedia'
  var njkMediaTree = '{# link-media-njk #}\n{% set ' + njkMediaVarName + ' = [\n' + mediaTree + '\n] %}\n{# end-link-media-njk #}'

  var iconColorTree = dirTree("src/media/icons-color/", { normalizePath: true });
  iconColorTree = JSON.stringify(iconColorTree, null, '\t').replace(/src\//g, '');
  var njkIconColorVarName = 'linkIconColor'
  var njkIconColorTree = '{# link-icon-color-njk #}\n{% set ' + njkIconColorVarName + ' = [\n' + iconColorTree + '\n] %}\n{# end-link-icon-color-njk #}'

  return gulp.src(['./src/dev-only/devSrc/_dev-gen-varibles.njk'], { base: './src/' })
    .pipe(replace(/({# link-media-njk #})([\S\s]*?)({# end-link-media-njk #})/, njkMediaTree))
    .pipe(replace(/({# icon-color-njk #})([\S\s]*?)({# end-icon-color-njk #})/, themeIcon))
    .pipe(replace(/({# link-icon-color-njk #})([\S\s]*?)({# end-link-icon-color-njk #})/, njkIconColorTree))
    .pipe(gulp.dest('./src/'));
}

function iconColor (cb) {
  delete require.cache[require.resolve('./gulp-icons-color-config.js')];
  var themeIcon = require('./gulp-icons-color-config').themeIconColor;
  var themeIconProps = require('./gulp-icons-color-config').themeIconProps;
  var themeIconBase = new RegExp(themeIcon.default, "ig");
  var themeIconStroke = 'stroke-width="' + themeIconProps.stroke + '"';

  for (var item in themeIcon) {
    gulp.src('./src/media/icons-color/**/*.svg')
      .pipe(rename(function (path) {
        path.basename = path.basename.toLowerCase();
      }))
      .pipe(replace(themeIconBase, themeIcon[item]))
      .pipe(replace('vector-effect="non-scaling-stroke"', ''))
      .pipe(replace('</svg>', '<style type="text/css" media="screen">path{vector-effect:non-scaling-stroke}</style></svg>'))
      .pipe(replace(/(stroke-width=")([\S\s]*?)(")/, themeIconStroke))
      .pipe(gulp.dest('./dist/media/icons-color/' + item))
  }
  cb()
}

function cleanIconColor (cb) {
  delete require.cache[require.resolve('./gulp-icons-color-config.js')];
  var themeIconColor = require('./gulp-icons-color-config').themeIconColor;
  var print = function (err, files) {
    for (var item in files) {
      if (!themeIconColor[files[item]]) {
        del('./dist/media/icons-color/' + files[item])
      }
    }
  };

  fs.readdir('./dist/media/icons-color/', print);
  for (var item in themeIconColor) {
    dircompare.compare('./src/media/icons-color/', './dist/media/icons-color/' + item + '/', { ignoreCase: true })
      .then(res => res.diffSet.forEach(dif => {
        dif.type1 == 'missing' ? del(dif.path2.replace(/(\\)/, '') + '/' + dif.name2) : ''
      })
      )
      .catch(error => console.error(error));
  }
  cb();
}

function dataTest () {
  return gulp.src('src/**/*.html')
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
  })
}

function devOnly () {
  return gulp.src(['src/dev-only/devSrc/**/*'])
    .pipe(gulp.dest('./dist/dev-only/devSrc/'))
    .pipe(browserSync.stream({ match: '**/*.css' }));
}

function nunjucksDev () {
  return gulp.src(['src/dev-only/**/*.njk', '!src/dev-only/devSrc/**/*.njk'])
    .pipe(data(function (file) {
      return {
        baseLink: path.relative(process.cwd(), file.path).replace(/([^\\]+)/g, '..').slice(0, -4)
      }
    }))
    .pipe(data(function (file) {
      return {
        file_path: path.relative(process.cwd(), file.path).replace('src\\pages\\', '').replace('.njk', '.html').replace(/\\/g, '\/')
      }
    }))
    .pipe(nunjucksRender({
      path: ['src/dev-only/', 'src/dev-only/devSrc/', 'src/_imports/'],
      manageEnv: manageEnvironment
    }))
    .pipe(replace('/dist/', ''))
    .pipe(replace(/"[^"]*(?:""[^"]*)*"/g, function (m) { return m.replace(/\r?\n|\r/g, ' '); }))
    .pipe(replace(/  +/g, ' '))
    .pipe(replace(' "', '"'))
    .pipe(replace('"/pages', '"pages'))
    .pipe(htmlbeautify(options))
    .pipe(gulp.dest('./dist/dev-only'));
}

function nunjucks () {
  return gulp.src(['src/**/*.njk', '!src/_imports/**/*.njk', '!src/dev-only/**/*.njk'])
    .pipe(cached())
    .pipe(data(function (file) {
      return {
        baseLink: path.relative(process.cwd(), file.path).replace(/([^\\]+)/g, '..').slice(0, -4)
      }
    }))
    .pipe(data(function (file) {
      return {
        file_path: path.relative(process.cwd(), file.path).replace('src\\pages\\', '').replace('.njk', '.html').replace(/\\/g, '\/')
      }
    }))
    .pipe(nunjucksRender({
      path: ['src/_imports/', 'src/pages/'],
      manageEnv: manageEnvironment
    }))
    .pipe(replace('/dist/', ''))
    .pipe(replace(/"[^"]*(?:""[^"]*)*"/g, function (m) { return m.replace(/\r?\n|\r/g, ' '); }))
    .pipe(replace(/  +/g, ' '))
    .pipe(replace(' "', '"'))
    .pipe(replace('"/pages', '"pages'))
    .pipe(htmlbeautify(options))
    .pipe(gulp.dest('./dist'));
}

function nunjucksForce () {
  return gulp.src(['src/**/*.njk', '!src/_imports/**/*.njk', '!src/dev-only/**/*.njk'])
    .pipe(data(function (file) {
      return {
        baseLink: path.relative(process.cwd(), file.path).replace(/([^\\]+)/g, '..').slice(0, -4)
      }
    }))
    .pipe(data(function (file) {
      return {
        file_path: path.relative(process.cwd(), file.path).replace('src\\pages\\', '').replace('.njk', '.html').replace(/\\/g, '\/')
      }
    }))
    .pipe(nunjucksRender({
      path: ['src/_imports/', 'src/pages/'],
      manageEnv: manageEnvironment
    }))
    .pipe(replace('/dist/', ''))
    .pipe(replace(/"[^"]*(?:""[^"]*)*"/g, function (m) { return m.replace(/\r?\n|\r/g, ' '); }))
    .pipe(replace(/  +/g, ' '))
    .pipe(replace(' "', '"'))
    .pipe(replace('"/pages', '"pages'))
    .pipe(htmlbeautify(options))
    .pipe(gulp.dest('./dist'));
}
// test section
// function favicon () {
//   return gulp.src('src/media/favicon/favicon.png')
//     .pipe(favicons())
//     .pipe(gulp.dest('dist/media/favicon'))
// }



function icon2font () {
  return gulp.src(['src/font-ic/*.svg'])
    .pipe(iconfontCss({
      fontName: 'base-ic-font',
      fontPath: '',
      cssClass: 'ic-base'
    }))
    .pipe(iconfont({
      fontName: 'base-ic-font',
      prependUnicode: true,
      formats: ['ttf', 'eot', 'woff'],
      timestamp: runTimestamp,
    }))
    .pipe(gulp.dest('./dist/fonts/'));
}

function icon2fontVcb () {
  return gulp.src(['src/font-ic-vcb/*.svg'])
    .pipe(iconfontCss({
      fontName: 'ic-font-vcb',
      fontPath: '',
      cssClass: 'ic-vcb'
    }))
    .pipe(iconfont({
      fontName: 'ic-font-vcb',
      prependUnicode: true,
      formats: ['ttf', 'eot', 'woff'],
      timestamp: runTimestamp,
      normalize: true,
      fontHeight: 1001,
      centerHorizontally: true
    }))
    .pipe(gulp.dest('./dist/fonts-vcb/'));
}

function fontSrc () {
  del('./dist/fonts/main/*')
  return gulp
    .src('./src/fonts/**/*')
    .pipe(gulp.dest('./dist/fonts/main'));
}


function lowercaseFiles () {
  return gulp.src('./src/media/svg-new/**/*')
    .pipe(rename(function (path) {
      path.basename = path.basename.toLowerCase().replace(' 24px', '');
      path.extname = path.extname.toLowerCase();
    }))
    .pipe(gulp.dest('./src/media/svg-export/dark'));
}


// end test section
// production task
function babeljs () {
  return gulp.src('src/custom/**/*.js')
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(gulp.dest('dist'))
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
  return gulp.src('./dist/**/*.css')
    .pipe(git.add({ args: '-A' }));
}

function gitAddAll () {
  return gulp.src('.')
    .pipe(git.add({}));
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
    .pipe(git.commit(commitMessage));
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
  return gulp.src('./dist/**/*.html')
    .pipe(htmlbeautify(options))
    .pipe(gulp.dest('./dist'))
}

function purge () {
  return gulp.src(['./static/**/*.css', '!./static/dev-only/**/*'])
    .pipe(purgecss({
      content: ['./static/**/*.{html,js,xml}'],
      whitelistPatternsChildren: [/las/, /lar/, /lab/, /la-/, /.tooltip/, /modal/, /d-block/, /col/, /select2/, /cr-vp-circle/, /swiper/, /noUi/, /medium-zoom/]
    }))
    .pipe(gulp.dest('./static/'))
}

function prefixCss () {
  return gulp.src(['./dist/**/*.css', '!./dist/dev-only/**/*'])
    .pipe(replace('/dist/', '../'))
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(gulp.dest('./dist/'));
}

function minifyCss () {
  return gulp.src(['./static/**/*.css', '!./static/dev-only/**/*'])
    .pipe(cleanCSS())
    .pipe(gulp.dest('./static/'));
}


function pushFtp () {
  const f = filter(['**/*.html'], { restore: true });
  var indexHtmlFilter = filter(['**/*', '!**/index.html'], { restore: true });

  var conn = ftp.create({
    host: process.env.FTP_HOST,
    user: process.env.FTP_USER,
    password: process.env.FTP_PASS,
    parallel: 3,
    log: gutil.log
  });

  var globs = [
    './static/**/*'
  ];

  return gulp.src(globs)
    .pipe(RevAll.revision({ dontRenameFile: [/^\/favicon.ico$/g, ".html"], dontUpdateReference: [/^\/favicon.ico$/g, ".html"] }))
    .pipe(conn.dest(process.env.FTP_PATH));
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
      baseDir: './dist/'
    },
    callbacks: {
      ready: function (err, bs) {
        currentPort = bs.options.get('port');
        gulp.src(['./.vscode/settings.json'])
          .pipe(replace(/(?<=\"vscode-opn.webServerPort\":)(.*)(?=,)/, ' ' + currentPort))
          .pipe(gulp.dest('./.vscode/'));
      }
    }
  });
  gulp.watch('src/scss/**/*.scss', style);
  gulp.watch('gulp_plugins_config.js', parallel(pluginsBundlesJS, pluginsBundlesCss, pluginsInitJS, series(cleanVendorsJs, parallel(pluginsVendorsJS, pluginsVendorsCss, pluginsVendorsInitJS))))
  gulp.watch('gulp_themes_config.js', theme)
  gulp.watch('gulp-icons-color-config.js', series(iconColor, iconLink))
  gulp.watch('src/plugins/**/*', parallel(pluginsBundlesCss, pluginsBundlesJS, pluginsVendorsJS, pluginsVendorsCss))
  gulp.watch(['./src/media/**/*', '!./src/media/icons-color/**/*'], series(media, imageMinify, iconLink))
  gulp.watch('./src/media/icons-color/**/*', series(iconColor, iconLink));
  gulp.watch('./src/dev-only/devSrc/**/*', devOnly)
  gulp.watch(['src/dev-only/**/*.njk', 'src/_imports/_gen-varibles.njk'], nunjucksDev)
  gulp.watch('src/js/**/*', parallel(pluginsInitJS, pluginsVendorsInitJS))
  gulp.watch('src/custom/**/*.js', customJs)
  gulp.watch('src/fonts/**/*', fontSrc)
  gulp.watch('src/custom/**/*.css', customCss)
  gulp.watch(['src/**/*.{html,njk}', '!src/dev-only/**/*.njk'], nunjucks)
  gulp.watch(['src/_imports/macros/**/*.{html,njk}', 'src/pages/components.njk'], snippet);
  gulp.watch('src/_imports/**/*.{html,njk}', nunjucksForce);
  gulp.watch(['src/media/**/*', '!./src/media/icons-color/**/*']).on('unlink', function (path) {
    del(path.replace('src\\', 'dist\\').toLowerCase())
  });
  gulp.watch('src/**/*.{html,njk}').on('unlink', function (path) {
    del(path.replace('src\\', 'dist\\').replace('.njk', '.html'))
  });
  gulp.watch('src/**/*.{html,njk}').on('unlink', function (path) {
    del(path.replace('src\\', 'dist\\').replace('.njk', '.html'))
  });
  gulp.watch(['./dist/**/*.html', '!./dist/dev-only{,/**}']).on('change', browserSync.reload);
  gulp.watch(['./dist/js/**/*.js', '!./dist/dev-only{,/**}']).on('change', browserSync.reload);
  gulp.watch(['./dist/dev-only/devSrc/**.js']).on('change', browserSync.reload);
}

function lwatch () {
  browserSync.init({
    open: false,
    server: {
      baseDir: './dist/'
    }
  });
  gulp.watch('src/scss/**/*.scss', style);
  gulp.watch('src/media/**/*', series(media, imageMinify))
  gulp.watch('src/custom/**/*.js', customJs)
  gulp.watch('src/custom/**/*.css', customCss)
  gulp.watch('src/**/*.{html,njk}', nunjucks)
  gulp.watch('./dist/**/*.html').on('change', browserSync.reload);
  gulp.watch('./dist/custom/js/**/*.js').on('change', browserSync.reload);
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
exports.pushFtp = pushFtp;
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

exports.ldev = series(yarnInstall, genVarFiles, parallel(series(cleanMedia, cleanIconColor, imageMinify), series(cleanHtml, nunjucksDev, nunjucks, htmlBeauty), fontSrc, customCss, customJs, imageMinify, pluginsBundlesCss, pluginsVendorsCss, style), lwatch);

exports.dev = series(yarnInstall, genVarFiles, theme, parallel(devOnly, snippet, series(iconColor, cleanMedia, cleanIconColor, imageMinify, iconColor, iconLink, cleanMedia, cleanIconColor), style, parallel(pluginsBundlesCss, pluginsBundlesJS), series(cleanVendorsJs, parallel(pluginsVendorsJS, pluginsVendorsCss, pluginsVendorsInitJS)), fontSrc, pluginsInitJS, customCss, customJs, series(cleanHtml, nunjucksDev, nunjucks, htmlBeauty)), watch);

exports.prod = parallel(snippet, series(cleanHtml, nunjucksForce, htmlBeauty), series(prefixCss, purge, minifyCss), iconColor, iconLink, cleanMedia, cleanIconColor)

exports.deploy = series(promptMes, parallel(snippet, series(cleanHtml, nunjucksForce, htmlBeauty), series(prefixCss, purge, minifyCss), iconColor, iconLink, cleanMedia, cleanIconColor), parallel(snippet, series(gitAdd, gitCommit, gitPull, gitPush), pushFtp))

exports.deployAll = series(genVarFiles, promptMes, parallel(snippet, series(cleanHtml, nunjucksForce, htmlBeauty), iconColor, iconLink, cleanMedia, prefixCss), genStatic, purge, minifyCss, parallel(snippet, series(gitAddAll, gitCommitAll, gitPull, gitPush), pushFtp))
