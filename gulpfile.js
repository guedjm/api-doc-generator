const gulp = require('gulp');
const ts = require('gulp-typescript');
const lint = require('gulp-tslint');
const clean = require('gulp-clean');
const meger = require('merge2');

gulp.task('', function () {

});

gulp.task('build', function () {
  const tsProject = ts.createProject('tsconfig.json');

  const tsResult = tsProject.src()
    .pipe(ts(tsProject));

  return merge([
    tsResult.dts.pipe(gulp.dest('build')),
    tsResult.js.pipe(gulp.dest('build'))
  ])
});

gulp.task('clean', function () {
  return gulp.src('./build', {read: false})
    .pipe(clean());
});

gulp.task('lint', function () {
  const tsProject = ts.createProject('tsconfig.json');
  return tsProject.src()
    .pipe(lint())
    .pipe(lint.report('verbose'));
});