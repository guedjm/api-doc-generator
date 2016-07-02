const gulp = require('gulp');
const ts = require('gulp-typescript');
const lint = require('gulp-tslint');
const clean = require('gulp-clean');

gulp.task('default', function () {

});

gulp.task('build', function () {
  const tsProject = ts.createProject('tsconfig.json');

  const tsResult = tsProject.src()
    .pipe(ts(tsProject));

  return tsResult.js.pipe(gulp.dest('lib'));
});

gulp.task('clean', function () {
  return gulp.src('./lib', {read: false})
    .pipe(clean());
});

gulp.task('lint', function () {
  const tsProject = ts.createProject('tsconfig.json');
  return tsProject.src()
    .pipe(lint())
    .pipe(lint.report('verbose'));
});