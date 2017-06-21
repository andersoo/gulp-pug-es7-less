
// Gulp, and auto load plugins
var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var fs = require('fs');

// some plugins need a manual load
// and some frequently used ones can have a easier quickhand
var gutil = require('gulp-util');
var gpIf = plugins.if;
var del = require('del');
// var runSeq = require('run-sequence');

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

gulp.task('connect', function(done) {
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
  process.on('SIGINT', function() { done(); });
});

var promiseResolver = function(resolve, conditionFx, condition){
  if( conditionFx(condition)){
    resolve();
  }
}
gulp.task('watch', function(done){
  gulp.watch(['src/pages/**/*.pug','src/partials/**/*.pug','src/layouts/**/*.pug'], gulp.series('html'));
  gulp.watch('src/less/**/*.less', gulp.series('styles'));
  gulp.watch(['src/scripts/**/*.js', '!src/scripts/vendors/*'], gulp.series('scripts'));
  gulp.watch('src/images/*', gulp.series('assets'));

  process.on('SIGINT', function() { done(); });
});

gulp.task('vendor:scripts', function(){
  return gulp.src([
      'node_modules/jquery/dist/jquery.slim.js',
      'node_modules/fetch/lib/fetch.js',
      'node_modules/tether/dist/js/tether.js',
      'node_modules/bootstrap/dist/js/bootstrap.js'
    ])
    .pipe(gulp.dest('public/js/vendors'));
});

gulp.task('vendor:styles', function(){
  return gulp.src([
      'node_modules/tether/dist/css/tether.css',
      'node_modules/bootstrap/dist/css/bootstrap.css',
      'node_modules/bootstrap/dist/css/bootstrap.css.map',
      'node_modules/font-awesome/css/font-awesome.css'
    ])
    .pipe(gulp.dest('public/css/vendors'));
});
gulp.task('vendor:fonts', function(){
  return  gulp.src(['node_modules/font-awesome/fonts/*'])
    .pipe(gulp.dest('public/fonts'));
});

gulp.task('vendors', gulp.parallel('vendor:scripts','vendor:styles','vendor:fonts'));

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

gulp.task('dist', gulp.series('usemin', 'imagemin'));

gulp.task('build', gulp.parallel('vendors', 'assets', 'html', 'scripts', 'styles'));

var serveSeq =  gulp.series('build', gulp.parallel('connect', 'watch'));
if(argv.dist){
  serveSeq = gulp.series('dist', gulp.parallel('connect', 'watch'));
}
gulp.task('serve', serveSeq);



gulp.task('default', function(){
  console.log('build  : build site at public by compiling src');
  console.log(plugins);

});
