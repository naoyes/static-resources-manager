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
      requirejs: {
        files: ['src/js/**/*.js'],
        tasks: ['requirejs'],
      },
    },
    compass: {
      dev: {
        options: {
          sassDir: 'src/sass',
          cssDir: 'public/assets/css',
        }
      },
      prod: {
        options: {
          sassDir: 'src/sass',
          cssDir: 'public/assets/css',
          environment: "production",
        }
      }
    },
    cssmin: {
      minify: {
        expand: true,
        cwd: 'public/assets/css/',
        src: ['*.css', '!*.min.css'],
        dest: 'public/assets/css/',
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
            dest: 'public',
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
            dest: 'views',
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
            dest: 'public',
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
            dest: 'views',
            ext: '.html',
          },
        ],
      },
    },
    requirejs: {
      options: {
        baseUrl: 'src',
        paths: {
            'jquery': '../bower_components/jquery/jquery.min',
            'underscore': '../bower_components/underscore-amd/underscore-min',
            'backbone': '../bower_components/backbone-amd/backbone-min',
        },
        shim: {
            'jquery': {
                exports: '$',
            },
            'underscore': {
                exports: '_',
            },
            'backbone': {
                deps: ['jquery', 'underscore'],
                exports: 'Backbone',
            },
        },
        optimize: "none",
      },
      dummy: {
        options: {name: 'js/app', out: 'app.min.js'},
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
  //grunt.registerTask('default', ['compass:dev', 'cssmin', 'slim:dev_statics', 'slim:dev_app_views', 'requirejs', 'watch']);
  grunt.registerTask('default', ['requirejs']);
};
