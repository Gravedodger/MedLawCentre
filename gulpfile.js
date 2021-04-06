const gulp = require ('gulp');
const sass = require ('gulp-sass');
const scss = require ('gulp-scss');
const jshint = require('jshint');
const autoprefixer = require ('gulp-autoprefixer');
const clean = require ('gulp-clean');
const cleanCSS = require ('gulp-clean-css');
const concat = require ('gulp-concat');
const browserSync = require ('browser-sync').create();
const reload = browserSync.reload;
const imagemin = require ('gulp-imagemin');
const uglify = require ('gulp-uglify');
const minify = require ('gulp-minify');

sass.compiler = require ('node-sass');

const patch = {
  css: './src/scss/**/*.scss',
  js: './src/js/**/*.js'
};

const style = () =>
    gulp.src (patch.css).
        pipe(scss()).
        pipe(cleanCSS()).
        pipe(gulp.dest ('./dist/css'));

const js = () =>
    gulp.src (patch.js).
        pipe(concat()).
        pipe(uglify()).
        pipe(gulp.dest ('./dist/js'));

gulp.task ('style', style);

const watch = () => {
  gulp.watch (patch.css, style);
};

gulp.task ('build', gulp.series ('cleandev', gulp.parallel(style, js, images)));

gulp.task ('dev', gulp.series ('build', watch));

// COMPILER
gulp.task ('sass', function () {
  return gulp.src ('./sass/**/*/scss').
      pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest ('./css'));
});

gulp.task ('sass:watch', function () {
  gulp.watch('./sass/**/*.scss', ['sass'])
});

// BROWSER-SYNC
gulp.task('js', function () {
  return gulp.src('js/*js')
  .pipe(jshint('.jshintrc'))
  .pipe(browserify())
  .pipe(uglify())
  .pipe(gulp.dest('dist/js'));
});

gulp.task('js-watch', ['js'], function (done) {
  browserSync.reload();
  done();
});

gulp.task('default', ['js'], function () {
  browserSync.init({
    server: {
      baseDir: './'
    }
  });
  
  gulp.watch('js/*.js', ['js-watch']);
});

gulp.task('serve', function () {
  browserSync.init({
    server: {
      baseDir: './'
    }
  });
  
  gulp.watch('*.html').on('change', reload);
});

// AUTOPREFIXER
exports.default = () => (
    gulp.src('src/app.css')
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(gulp.dest('dist'))
);

// IMAGE-MIN
exports.default = () => (
    gulp.src('src/images/**/*.{svg, png, jpeg}*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'))
);

// CLEAN
gulp.task('default', function () {
  return gulp.src('app/tmp', {read: false})
  .pipe(clean());
});

// MINIFY
gulp.task('compress', function() {
  gulp.src(['lib/*.js', 'lib/*.mjs'])
  .pipe(minify())
  .pipe(gulp.dest('dist'))
});
