module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      src: ['public/src/js/**/*.js', '!public/src/js/_bower.js']
    },
    bower_concat: {
      all: {
        dest: {
          'public/js': 'public/src/js/_bower.js'
        }
      }
    },
    sass: {
      expanded: {
        options: { outputStyle: 'expanded' },
        files: { 'public/css/style.css': 'public/src/scss/style.scss' }
      },
      compressed: {
        options: { outputStyle: 'compressed' },
        files: { 'public/css/style.min.css': 'public/src/scss/style.scss' }
      }
    },
    concat: {
      dist: {
        src: ['public/src/js/app.js', 'public/src/js/**/*.js'],
        dest: 'public/js/app.js'
      }
    },
    uglify: {
      'public/js/app.min.js': 'public/js/app.js'
    },
    watch: {
      configFiles: {
        files: ['Gruntfile.js', 'package.json'],
        options: { reload: true }
      },
      scss: {
        files: ['public/src/scss/**/*.scss'],
        tasks: ['sass'],
        options: { livereload: true }
      },
      js: {
        files: ['public/src/js/**/*.js'],
        tasks: ['jshint', 'concat', 'uglify'],
        options: { livereload: true }
      },
      index: {
        files: ['public/index.html'],
        options: { livereload: true }
      }
    },
    replace: {
      production: {
        options: {
          patterns: [{
            match: /app\.js/,
            replacement: 'app.min.js'
          },{
            match: /style\.css/,
            replacement: 'style.min.css'
          }]
        },
        files: [
          { expand: true, flatten: true, src: ['public/index.html'] }
        ]
      },
      development: {
        options: {
          patterns: [{
            match: /app\.min\.js/,
            replacement: 'app.js'
          },{
            match: /style\.min\.css/,
            replacement: 'style.css'
          }]
        },
        files: [
          { expand: true, flatten: true, src: ['public/index.html'] }
        ]
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask("default", ['jshint', 'bower_concat', 'sass:expanded', 'concat', 'uglify', 'watch']);
  grunt.registerTask("deploy", ['jshint', 'bower_concat', 'sass:compressed', 'concat', 'uglify']);
};
