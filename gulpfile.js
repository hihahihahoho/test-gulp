const gulp = require('gulp');
const { series, parallel } = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync');
const broswerSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const changed = require('gulp-changed');
var replace = require('gulp-replace');
var imgSrc = [];
var imgDes = 'dist';

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

function findImages () {
  return gulp.src('./src/*.html')
    .pipe(replace(/([^('"]+)\.(jpg|png|jpeg|gif|svg|pdf|mp4)/g, match => {
      var src = 'src/**/' + match.match(/([^\\\/:*?\"<>|]+)$/g);
      imgSrc.indexOf(src) === -1 ? imgSrc.push(src) : '';
    })
    )
}

function images () {
  return gulp.src(imgSrc, { allowEmpty: true })
    .pipe(changed(imgDes))
    .pipe(gulp.dest(imgDes))
}

function watch () {
  browserSync.init({
    server: {
      baseDir: './dist/'
    }
  });
  gulp.watch('./dist/scss/**/*.scss', style)
  gulp.watch('./dist/**/*.html').on('change', broswerSync.reload);
  gulp.watch('./dist/js/**/*.js').on('change', broswerSync.reload);
}

exports.style = style;
exports.watch = watch;

exports.dev = series(parallel(series(findImages, images), style), watch);