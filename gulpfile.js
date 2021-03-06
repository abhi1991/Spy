var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var rollup = require('gulp-rollup');
var babel = require('gulp-babel');
var rename = require('gulp-rename');
var util = require('gulp-util');
var jscs = require('gulp-jscs');
var watch = require('gulp-watch');
var plumber = require('gulp-plumber');
var print = require('gulp-print');
var nodeResolve = require('rollup-plugin-node-resolve');
var commonjs    = require('rollup-plugin-commonjs');

gulp.task('compile', () => {
    watch('./src/js/*.js', compile);
    return compile();
});

function compile() {
    return gulp.src('./src/js/index.js')
        .pipe(print(function(filepath) {
            return 'built: ' + filepath;
        }))
        .pipe(plumber({
            errorHandler: function(err) {
                console.log(err.message);
                this.emit('end');
            }
        }))
        .pipe(babel())
        .pipe(rollup({
            sourceMap: true,
            plugins: [ 
                nodeResolve({ jsnext: true, main: true, browser: true }),
                commonjs()
            ]
        }))
        .on('error', util.log)
        .pipe(rename('spy.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./build'));
}

gulp.task('default', ['compile']);
gulp.task('lint', function() {
    return gulp.src('src/js/**')
          .pipe(jscs({fix: true, configPath: '.jscsrc'}))
          .pipe(gulp.dest('src/js/'));
});
