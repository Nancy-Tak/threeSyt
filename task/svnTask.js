/**
 * 生成环境，更新到SVN
 *
 */
var gulp = require('gulp');
var config = require('../config.json')
var pkg = require('../package.json')
var svn = require('../svn.json')
var gulp = require('gulp')
var path = require('path')
var fs = require('fs')
var $ = require('gulp-load-plugins')()
var connect = $.connect
var del = require('del')

var Lib = require('../lib')

module.exports = function svnTask(banner) {
  // 临时文件夹
  var tmpPath = './tmp';

  // 模板
  gulp.task('svnTemplate', function() {
    return gulp.src(['./' + config.destPath + '/**/**.html'])
      //.pipe($.changed(svn.path))
      .pipe($.replace(/\/static/g, '../static'))
      .pipe($.replace(/"(\/)bower_components\/(.*)\/([a-zA-Z0-9.-]+\.js)(.*)"/g, '"../static/js/$3$4"'))
      //.pipe(gulp.dest(svn.path))
      .pipe(gulp.dest(tmpPath))
  });

  // 拷贝
  gulp.task('svnCopy', function() {
    return gulp.src([config.staticPath + '/iconfont/**/**', config.staticPath + '/iconfont-ie7/**/**', config.staticPath + '/js/bootstrap-calendar/**/**', config.staticPath + '/mock_data/**/**'], {
        base: 'client'
      })
      .pipe($.changed(svn.staticPath))
      //.pipe(gulp.dest(svn.staticPath))
      .pipe(gulp.dest(tmpPath + svn.staticPath))
  })

  // css
  gulp.task('svnCss', function() {
    return gulp.src([config.staticPath + '/css/**/**.css'], {
        base: 'client'
      })
      .pipe($.plumber({
        errorHandler: Lib.errHandler
      }))
      .pipe($.changed(svn.staticPath))
      .pipe($.minifyCss({
        compatibility: 'ie7'
      }))
      .pipe($.header(banner, {
        pkg: pkg
      }))
      //.pipe(gulp.dest(svn.staticPath))
      .pipe(gulp.dest(tmpPath + svn.staticPath))
  })

  // js
  gulp.task('svnJs', function() {
    return gulp.src([config.staticPath + '/js/**/**.js', '!' + config.staticPath + '/js/bootstrap-calendar/**/**'], {
        base: 'client'
      })
      .pipe($.plumber({
        errorHandler: Lib.errHandler
      }))
      .pipe($.changed(svn.staticPath))
      //.pipe($.uglify({mangle: false}))
      .pipe($.uglify())
      .pipe($.header(banner, {
        pkg: pkg
      }))
      //.pipe(gulp.dest(svn.staticPath))
      .pipe(gulp.dest(tmpPath + svn.staticPath))
  })

  // js里面的非js静态资源
  gulp.task('svnJsCss', function() {
    return gulp.src([config.staticPath + '/js/**/**.css', config.staticPath + '/js/**/**.swf', config.staticPath + '/js/**/**.png', '!' + config.staticPath + '/js/bootstrap-calendar/**/**'], {
        base: 'client'
      })
      .pipe($.plumber({
        errorHandler: Lib.errHandler
      }))
      .pipe($.changed(svn.staticPath))
      //.pipe($.uglify({mangle: false}))
      .pipe($.header(banner, {
        pkg: pkg
      }))
      //.pipe(gulp.dest(svn.staticPath))
      .pipe(gulp.dest(tmpPath + svn.staticPath))
  })

  gulp.task('svnBowerJs', function() {
    return gulp.src(config.jsPath)
      .pipe($.changed(svn.staticPath))
      //.pipe(gulp.dest(svn.staticPath+'/js'))
      .pipe(gulp.dest(tmpPath + svn.staticPath + '/js'))
  })

  // images
  gulp.task('svnImage', function() {
    return gulp.src([config.staticPath + '/images/**/**', '!' + config.staticPath + '/images/sprite/sprite-**/', '!' + config.staticPath + '/images/sprite/sprite-**/**/**'])
      .pipe($.plumber({
        errorHandler: Lib.errrHandler
      }))
      .pipe($.changed(svn.staticPath))
      .pipe($.imagemin({
        optimizationLevel: 5,
        progressive: true,
        svgoPlugins: [{
            removeViewBox: false
          }] //,
          //use: [pngquant()]
      }))
      //.pipe(gulp.dest(svn.staticPath+'/images'))
      .pipe(gulp.dest(tmpPath + svn.staticPath + '/images'))
  })

  gulp.task('zip', ['svnTemplate', 'svnCopy', 'svnCss', 'svnJs', 'svnJsCss', 'svnImage', 'svnBowerJs'], function() {
    return gulp.src(tmpPath + '/**/**')
      .pipe($.zip(pkg.name + '.zip'))
      .pipe(gulp.dest(tmpPath))
  });

  gulp.task('build', ['svnTemplate', 'svnCopy', 'svnCss', 'svnJs', 'svnJsCss', 'svnImage', 'svnBowerJs'], function() {
    return gulp.src(tmpPath + '/**/**')
      .pipe(gulp.dest(svn.path))
  })

  gulp.task('removeTmp', function() {
    del([tmpPath, tmpPath + '/**/**'])
  })

  gulp.task('svnServer', ['build'], function() {
    connect.server({
      root: svn.path,
      port: svn.port
    });

    console.log('server start at: http://localhost:' + svn.port + '/')

    Lib.openURL('http://localhost:' + svn.port + '/')

    // 删除临时文件夹
    del([tmpPath, tmpPath + '/**/**']);
  })

  gulp.task('svn', function() {
    gulp.start(['svnServer']);
  });

  gulp.task('bundle-2', ['build'], function(callback) {

    // 删除临时文件夹
    console.log('bundle finished')
    del.sync([tmpPath, tmpPath + '/**/**']);

    // callback();

    process.exit();
  })
}
