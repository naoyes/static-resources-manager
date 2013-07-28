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

  grunt.initConfig({
    cssmin: {
      compress: {
        files: {'/home/vagrant/www/orange/app/public/assets/css/min.css': grunt.file.expand('/home/vagrant/www/orange/app/public/assets/css/*.css')}
      }
    },
    slim: {
      dist: {
        files: globToMultiFiles('**', '/home/vagrant/www/orange/app/fuel/app/views', {
                  cwd: '/home/vagrant/www/orange/app/assets/slim',
                  processName: function(fileName) {
                                  fileName = fileName.replace('.slim', '.php');
                                  return fileName;
                               }
                })
      }
    },
    watch: {
      files: ['/home/vagrant/www/orange/app/public/assets/css/*.css', '/home/vagrant/www/orange/app/assets/slim/*.slim'],
      tasks: ['cssmin', 'slim']
    }
  });

  var taskName;
  for(taskName in pkg.devDependencies) {
    if(taskName.substring(0, 6) == 'grunt-') {
      grunt.loadNpmTasks(taskName);
    }
  }

  grunt.registerTask('default', ['cssmin', 'slim', 'watch']);
};
