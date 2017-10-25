var fs           = require('fs')
var gulp         = require('gulp')
var path         = require('path')
var sass         = require('gulp-sass')
var autoprefixer = require('gulp-autoprefixer')
var sourcemaps   = require('gulp-sourcemaps')
var cleanCSS     = require('gulp-clean-css')
var rename       = require('gulp-rename')
var concat       = require('gulp-concat')
var uglify       = require('gulp-uglify')
var connect      = require('gulp-connect')
var open         = require('gulp-open')
var newer        = require('gulp-newer');
var babel        = require('gulp-babel')
var replace      = require('gulp-replace')
var wrapper      = require('gulp-wrapper')

var Paths = {
  HERE                 : './assets',
  DIST                 : './static',
  DIST_TOOLKIT_JS      : './static/toolkit.js',
  SCSS_TOOLKIT_SOURCES : './assets/scss/toolkit*',
  SCSS                 : './assets/scss/**/**',
  JS                   : [
      "./assets/js/bootstrap/util.js",
      "./assets/js/bootstrap/alert.js",
      "./assets/js/bootstrap/button.js",
      "./assets/js/bootstrap/carousel.js",
      "./assets/js/bootstrap/collapse.js",
      "./assets/js/bootstrap/dropdown.js",
      "./assets/js/bootstrap/modal.js",
      "./assets/js/bootstrap/tooltip.js",
      "./assets/js/bootstrap/popover.js",
      "./assets/js/bootstrap/scrollspy.js",
      "./assets/js/bootstrap/tab.js",
      './assets/js/custom/*',
      './assets/js/components/*',
    ]
}

var banner  = '/*!\n' +
  ' * Bootstrap\n' +
  ' * Copyright 2011-2016\n' +
  ' * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)\n' +
  ' */\n'
var jqueryCheck = 'if (typeof jQuery === \'undefined\') {\n' +
   '  throw new Error(\'Bootstrap\\\'s JavaScript requires jQuery. jQuery must be included before Bootstrap\\\'s JavaScript.\')\n' +
   '}\n'
var jqueryVersionCheck = '+function ($) {\n' +
  '  var version = $.fn.jquery.split(\' \')[0].split(\'.\')\n' +
  '  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1) || (version[0] >= 4)) {\n' +
  '    throw new Error(\'Bootstrap\\\'s JavaScript requires at least jQuery v1.9.1 but less than v4.0.0\')\n' +
  '  }\n' +
  '}(jQuery);\n\n'

gulp.task('default', ['scss-min', 'js-min'])

gulp.task('watch', function () {
  gulp.watch(Paths.SCSS, ['scss-min']);
  gulp.watch(Paths.JS,   ['js-min']);
})

gulp.task('docs', ['server'], function () {
  gulp.src(__filename)
    .pipe(open({uri: 'http://localhost:9001/docs/'}))
})

gulp.task('server', function () {
  connect.server({
    root: 'docs',
    port: 9001,
    livereload: true
  })
})

gulp.task('scss', function () {
  return gulp.src(Paths.SCSS_TOOLKIT_SOURCES)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write(Paths.HERE))
    .pipe(gulp.dest(Paths.DIST))
})

gulp.task('scss-min', ['scss'], function () {
  return gulp.src(Paths.SCSS_TOOLKIT_SOURCES)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS({compatibility: 'ie9'}))
    .pipe(autoprefixer())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(sourcemaps.write(Paths.HERE))
    .pipe(gulp.dest(Paths.DIST))
})

gulp.task('apply-prod-environment', function() {
    process.env.NODE_ENV = 'development';
});

gulp.task('js', ['apply-prod-environment'],function () {
  return gulp.src(Paths.JS)
    .pipe(concat('toolkit.jsx'))
    .pipe(replace(/^(export|import).*/gm, ''))
    .pipe(babel({
        "compact" : false,
        "presets": ['env'],
        "plugins": ['transform-react-jsx']
      }
    ))
    .pipe(wrapper({
       header: banner +
               "\n" +
               jqueryCheck +
               "\n" +
               jqueryVersionCheck +
               "\n+function () {\n",
       footer: '\n}();\n'
    }))
    .pipe(gulp.dest(Paths.DIST))
})

gulp.task('js-min', ['js'], function () {
  return gulp.src(Paths.DIST_TOOLKIT_JS)
    .pipe(uglify())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(Paths.DIST))
})
