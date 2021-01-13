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

function browserifyJs (cb) {
  return browserify('./src/plugins-browserify/uppy/uppy.js')
    .bundle()
    .pipe(source('bundle.js'))
    // Start piping stream to tasks!
    .pipe(gulp.dest('./dist/js/vendors/plugins-browserify/'));
};

function cleanVendorsJs (cb) {
  del('dist/css/vendors/**', { force: true });
  return del('dist/js/vendors/**', { force: true });
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
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/css'))
    .pipe(browserSync.stream());
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
    .pipe(browserSync.stream());
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
  return dircompare.compare('./src/media/', './dist/media/')
    .then(res => res.diffSet.forEach(dif => {
      dif.type1 == 'missing' ? del(dif.path2.replace(/(\\)/, '') + '/' + dif.name2) : ''
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


function media () {
  return gulp.src('./src/media/**/*', { allowEmpty: true })
    .pipe(changed('./dist/media/**/*'))
    .pipe(gulp.dest('dist/media/'))
}

function imageMinify () {
  return gulp.src('./src/media/**/*')
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
    .pipe(replace('vector-effect="non-scaling-stroke"', ''))
    .pipe(replace('stroke-width="1.5"', 'stroke-width="1.5" vector-effect="non-scaling-stroke"'))
    .pipe(gulp.dest('dist/media/'))
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
}

function nunjucks () {
  return gulp.src(['src/**/*.njk', '!src/_imports/**/*.njk'])
    .pipe(cached())
    .pipe(data(function (file) {
      return {
        baseLink: path.relative(process.cwd(), file.path).replace(/([^\\]+)/g, '..').slice(0, -4)
      }
    }))
    .pipe(data(function (file) {
      return {
        file_path: path.relative(process.cwd(), file.path).replace('src\\pages\\', '').replace('.njk', '.html').replace('\\', '\/')
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
    .pipe(gulp.dest('dist'));
}

function nunjucksForce () {
  return gulp.src(['src/**/*.njk', '!src/_imports/**/*.njk'])
    .pipe(data(function (file) {
      return {
        baseLink: path.relative(process.cwd(), file.path).replace(/([^\\]+)/g, '..').slice(0, -4)
      }
    }))
    .pipe(data(function (file) {
      return {
        file_path: path.relative(process.cwd(), file.path).replace('src\\pages\\', '').replace('.njk', '.html').replace('\\', '\/')
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
    .pipe(gulp.dest('dist'));
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
    .pipe(gulp.dest('dist/fonts/'));
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
    .pipe(gulp.dest('dist/fonts-vcb/'));
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
  return gulp.src('dist/**/*.css')
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
  return gulp.src('dist/**/*.html')
    .pipe(htmlbeautify(options))
    .pipe(gulp.dest('./dist'))
}

function purge () {
  return gulp.src('dist/**/*.css')
    .pipe(purgecss({
      content: ['dist/**/*.{html,js,xml}'],
      whitelistPatternsChildren: [/las/, /lar/, /lab/, /la-/, /.tooltip/, /modal/, /d-block/, /col/, /select2/, /cr-vp-circle/, /swiper/, /noUi/]
    }))
    .pipe(gulp.dest('dist'))
}

function prefixCss () {
  return gulp.src('dist/**/*.css')
    .pipe(replace('/dist/', '../'))
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(gulp.dest('dist/'));
}

function minifyCss () {
  return gulp.src('dist/**/*.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist'));
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
    'dist/**/*'
  ];

  // using base = '.' will transfer everything to /public_html correctly
  // turn off buffering in gulp.src for best performance

  // return gulp.src(globs, { base: '.' })
  //   .pipe(f)
  //   .pipe(cachebust({
  //     type: 'timestamp'
  //   }))
  //   .pipe(f.restore)
  //   .pipe(conn.dest(process.env.FTP_PATH));
  return gulp.src(globs)
    .pipe(RevAll.revision({ dontRenameFile: [/^\/favicon.ico$/g, ".html"], dontUpdateReference: [/^\/favicon.ico$/g, ".html"] }))
    .pipe(conn.dest(process.env.FTP_PATH));
}


// end production task
function watch () {
  browserSync.init({
    open: false,
    server: {
      baseDir: './dist/'
    }
  });
  gulp.watch('src/scss/**/*.scss', style);
  gulp.watch('gulp_plugins_config.js', parallel(pluginsBundlesJS, pluginsBundlesCss, pluginsInitJS, series(cleanVendorsJs, parallel(pluginsVendorsJS, pluginsVendorsCss, pluginsVendorsInitJS))))
  gulp.watch('src/plugins/**/*', parallel(pluginsBundlesCss, pluginsBundlesJS, pluginsVendorsJS, pluginsVendorsCss))
  gulp.watch('src/media/**/*', series(media, imageMinify))
  gulp.watch('src/js/*', parallel(pluginsInitJS, pluginsVendorsInitJS))
  gulp.watch('src/custom/**/*.js', customJs)
  gulp.watch('src/fonts/**/*', fontSrc)
  gulp.watch('src/custom/**/*.css', customCss)
  gulp.watch('src/**/*.{html,njk}', nunjucks)
  gulp.watch('src/_imports/**/*.{html,njk}', nunjucksForce)
  gulp.watch('src/**/*.{html,njk}').on('unlink', function (path) {
    del(path.replace('src\\', 'dist\\').replace('.njk', '.html'))
  });
  gulp.watch('dist/**/*.html').on('change', browserSync.reload);
  gulp.watch('dist/js/**/*.js').on('change', browserSync.reload);
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
  gulp.watch('dist/**/*.html').on('change', browserSync.reload);
  gulp.watch('dist/custom/js/**/*.js').on('change', browserSync.reload);
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

exports.ldev = series(yarnInstall, parallel(series(cleanMedia, imageMinify), series(cleanHtml, nunjucks, htmlBeauty), fontSrc, customCss, customJs, imageMinify, pluginsBundlesCss, pluginsVendorsCss, style), lwatch);

exports.dev = series(yarnInstall, parallel(series(cleanMedia, imageMinify, cleanMedia), style, parallel(pluginsBundlesCss, pluginsBundlesJS), series(cleanVendorsJs, parallel(pluginsVendorsJS, pluginsVendorsCss, pluginsVendorsInitJS)), fontSrc, pluginsInitJS, customCss, customJs, series(cleanHtml, nunjucks, htmlBeauty)), watch);

exports.prod = parallel(series(cleanHtml, nunjucksForce, htmlBeauty), series(prefixCss, purge, minifyCss), cleanMedia)

exports.deploy = series(promptMes, parallel(series(cleanHtml, nunjucksForce, htmlBeauty), series(prefixCss, purge, minifyCss), cleanMedia), parallel(series(gitAdd, gitCommit, gitPull, gitPush), pushFtp))

exports.deployAll = series(promptMes, parallel(series(cleanHtml, nunjucksForce, htmlBeauty), series(prefixCss, purge, minifyCss), cleanMedia), parallel(series(gitAddAll, gitCommitAll, gitPull, gitPush), pushFtp))
