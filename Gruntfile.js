module.exports = function (grunt) {

    grunt.initConfig({

        /*
        * Grab the settings from the package file
        */
        pkg: grunt.file.readJSON('package.json'),

        /*
        * Lint all non-vendor scripts
        */
        jshint: {
            wax: {
                options: {
                    jshintrc: true
                },
                src: ['app/assets/scripts/**/*.js']    
            }
        },

        /*
        * Config compass
        */
        compass: {
            wax: {
                options: {
                    sassDir: 'scss',
                    cssDir: 'app/assets/css',
                    config: 'config.rb'
                }
            }
        },

        /*
        * Tasks instigated by 'grunt watch'
        */
        watch: {
            sass: {
                files: ['scss/**/*.scss'],
                tasks: ['compass:wax']
            },
            lint: {
                files: ['/app/assets/scripts/**/*.js'],
                tasks: ['jshint:wax']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.registerTask('lint', [ 'jshint:wax' ]);
    grunt.registerTask('default', [ 'jshint:wax' ]);
};