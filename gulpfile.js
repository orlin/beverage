var gulp = require('./index.js')(require('gulp'), {
  scripts: {},
  buildWatch: ['sourcegates.coffee'],
  test: {},
  testWatch: ['sourcegates.js', 'test/*.coffee']
})

gulp.task('dev', 'DEVELOP', ['build', 'test', 'build:watch', 'test:watch'])
