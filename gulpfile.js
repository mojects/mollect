var gulp = require('gulp'),
    pug = require('gulp-pug'),
    connect = require('gulp-connect');

gulp.task('connect', function() {
  connect.server({
    root: 'www',
    port: 5000,
    livereload: true
  });
});

const PUG_PATH = './www/js/**/*.pug';

gulp.task('pug', function () {
  gulp.src(PUG_PATH)
    .pipe(pug({
      verbose: true,
      pretty: true
    }))
    .pipe(gulp.dest('./www/html/'))
    .pipe(connect.reload())
});

gulp.task('watch', function () {
  gulp.watch([PUG_PATH], ['pug']);
});

gulp.task('default', ['pug', 'connect', 'watch']);