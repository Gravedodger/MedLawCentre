const gulp = require ('gulp');
const sass = require ('gulp-sass');
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

function styles() {
  return gulp.src(patch.css).
      pipe(concat('main.css')).
      pipe(sass()).
      pipe(autoprefixer()).
      pipe(cleanCSS({level: 2})).
      pipe(gulp.dest('dist/')).
      pipe(browserSync.stream());
}

function scripts() {
  return gulp.src(patch.js).
      pipe(concat('script.js')).
      pipe(uglify()).
      pipe(gulp.dest('./dist')).
      pipe(browserSync.stream());
}

const distJQuery = () => {
  return gulp.src("./node_modules/jquery/dist/jquery.min.js")
  .pipe(gulp.dest("./dist"));
};

gulp.task ('styles', styles);

function image() {
  return gulp.src('./src/img/**/*')
  .pipe(imagemin({progressive: true}))
  .pipe(gulp.dest('./dist/images--optimized'));
}

function watch() {
  browserSync.init ({
    server: {
      baseDir: './'
    }
  });
  
  gulp.watch(patch.css, styles);
  gulp.watch(patch.js, scripts);
  gulp.watch('./*.html').on('change', browserSync.reload);
}

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

gulp.task('copyFonts');
gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('distJQuery', distJQuery);
gulp.task('image', image);
gulp.task('del', clean);
gulp.task('watch', watch);
gulp.task('build', gulp.series(clean, distJQuery, gulp.parallel(styles,scripts), image));
gulp.task('dev', gulp.series('build', 'watch'));
