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
        files: {'dest/css/min.css': grunt.file.expand('src/css/*.css')}
      }
    },
    slim: {
      dist: {
        files: globToMultiFiles('**', 'dest/html', {
                  cwd: 'src/slim',
                  processName: function(fileName) {
                                  fileName = fileName.replace('.slim', '.html');
                                  return fileName;
                               }
                })
      }
    },
    watch: {
      files: ['src/css/*.css', 'src/slim/*.slim'],
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
