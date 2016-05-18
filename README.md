##Requirements
- Node v0.12.14
- Redis Server
- MongoDB

make sure that grunt-cli is not available globally as this might conflict with subgrunt

## Intro

This is mainly code copy/pasted from the original mean.js (https://github.com/meanjs/mean) project.

I choose to separate the client & server folders for future separation of concern. (run the server with asp, php or other) plus integration with angular.js server (https://github.com/a-lucas/angular.js-server) for server side rendering.

Instead of using Passport.js, I replaced it with the oauthd (https://github.com/oauth-io/oauthd) project.

Bootstrap is replaced my lumX (https://github.com/lumapps/lumX).

Also internationalization is implemented with angular-gettext (https://github.com/rubenv/angular-gettext).

This is a Work in Progress, please don't test it now, as it will probably not work.

Severall todos in the list: 

1- Angular.js-server for advanced server side rendering
2- Yeoman generator
3- Better I18n config
4- Role management interface


## Installation
`npm install`

`npm run installOAuthd`

## Running OAuthD server
` npm run oauthd`

## Setting configuration variables

Once your OAUTHD server instance is running,
- go to http://localhost:6284
- setup your username/password
- create an app
- setup your username/password, and your appID and appScret in `config/env/default`
- Add a provider in your app

The you shall be able to login

## Running The site
`npm run grunt`





