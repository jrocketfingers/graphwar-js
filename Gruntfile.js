/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Task configuration.
    typescript: {
        base: {
            src: ['lib/**/*.ts'],
            dest: 'js',
            options: {
                module: 'amd',
                target: 'es5',
                basePath: 'lib/',
                sourceMap: true,
            }
        }
    },

    watch: {
      app: {
        files: '<%= typescript.base.src %>',
        tasks: ['typescript']
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-typescript');

  // Default task.
  grunt.registerTask('default', ['watch:app']);

};
