'use strict';

var del         = require('del');
var path        = require('path');
var gulp        = require('gulp');
var plumber     = require('gulp-plumber');
var compass     = require('gulp-compass');
var minifyCSS   = require('gulp-minify-css');
var uglify      = require('gulp-uglify');
var concat      = require('gulp-concat');
var ghPages     = require('gulp-gh-pages-cname');
var imagemin    = require('gulp-imagemin');
var webserver   = require('gulp-webserver');
var runSequence = require('run-sequence');

var paths = {
  source: 'source',
  build:  'dist',
  html:   '',
  css:    'stylesheets',
  js:     'javascripts',
  image:  'images'
};

var source = {
  root:  paths.source,
  html:  path.join(paths.source, paths.html),
  css:   path.join(paths.source, paths.css),
  js:    path.join(paths.source, paths.js),
  image: path.join(paths.source, paths.image)
};

var build = {
  root:  paths.build,
  html:  path.join(paths.build, paths.html),
  css:   path.join(paths.build, paths.css),
  js:    path.join(paths.build, paths.js),
  image: path.join(paths.build, paths.image)
};

var server = {
  host: 'localhost',
  port: '8000'
};

gulp.task('html', function() {
  return gulp.src(path.join(source.html, '**/*.html'))
    .pipe(gulp.dest(build.html));
});

gulp.task('compass', function() {
  // _が使いないファイルのみ
  return gulp.src([path.join(source.css, '**/*.scss'), '!'+path.join(source.css, '**/_*.scss')])
    .pipe(plumber())
    .pipe(compass({
      css:  build.css,
      sass: source.css,
      comments: false
    }))
    .pipe(minifyCSS())
    .pipe(gulp.dest(build.css));
});

gulp.task('js', function() {
  return gulp.src(path.join(source.js, '**/*.js'))
    .pipe(uglify({preserveComments: 'some'}))
    .pipe(concat('all.js'))
    .pipe(gulp.dest(build.js));
});

gulp.task('bower', function() {
  var bowerFiles = [
    'bower_components/jquery/dist/jquery.min.js',
    'bower_components/bootstrap-sass-official/assets/javascripts/bootstrap.min.js'
  ];
  return gulp.src(bowerFiles)
    .pipe(uglify({preserveComments: 'some'}))
    .pipe(concat('bower.js'))
    .pipe(gulp.dest(build.js));
});

gulp.task('imagemin', function() {
  var glob = '**/*.+(jpg|jpeg|png|gif|svg)';
  return gulp.src(path.join(source.image, glob))
    .pipe(imagemin({optimizationLevel: 7}))
    .pipe(gulp.dest(build.image));
});

gulp.task('clean', function(cb) {
  del([build.root], cb);
});

// build内を監視して変更があればリロード
gulp.task('webserver', function() {
  gulp.src(build.root)
   .pipe(webserver({
     host: server.host,
     port: server.port,
     livereload: true
   }));
});

gulp.task('watch', function() {
  gulp.watch(path.join(source.html, '**/*.html'), ['html']);
  gulp.watch(path.join(source.css,  '**/*.scss'), ['compass']);
  gulp.watch(path.join(source.js, '**/*.js'), ['js']);
});

gulp.task('build', function(callback) {
  runSequence(
    'clean',
    ['html', 'compass', 'js', 'bower', 'imagemin'],
    callback
  );
});

gulp.task('deploy', function() {
  return gulp.src('./dist/**/*')
    .pipe(ghPages({cname:'dhacks.party'}));
});

gulp.task('start', function(callback) {
  runSequence(
    'build',
    'webserver',
    'watch',
    callback
  )
});

