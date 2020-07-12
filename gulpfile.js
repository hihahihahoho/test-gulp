const gulp = require('gulp');
const cache = require('gulp-cache');
const cached = require('gulp-cached');
const remember = require('gulp-remember');
const { series, parallel } = require('gulp');
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
const newer = require('gulp-newer');


var del = require('del');
var imgSrc = [];
var imgDes = 'dist';

var pluginsBundlesJsVal = [];
var pluginsBundlesCssVal = [];

var pluginsDetail = {
  'lightpick': {
    "scripts": [
      "src/plugins/bundles/lightpick/1moment.min.js",
      "src/plugins/bundles/lightpick/lightpick.js",
    ]
  },
  'bootstrap': {
    "styles": [
      "node_modules/bootstrap/dist/css/bootstrap.min.css"
    ],
    "scripts": [
      "node_modules/bootstrap/js/dist/util.js",
      "node_modules/bootstrap/js/dist/modal.js",
      "node_modules/bootstrap/js/dist/dropdown.js",
      "node_modules/bootstrap/js/dist/popover.js",
      "node_modules/bootstrap/js/dist/tooltip.js",
      "node_modules/bootstrap/js/dist/tab.js",
    ]
  }
}

var plugins = {
  'bundles': [
    pluginsDetail.bootstrap,
    pluginsDetail.lightpick,
  ]
}

plugins.bundles.forEach((item) => {
  if (item.scripts != undefined) {
    pluginsBundlesJsVal = pluginsBundlesJsVal.concat(item.scripts);
  }
  if (item.styles != undefined) {
    pluginsBundlesCssVal = pluginsBundlesCssVal.concat(item.styles)

  }
});

function pluginsBundlesJS () {
  return gulp.src(pluginsBundlesJsVal)
    .pipe(cached('pluginsBundlesJS'))
    .pipe(remember('pluginsBundlesJS'))
    .pipe(concat('bundles.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/plugins/bundles'));
}

function pluginsBundlesCss () {
  return gulp.src(pluginsBundlesCssVal)
    .pipe(concat('bundles.css'))
    .pipe(gulp.dest('./dist/plugins/bundles'));
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

function watch () {
  browserSync.init({
    server: {
      baseDir: './dist/'
    }
  });
  gulp.watch('src/scss/**/*.scss', style)
  gulp.watch('dist/**/*.html').on('change', browserSync.reload);
  gulp.watch('dist/js/**/*.js').on('change', browserSync.reload);
}

function clearCache () {
  return cache.clearAll()
}

exports.style = style;
exports.watch = watch;
exports.cleanMedia = cleanMedia;
exports.media = media;
exports.imageMinify = imageMinify;
exports.clearCache = clearCache;
exports.dataTest = dataTest;
exports.pluginsBundles = parallel(pluginsBundlesCss, pluginsBundlesJS);

exports.dev = series(parallel(series(cleanMedia, imageMinify), style), watch);