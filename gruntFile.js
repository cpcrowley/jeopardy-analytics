module.exports = function(grunt) {
    'use strict';
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browserify');

    grunt.registerTask('default', ['browserify', 'watch']);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        browserify: {
            main: {
                options: {
                    browserifyOptions: {
                        debug: true
                    }
                },
                src: 'site/index.js',
                dest: 'site/bundle.js'
            }
        },
        watch: {
            files: 'site/*',
            tasks: ['default']
        },
        uglify: {
            options: {
                drop_console: true,
                sourceMap: true,
                sourceMapName: 'bundle.js.map',
                mangle: {
                    except: ['jQuery', 'Backbone']
                }
            },
            my_target: {
                files: {
                    'site/bundle.min.js': ['site/bundle.js']
                }
            }
        }
    });
};