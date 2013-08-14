'use strict';

module.exports = function(grunt) {
  var pkg = grunt.file.readJSON('package.json');
  var globToMultiFiles = function (glob, dest, options) {
    var path = require('path');

    grunt.util = grunt.util || grunt.utils;

    dest = grunt.template.process(dest);

    options = grunt.util._.defaults(options || {}, {
      cwd: '',
      minimatch: {},
      processName: false
    });

    if (options.cwd.length > 0) {
      options.minimatch.cwd = options.cwd;
    }

    var result = {};

    var destFile;
    var srcFile;

    var fileName;
    var filePath;

    grunt.file.expand(options.minimatch, glob).forEach(function(file) {

      fileName = path.basename(file);
      filePath = path.dirname(file);

      srcFile = path.join(options.cwd, file);

      if (options.processName && grunt.util.kindOf(options.processName) === 'function') {
        fileName = options.processName(fileName) || fileName;
      }

      destFile = path.join(dest, filePath, fileName);
      if (grunt.file.isFile(srcFile)) {
        result[destFile] = srcFile;
      }
    });

    return result;
  }

  // path settings
  var appRoot = '/home/vagrant/www/orange/app';
  var srcRoot = appRoot + '/assets'
  var appViewPath = appRoot + '/fuel/app/views';
  var assetsPath = appRoot + '/public/assets';
  grunt.initConfig({
    cssmin: {
      compress: {
        files: (function(){
                 var obj = {};
                 obj[assetsPath + '/css/min.css'] = grunt.file.expand(srcRoot + '/css/*.css');
                 return obj;
               })(),
      }
    },
    slim: {
      dev_app_views: {
        files: globToMultiFiles('**', appViewPath, {
                  cwd: srcRoot + '/slim/app_views',
                  processName: function(fileName) {
                                  fileName = fileName.replace('.slim', '');
                                  return fileName;
                               }
                }),
        options: {
          pretty: true
        }
      },
      dev_statics: {
        files: globToMultiFiles('**', assetsPath + '/..', {
                  cwd: srcRoot + '/slim/statics',
                  processName: function(fileName) {
                                  fileName = fileName.replace('.slim', '');
                                  return fileName;
                               }
                }),
        options: {
          pretty: true
        }
      },
      dist_app_views: {
        files: globToMultiFiles('**', appViewPath, {
                  cwd: srcRoot + '/slim/app_views',
                  processName: function(fileName) {
                                  fileName = fileName.replace('.slim', '');
                                  return fileName;
                               }
                })
      },
      dist_statics: {
        files: globToMultiFiles('**', assetsPath + '/..', {
                  cwd: srcRoot + '/slim/statics',
                  processName: function(fileName) {
                                  fileName = fileName.replace('.slim', '');
                                  return fileName;
                               }
                })
      }
    },
    watch: {
      files: [srcRoot + '/css/*.css', srcRoot + '/slim/*/*.slim'],
      tasks: ['cssmin', 'slim:dev_app_views', 'slim:dev_statics']
    },
    compass: {
      dev: {
        options: {
          // 設定ファイル
          config: "compass_config.rb",
          // 環境
          environment: "development"
        }
      },
      prod: {
        options: {
          config: "compass_config.rb",
          environment: "production"
        }
      }
    }
  });

  var taskName;
  for(taskName in pkg.devDependencies) {
    if(taskName.substring(0, 6) == 'grunt-') {
      grunt.loadNpmTasks(taskName);
    }
  }

  grunt.registerTask('default', ['cssmin', 'slim:dev_app_views', 'slim:dev_statics', 'watch']);
};
