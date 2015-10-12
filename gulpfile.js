'use strict';

var browserify  = require('browserify'),
    babelify    = require('babelify'),
    gulp        = require('gulp'),
    source      = require('vinyl-source-stream'),
    buffer      = require('vinyl-buffer'),
    uglify      = require('gulp-uglify'),
    sourcemaps  = require('gulp-sourcemaps'),
    gutil       = require('gulp-util'),
    mocha       = require('mocha');

gulp.task('default', function () {
    return gulp.src('test.js', {read: false})
        // gulp-mocha needs filepaths so you can't have any plugins before it
        .pipe(mocha({reporter: 'nyan'}));
});

gulp.task('build', function () {
  // set up the browserify instance on a task basis
    return browserify({ entries: './app/assets/scripts/app.js', debug: true })
    // .transform(babelify)
    .bundle()
    .pipe(source('app.min.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        .pipe(uglify())
        .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./app/assets/scripts'));
});

gulp.task('test', function () {
    return gulp.src('./tests/hex.js', {read: false})
        .pipe(mocha({reporter: 'nyan', ui: 'bdd'}));
});

/**
 * This task monitors file changes and compiles the scss and lints
 * the javascript.
 */
gulp.task('watch', function() {
    gulp.watch(['./app/assets/scripts/**/*.js', '!./app/assets/scripts/**/*.min.js'], ['build']);
});
