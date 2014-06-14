'use strict';

module.exports = function(grunt) {
// configure grunt
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        jekyll: {
            options: {
                src: 'src',
                config: 'src/_config.yml'
            },
            build: {
                options: {
                    dest: 'build'
                }
            }
        },

        less: {
            build: {
                files: {
                    'build/css/main.css': 'src/less/main.less'
                }
            }
        },

        browserify: {
            build: {
                files: {
                    'build/js/main.js': 'src/js/main.js',
                    'build/js/main2.js': 'src/js/main2.js',
                    'build/js/main3.js': 'src/js/main3.js',
                    'build/js/main4.js': 'src/js/main4.js',
                },
                options: {
                    bundleOptions: { debug: true },
                    noParse: ['jquery']
                }
            }
        },

        watch: {
            grunt: {
                files: 'Gruntfile.js' // reload Gruntfile when it changes
            },
            less: {
                files: 'src/less/*.less',
                tasks: ['less:build']
            },
            browserify: {
                files: 'src/js/*.js',
                tasks: ['browserify:build']
            },
            jekyll: {
                files: ['src/**/*.html', 'src/_posts/*.markdown'],
                tasks: ['jekyll:build', 'less:build', 'browserify:build']
            }
        },

        connect: {
            server: {
                options: {
                    port: 4000,
                    base: 'build'
                }
            }
        }

    });

// Load plug-ins
    grunt.loadNpmTasks('grunt-jekyll');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');

// define tasks
    grunt.registerTask('build', [
        'jekyll:build',     // build jekyll HTML from /src to /build
        'less:build',       // compile /src/less/*.less to /build/css/*.css
        'browserify:build'  // bundle js from src/js/main.js to build/js/main.js
    ]);
    grunt.registerTask('dev', [
        'build',
        'connect:server',   // run development server on localhost:4000
        'watch'             // watch for changes to html & less
    ]);
    grunt.registerTask('default', 'dev');
};