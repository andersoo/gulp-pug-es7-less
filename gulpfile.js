
// Gulp, and auto load plugins
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var fs = require('fs');
var es = require('event-stream');

// some plugins need a manual load
// and some frequently used ones can have a easier quickhand
var gutil = require('gulp-util');
var gpIf = plugins.if;
var del = require('del');
var runSeq = require('run-sequence');

// plugins of plugins
var LessAutoprefix = require('less-plugin-autoprefix');
var autoprefix = new LessAutoprefix({ browsers: ["last 2 versions", "> 5%", "not ie < 8"] });

// take parameters from the command line
var argv = gutil.env;
var pkg = require('./package.json');
var settings = {
  forced: false,
  src: argv.src ? argv.src : 'src',
  output: ( typeof argv.output === 'string' ) ? argv.output : (argv.o ? argv.o : 'public'),
  dist: ( typeof argv.dist  === 'string' ) ? argv.dist : 'dist',
  host: argv.host ? argv.host : (argv.allowlan ? '0.0.0.0' : 'localhost'),
  port: argv.port ? argv.port : 9000,
  build: {
    assets: false,
    dist: false,
    img: false,
    all: false
  },
  siteName: (typeof pkg.name === 'string') ? pkg.name : 'Simple Site'
};

gulp.task('connect', function() {
  if(settings.build.dist === false){
    plugins.connect.server({
      name: settings.siteName,
      root: settings.output,
      host: settings.host,
      port: settings.port,
      livereload: true
    });
  }else{
    plugins.connect.server({
      name: settings.siteName,
      root: settings.dist,
      host: settings.host,
      port: settings.port,
      livereload: false
    });
  }
});

gulp.task('watch', function(){
  gulp.watch('src/pages/**/*.pug', ['html']);
  gulp.watch('src/less/**/*.less', ['styles']);
  gulp.watch(['src/scripts/**/*.js', '!src/scripts/vendors/*'], ['scripts']);
  gulp.watch('src/images/*', ['assets']);
});


gulp.task('vendors', function(){
  return es.merge(
    gulp.src([
        'bower_components/jquery/dist/jquery.slim.js',
        'bower_components/fetch/fetch.js',
        'bower_components/tether/dist/js/tether.js',
        'bower_components/bootstrap/dist/js/bootstrap.js'
      ])
      .pipe(gulp.dest('public/js/vendors')),
    gulp.src([
        'bower_components/tether/dist/css/tether.css',
        'bower_components/bootstrap/dist/css/bootstrap.css',
        'bower_components/bootstrap/dist/css/bootstrap.css.map',
        'bower_components/font-awesome/css/font-awesome.css'
      ])
      .pipe(gulp.dest('public/css/vendors')),
    gulp.src(['bower_components/font-awesome/fonts/*'])
      .pipe(gulp.dest('public/fonts'))
  );
});

gulp.task('assets', function(){
  return gulp.src(['src/images/*'])
    .pipe(plugins.changed('public/images'))
    .pipe(gulp.dest('public/images'))
    .pipe(plugins.connect.reload());
});

gulp.task('scripts', function() {
  return gulp.src(['src/scripts/**/*.js', '!src/scripts/vendors/*'])
    .pipe(plugins.changed('public/js'))
    .pipe(plugins.eslint({
      configFile: '.eslintrc'
    }))
    .pipe(plugins.babel({
      presets: ['babel-preset-es2017']
    }))
    .pipe(gulp.dest('public/js'))
    .pipe(plugins.connect.reload());
})

gulp.task('styles', function() {
  return gulp.src(['src/less/**/*.less'])
    .pipe(plugins.changed('public/css'))
    .pipe(plugins.less({
      plugins: [autoprefix]
    }))
    .pipe(gulp.dest('public/css'))
    .pipe(plugins.connect.reload());
})

gulp.task('html', function () {
  return gulp.src('src/pages/**/*.pug')
    .pipe(plugins.changed('public/'))
    .pipe(plugins.pug({pretty:true}))
    .pipe(gulp.dest('public/'))
    .pipe(plugins.connect.reload());
});

gulp.task('usemin', function(){
  return gulp.src('public/**/*.html')
    .pipe(plugins.changed('public/**/*.html'))
    .pipe(plugins.usemin({
      css: [ plugins.rev],
      html: [ function () {return plugins.htmlmin({ collapseWhitespace: true });} ],
      js: [ function(){return plugins.babel({minified:true})}, plugins.rev ],
      inlinejs: [ plugins.uglify ],
      inlinecss: [ plugins.cleanCss, 'concat' ]
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('imagemin', function(){
  return gulp.src('public/images/*')
    .pipe(plugins.changed('public/images/*'))
    .pipe(plugins.imagemin())
    .pipe(gulp.dest('dist/images'));
});

gulp.task('dist', ['usemin', 'imagemin']);

gulp.task('build', function(){
  runSeq(['vendors', 'assets', 'html', 'scripts', 'styles'], function(){return;});
});

gulp.task('serve', function(){ 
  if(argv.dist){
    settings.build.dist = true;
    runSeq(['dist', 'connect', 'watch']);
  }else{
    runSeq(['build', 'connect', 'watch']);
  }
});

gulp.task('default', function(){
  console.log('build  : build site at public by compiling src');
  console.log(plugins);

});
