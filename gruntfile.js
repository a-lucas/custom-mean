'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  defaultAssets = require('./config/assets/default'),
  fs = require('fs'),
  path = require('path');

module.exports = function (grunt) {
  // Project Configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    env: {
      dev: {
        NODE_ENV: 'development'
      },
      prod: {
        NODE_ENV: 'production'
      }
    },
    watch: {
      serverViews: {
        files: defaultAssets.server.views,
        options: {
          livereload: true
        }
      },
      serverJS: {
        files: _.union(defaultAssets.server.gruntConfig, defaultAssets.server.allJS),
        tasks: ['jshint'],
        options: {
          livereload: true
        }
      },
      clientViews: {
        files: defaultAssets.client.views,
        options: {
          livereload: true
        }
      },
      clientJS: {
        files: defaultAssets.client.jshint,
        tasks: ['jshint'],
        options: {
          livereload: true
        }
      },
      clientCSS: {
        files: defaultAssets.client.css,
        tasks: ['csslint'],
        options: {
          livereload: true
        }
      },
      clientSCSS: {
        files: defaultAssets.client.scss,
        tasks: ['sass:dist', 'csslint'],
        options: {
          livereload: true
        }
      },
      lumxSCSS: {
        files: [defaultAssets.client.lumx.source],
        tasks: ['sass:lumx'],
        options: {
          livereload: true
        }
      }
    },
    nodemon: {
      dev: {
        script: 'server.js',
        options: {
          nodeArgs: ['--debug'],
          ext: 'js,html',
          watch: _.union(defaultAssets.server.gruntConfig, defaultAssets.server.views, defaultAssets.server.allJS, defaultAssets.server.config)
        }
      }
    },
    concurrent: {
      default: ['nodemon', 'watch'],
      debug: ['nodemon', 'watch', 'node-inspector'],
      options: {
        logConcurrentOutput: true
      }
    },
    jshint: {
      all: {
        src: _.union(defaultAssets.server.gruntConfig, defaultAssets.server.allJS, defaultAssets.client.jshint),
        options: {
          jshintrc: true,
          node: true,
          mocha: true,
          jasmine: true,
          reporter: require('jshint-stylish')
        }
      }
    },
    eslint: {
      options: {},
      target: _.union(defaultAssets.server.gruntConfig, defaultAssets.server.allJS, defaultAssets.client.jshint)
    },
    csslint: {
      options: {
        csslintrc: '.csslintrc'
      },
      all: {
        src: defaultAssets.client.csslint
      }
    },
    ngAnnotate: {
      production: {
        files: {
          'public/dist/application.js': defaultAssets.client.js
        }
      }
    },
    uglify: {
      production: {
        options: {
          mangle: false
        },
        files: {
          'public/dist/application.min.js': 'public/dist/application.js'
        }
      }
    },
    nggettext_extract: {
      pot: {
        files: {
          'po/template.pot': defaultAssets.client.views
        }
      }
    },
    nggettext_compile: {
      all: {
        files: {
          'client/translation.js': ['po/*.po']
        }
      }
    },
    cssmin: {
      combine: {
        files: {
          'public/dist/application.min.css': defaultAssets.client.css
        }
      }
    },
    sass: {
      dist: {
        options: {
          style: 'expanded',
        },
        files: [{
          expand: true,
          src: defaultAssets.client.scss,
          ext: '.css',
          rename: function (base, src) {
            return src.replace('/scss/', '/css/');
          }
        }]
      },
      lumx: {
        options: {
          style: 'expanded',
          loadPath: ['public/lib/gridle/sass', 'public/lib/bourbon/app/assets/stylesheets/', 'public/lib/mdi/scss/']
        },
        files: {
          'public/dist/lumx.css': defaultAssets.client.lumx.source
        }
      }
    },
    'node-inspector': {
      custom: {
        options: {
          'web-port': 1337,
          'web-host': 'localhost',
          'debug-port': 5858,
          'save-live-edit': true,
          'no-preload': true,
          'stack-trace-limit': 50,
          'hidden': []
        }
      }
    },
    copy: {
      localConfig: {
        src: 'config/env/local.example.js',
        dest: 'config/env/local-development.js',
        filter: function () {
          return !fs.existsSync('config/env/local-development.js');
        }
      }
    }
  });


  // Load NPM tasks
  require('load-grunt-tasks')(grunt);

  // Make sure upload directory exists
  grunt.task.registerTask('mkdir:upload', 'Task that makes sure upload directory exists.', function () {
    // Get the callback
    var done = this.async();

    grunt.file.mkdir(path.normalize(__dirname + '/client/core/img/profile/uploads'));

    done();
  });

  // Connect to the MongoDB instance and load the models
  grunt.task.registerTask('mongoose', 'Task that connects to the MongoDB instance and loads the application models.', function () {
    // Get the callback
    var done = this.async();

    // Use mongoose configuration
    var mongoose = require('./config/lib/mongoose.js');

    // Connect to database
    mongoose.connect(function (db) {
      done();
    });
  });

  // Drops the MongoDB database, used in e2e testing
  grunt.task.registerTask('dropdb', 'drop the database', function () {
    // async mode
    var done = this.async();

    // Use mongoose configuration
    var mongoose = require('./config/lib/mongoose.js');

    mongoose.connect(function (db) {
      db.connection.db.dropDatabase(function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log('Successfully dropped db: ', db.connection.db.databaseName);
        }
        db.connection.db.close(done);
      });
    });
  });

  grunt.task.registerTask('server', 'Starting the server', function () {
    // Get the callback
    var done = this.async();

    var path = require('path');
    var app = require(path.resolve('./config/lib/app'));
    var server = app.start(function () {
      done();
    });
  });

  // Lint CSS and JavaScript files.
  grunt.registerTask('lint', ['sass:dist', 'sass:lumx', 'jshint', 'eslint', 'csslint']);

  // Lint project files and minify them into two production files.
  grunt.registerTask('build', ['env:dev', 'lint', 'ngAnnotate', 'uglify', 'cssmin']);


  // Run the project in development mode
  grunt.registerTask('translate', ['nggettext_extract', 'nggettext_compile']);


  // Run the project in development mode
  grunt.registerTask('default', ['env:dev', 'lint', 'mkdir:upload', 'copy:localConfig', 'concurrent:default']);

  // Run the project in debug mode
  grunt.registerTask('debug', ['env:dev', 'lint', 'mkdir:upload', 'copy:localConfig', 'concurrent:debug']);

  // Run the project in production mode
  grunt.registerTask('prod', ['build', 'env:prod', 'mkdir:upload', 'copy:localConfig', 'concurrent:default']);
};
