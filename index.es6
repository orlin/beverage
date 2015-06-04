'use strict'
require('source-map-support').install()

var path = require('path')
var pkg = require(path.join(process.cwd(), 'package.json'))
var sourcegate = require('sourcegate')

function def(opts = {}) {
    opts.dotBeverage = opts.dotBeverage || [
      'node_modules/beverage/node_modules/hal-rc',
      '.'
    ]

    let o = sourcegate([{
      build: 'build',
      scripts: {
        exclude: ['test'], // because gulp-npm-test does testing better than gulp-npm-run
        requireStrict: true
      },
      test: { // NOTE: test is always enabled because of this default -- not so good...
        testsRe: /\.spec\.coffee$/ // TODO: move to .beverage after changing it to a glob
      }
    }].concat(opts.dotBeverage.map(path => path + '/.beverage'), opts))

    if (o.scripts.include && o.scripts.include[o.build])
      o = sourcegate([o, {scripts: {require: [o.build]}}])

    return o
  }


module.exports = function(gulpIn, opts) {
  let o = def(opts),
      gulp

  if (pkg.scripts && o.scripts) gulp = require('gulp-npm-run')(gulpIn, o.scripts)
  else gulp = require('gulp-help')(gulpIn)

  if (pkg.scripts) {
    if (o.test && pkg.scripts.test) {
      let test = require('gulp-npm-test')(gulp, o.test)

      if (o.testWatch) {
        gulp.task('test:watch', o.testWatch.toString(), function() {
          require('gulp-watch')(o.testWatch, test)
        })
      }
    }

    if (o.buildWatch && o.scripts) {
      gulp.task('build:watch', o.buildWatch.toString(), function() {
        gulp.watch(o.buildWatch, [o.build])
      })
    }
  }

  if (o.sourcegate && o.sourcegate.length) require('hal-rc')(o, gulp)

  return gulp
}
