module.exports = function(grunt) {
  'use strict';

  var pkg = grunt.file.readJSON('package.json');
  grunt.initConfig({
    watch: {
      cssmin: {
        files: ['build/css/**/*.css'],
        tasks: ['cssmin:minify'],
      },
      compass: {
        files: ['src/sass/**/*.scss'],
        tasks: ['compass:dev'],
      },
      slim_statics: {
        files: ['src/slim/statics/**/*.slim'],
        tasks: ['slim:dev_statics'],
      },
      slim_app_views: {
        files: ['src/slim/app_views/**/*.slim'],
        tasks: ['slim:dev_app_views'],
      },
      typescript: {
        files: ['src/ts/**/*.ts'],
        tasks: ['typescript:dev'],
      },
    },
    compass: {
      dev: {
        options: {
          sassDir: 'src/sass',
          cssDir: 'build/css',
        }
      },
      prod: {
        options: {
          sassDir: 'src/sass',
          cssDir: 'build/css',
          environment: "production",
        }
      }
    },
    cssmin: {
      minify: {
        expand: true,
        cwd: 'build/css/',
        src: ['*.css', '!*.min.css'],
        dest: 'build/css/',
        ext: '.min.css',
      }
    },
    slim: {
      dev_statics: {
        files: [
          {
            expand: true,
            cwd: 'src/slim/statics',
            src: ['**/*.slim'],
            dest: 'build/html/statics',
            ext: '.html',
          },
        ],
        options: {
          pretty: true
        },
      },
      dev_app_views: {
        files: [
          {
            expand: true,
            cwd: 'src/slim/app_views',
            src: ['**/*.slim'],
            dest: 'build/html/app_views',
            ext: '.html',
          },
        ],
        options: {
          pretty: true
        },
      },
      dist_statics: {
        files: [
          {
            expand: true,
            cwd: 'src/slim/statics',
            src: ['**/*.slim'],
            dest: 'build/statics',
            ext: '.html',
          },
        ],
      },
      dist_app_views: {
        files: [
          {
            expand: true,
            cwd: 'src/slim/app_views',
            src: ['**/*.slim'],
            dest: 'build/app_views',
            ext: '.html',
          },
        ],
      },
    },
    typescript: {
      dev: {
        files: [
          {
            expand: true,
            cwd: 'src/ts',
            src: ['**/*.ts'],
            dest: 'build/js',
            ext: '.js',
          },
        ],
      },
      dist: {
        option: {
          sourcemap: false,
        },
        files: [
          {
            expand: true,
            cwd: 'src/ts',
            src: ['**/*.ts'],
            dest: 'build/js',
            ext: '.js',
          },
        ],
      },
    },
  });

  var taskName;
  for(taskName in pkg.devDependencies) {
    if(taskName.substring(0, 6) == 'grunt-') {
      grunt.loadNpmTasks(taskName);
    }
  }

  grunt.log.writeln('hello'); // log sample
  grunt.registerTask('default', ['compass:dev', 'cssmin', 'slim:dev_statics', 'slim:dev_app_views', 'typescript:dev', 'watch']);
};
