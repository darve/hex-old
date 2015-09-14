'use strict';

var browserify  = require('browserify');
var babelify    = require('babelify');
var gulp        = require('gulp');
var source      = require('vinyl-source-stream');
var buffer      = require('vinyl-buffer');
var uglify      = require('gulp-uglify');
var sourcemaps  = require('gulp-sourcemaps');
var gutil       = require('gulp-util');

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

/**
 * This task monitors file changes and compiles the scss and lints
 * the javascript.
 */
gulp.task('watch', function() {
    gulp.watch(['./app/assets/scripts/**/*.js', '!./app/assets/scripts/**/*.min.js'], ['build']);
});
