var gulp = require('gulp'),
    connect = require('gulp-connect');

try {
  var watch = require('gulp-watch'),
      pug = require('gulp-pug');
} catch (e) {}

gulp.task('connect', function() {
  connect.server({
    root: 'www',
    port: 5000,
    livereload: true
  });
});

const PUG_PATH = './www/js/**/*.pug';
gulp.task('watch-pug', function () {
  watch(PUG_PATH, {ignoreInitial: false})
    .pipe(pug({
      verbose: true,
      pretty: true
    }))
    .pipe(gulp.dest('./www/html/'))
    .pipe(connect.reload())
})

gulp.task('watch-reload', function () {
  watch('./www/js/**/!(*.pug)')
    .pipe(connect.reload())
})

gulp.task('default', [
  'connect', 'watch-pug', 'watch-reload'])

gulp.task('prod', function() {
  connect.server({
    root: 'www'
  });
});