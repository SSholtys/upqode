const { src, dest, watch, series } = require('gulp')
const sass = require('gulp-sass')
const csso = require('gulp-csso')
const include = require('gulp-file-include')
const htmlmin = require('gulp-htmlmin')
const terser = require('terser')
const jsminify = require('gulp-uglify')
const sourcemaps = require('gulp-sourcemaps')
const concat = require('gulp-concat')
const del = require('del')
const imagemin = require('gulp-imagemin')
const autoprefixer = require('gulp-autoprefixer')
const sync = require('browser-sync').create()

function html() {
  return src('src/**.html')
    .pipe(include({
    prefix: '@@'
    }))
    .pipe(htmlmin({
      collapseWhitespace: true
  }))
    .pipe(dest('dist'))
    
}

function scss() {
  return src('src/scss/**.scss')
    .pipe(sass())
    .pipe(autoprefixer({
      overrideBrowserslist: ['last 2 versions']
    }))
    .pipe(csso())
    .pipe(concat('styles.css'))
    .pipe(dest('dist'))
}

function imgTask() {
  return src('src/img/**')
    .pipe(imagemin())
    .pipe(dest('dist/img'))
}

function jsMin() {
  return src('src/js/*.js')
    .pipe(jsminify())
  .pipe(dest('dist'))
}

// function jsTask() {
//   return src('src/js/*.js')
//     .pipe(sourcemaps.init())
//     .pipe(concat('main.js'))
//     .pipe(terser())
//     .pipe(sourcemaps.write())
//     .pipe(dest('dist'))
// }

function clear() {
  return del('dist')
}

function serve() {
  sync.init({
    server: './dist'
  })

  watch('src/**.html', series(html)).on('change', sync.reload)
  watch('src/scss/**.scss', series(scss)).on('change', sync.reload)
  // watch('src/js/**.js', series(bundleJs)).on('change', sync.reload)
}


exports.build = series(clear, scss, html, imgTask, jsMin)
exports.serve = series(clear, scss, html, imgTask, jsMin, serve)
exports.clear = clear