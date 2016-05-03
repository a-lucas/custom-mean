'use strict';

module.exports = {
  client: {
    lib: {
      css: [

        //'public/lib/bootstrap/dist/css/bootstrap.css',
        //'public/lib/bootstrap/dist/css/bootstrap-theme.css'
      ],
      js: [

        'public/lib/angular/angular.js',
        'public/lib/angular-resource/angular-resource.js',
        'public/lib/angular-animate/angular-animate.js',
        'public/lib/angular-messages/angular-messages.js',
        'public/lib/angular-ui-router/release/angular-ui-router.js',
        //'public/lib/angular-file-upload/angular-file-upload.js',
        'public/lib/angular-gettext/dist/angular-gettext.js',
        'public/lib/oauth-js/dist/oauth.js',
        'public/lib/velocity/velocity.js',
        'public/lib/moment/min/moment-with-locales.js',
        'public/lib/lumx/dist/lumx.js'
      ]
    },
    providers: 'public/providers',
    css: [
      'public/dist/lumx.css',
      'client/**/css/*.css'
    ],
    csslint: [
      'client/**/css/*.css'
    ],
    gettext: 'public/translation.js',
    lumx: {
      source: 'scss/main.scss',
      dist: 'public/dist/lumx.css'
    },
    scss: [
      'client/**/scss/*.scss'
    ],
    js: [
      'client/config.js',
      'client/init.js',
      'client/translation.js',
      'client/**/*.js',
      'client/**/*/*.js'
    ],
    jshint: [
      'client/config.js',
      'client/init.js',
      'client/*/*.js',
      'client/*/**/*.js'
    ],
    img: [
      'client/*/img/**/*.jpg',
      'client/*/img/**/*.png',
      'client/*/img/**/*.gif',
      'client/*/img/**/*.svg'
    ],
    views: ['client/**/views/*.html'],
    templates: ['build/templates.js']
  },
  server: {
    gruntConfig: ['gruntfile.js'],
    allJS: ['server.js', 'config/**/*.js', 'server/*/**/*.js'],
    models: 'server/*/models/**/*.js',
    routes: ['server/!(core)/routes/*.js', 'server/core/routes/*.js'],
    sockets: 'server/*/sockets/*.js',
    config: ['server/*/config/*.js'],
    policies: 'server/*/policies/*.js',
    views: ['server/*/views/*.html']
  }
};
