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
const uglify = require('gulp-uglify');
const nunjucksRender = require('gulp-nunjucks-render');
const htmlbeautify = require('gulp-html-beautify');
const purgecss = require('gulp-purgecss')
const cleanCSS = require('gulp-clean-css');
const gulpif = require('gulp-if');
const autoprefixer = require('gulp-autoprefixer');
var del = require('del');

var imgSrc = [];
var imgDes = 'dist';

var pluginsBundlesJsVal = [];
var pluginsBundlesCssVal = [];

function pluginsVendorsJS (cb) {
  del('dist/plugins/vendors/**');
  delete require.cache[require.resolve('./gulp_plugins_config.js')];
  plugins = require('./gulp_plugins_config.js').plugins
  plugins.vendors.map((file, index) => {
    if (file.scripts != undefined) {
      gulp.src(file.scripts, { allowEmpty: 'true' })
        .pipe(gulpif('!**/*.min.js', cache(uglify())))
        .pipe(concat(file.name + '.bundles.js'))
        .pipe(gulp.dest('./dist/plugins/vendors/' + file.name));
    }
  })
  return cb()
}

function pluginsVendorsCss (cb) {
  delete require.cache[require.resolve('./gulp_plugins_config.js')];
  plugins = require('./gulp_plugins_config.js').plugins
  plugins.vendors.map((file, index) => {
    if (file.styles != undefined) {
      gulp.src(file.styles, { allowEmpty: 'true' })
        .pipe(concat(file.name + 'bundles.css'))
        .pipe(gulp.dest('./dist/plugins/vendors/' + file.name));
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
      .pipe(gulpif('!**/*.min.js', cache(uglify())))
      .pipe(concat('bundles.js'))
      .pipe(gulp.dest('./dist/plugins/bundles'));
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
    return gulp.src(pluginsBundlesCssVal, { allowEmpty: 'true' })
      .pipe(concat('bundles.css'))
      .pipe(gulp.dest('./dist/plugins/bundles'));
  }
  cb();
}

function custom () {
  return gulp.src('./src/custom/**/*')
    .pipe(changed('./src/custom/**/*'))
    .pipe(gulp.dest('./dist/custom'))
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
      mozjpeg: ['-quality', 73],
      gifsicle: true,
      svgo: true,
      concurrent: 10,
      quiet: true // defaults to false
    })))
    .pipe(gulp.dest('dist/media/'))
}

function dataTest () {
  return gulp.src('src/**/*.html')
    .pipe(cache(data(function (file) {
      return console.log(path.relative(process.cwd(), file.path).replace(/([^\\]+)/g, '..').slice(0, -4));
    })))
}

function nunjucks () {
  return gulp.src('src/**/*.njk')
    .pipe(cached())
    .pipe(data(function (file) {
      return {
        baseLink: path.relative(process.cwd(), file.path).replace(/([^\\]+)/g, '..').slice(0, -4)
      }
    }))
    .pipe(nunjucksRender({
      path: ['src/_imports/']
    }))
    .pipe(gulp.dest('dist'));
}

function nunjucksForce () {
  return gulp.src('src/**/*.njk')
    .pipe(data(function (file) {
      return {
        baseLink: path.relative(process.cwd(), file.path).replace(/([^\\]+)/g, '..').slice(0, -4)
      }
    }))
    .pipe(nunjucksRender({
      path: ['src/_imports/']
    }))
    .pipe(gulp.dest('dist'));
}

// production task
function htmlBeauty () {
  var options = {
    indent_size: 2,
    max_preserve_newlines: 0
  };
  return gulp.src('dist/**/*.html')
    .pipe(htmlbeautify(options))
    .pipe(gulp.dest('./dist'))
}

function purge () {
  return gulp.src('dist/**/*.css')
    .pipe(purgecss({
      content: ['dist/**/*.{html,js,xml}'],
      whitelistPatternsChildren: [/las/, /lar/, /lab/, /la-/, /.tooltip/, /modal/, /col/]
    }))
    .pipe(gulp.dest('dist'))
}
function prefixCss () {
  return gulp.src('src/custom/**/*.css')
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(gulp.dest('dist/custom'));
}
function minifyCss () {
  return gulp.src('dist/**/*.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest('dist'));
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
  gulp.watch(pluginsBundlesJsVal, pluginsBundlesJS)
  gulp.watch('gulp_plugins_config.js', parallel(pluginsBundlesJS, series(pluginsVendorsJS, pluginsVendorsCss)))
  gulp.watch('src/plugins/bundles/**/*', parallel(pluginsBundlesCss, pluginsBundlesJS))
  gulp.watch('src/plugins/vendors/**/*', series(pluginsVendorsJS, pluginsVendorsCss))
  gulp.watch('src/media/**/*', series(media, imageMinify))
  gulp.watch('src/custom/**/*', custom)
  gulp.watch('src/**/*.{html,njk}', nunjucks)
  gulp.watch('dist/**/*.html').on('change', browserSync.reload);
  gulp.watch('dist/custom/js/**/*.js').on('change', browserSync.reload);
}

function clearCache () {
  return cache.clearAll()
}

exports.style = style;
exports.cleanMedia = cleanMedia;
exports.media = media;
exports.imageMinify = imageMinify;
exports.clearCache = clearCache;
exports.dataTest = dataTest;
exports.pluginsBundles = parallel(pluginsBundlesCss, pluginsBundlesJS);
exports.nunjucks = nunjucks;
exports.nunjucksForce = nunjucksForce;
exports.custom = custom;
exports.htmlBeauty = htmlBeauty;
exports.watch = watch;
exports.purgeCss = series(purge, minifyCss);
exports.prefixCss = prefixCss;
exports.pluginsVendors = series(pluginsVendorsJS, pluginsVendorsCss);

exports.dev = series(parallel(series(cleanMedia, imageMinify), style, parallel(pluginsBundlesCss, pluginsBundlesJS), series(pluginsVendorsJS, pluginsVendorsCss), custom, nunjucks), watch);

exports.prod = parallel(series(nunjucksForce, htmlBeauty), series(prefixCss, purge , minifyCss), cleanMedia)