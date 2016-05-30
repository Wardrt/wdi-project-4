module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      src: ['src/js/**/*.js']
    },
    sass: {
      expanded: {
        options: { outputStyle: 'expanded' },
        files: { 'public/css/style.css': 'src/scss/style.scss' }
      },
      compressed: {
        options: { outputStyle: 'compressed' },
        files: { 'public/css/style.min.css': 'src/scss/style.scss' }
      }
    },
    concat: {
      dist: {
        src: ['src/js/app.js', 'src/js/**/*.js'],
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
        files: ['src/scss/**/*.scss'],
        tasks: ['sass'],
        options: { livereload: true }
      },
      js: {
        files: ['src/js/**/*.js'],
        tasks: ['jshint', 'concat', 'uglify'],
        options: { livereload: true }
      },
      index: {
        files: ['public/index.html'],
        options: { livereload: true }
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.registerTask("default", ['jshint', 'sass:expanded', 'concat', 'uglify', 'watch']);
  // grunt.registerTask("deploy", ['jshint', 'sass:compressed', 'concat', 'uglify']);
};
