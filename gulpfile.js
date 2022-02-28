const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const postscss = require('postcss-scss');
const cssnano = require('cssnano');
const stylelint = require('stylelint');
const reporter = require('postcss-reporter');
const autoprefixer = require('autoprefixer');
const rename = require('gulp-rename');
const browserSync = require('browser-sync').create()

function copyHtml() {
  return src('src/*.html')
    .pipe(dest('dist'));
}

function stylelintSCSS() {
  return src('src/assets/scss/**/*.scss')
    .pipe(postcss([stylelint, reporter], { syntax: postscss }));
}

function compileSCSS() {
  return src('src/assets/scss/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([autoprefixer, cssnano]))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(dest('dist/assets/css'))
    .pipe(browserSync.stream());
}

function copyIcons() {
  return src('src/assets/icons/**/*')
    .pipe(dest('dist/assets/icons'));
}

function copyFonts() {
  return src('src/assets/fonts/*.ttf')
    .pipe(dest('dist/assets/fonts'));
}

function watchTasks() {
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  });
  watch('src/*.html', copyHtml).on('change', browserSync.reload);
  watch('src/assets/scss/**/*.scss', stylelintSCSS);
  watch('src/assets/scss/**/*.scss', compileSCSS);
  watch('src/assets/icons/**/*', copyIcons);
  watch('src/assets/fonts/*.ttf', copyFonts);
}

exports.default = series(
  copyHtml,
  stylelintSCSS,
  compileSCSS,
  copyFonts,
  copyIcons,
  watchTasks
);