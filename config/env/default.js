'use strict';

module.exports = {
  app: {
    title: 'CUSTOM MEAN.JS',
    description: 'Full-Stack JavaScript with MongoDB, Express, AngularJS, and Node.js',
    keywords: 'mongodb, express, angularjs, node.js, mongoose, passport',
    googleAnalyticsTrackingID: process.env.GOOGLE_ANALYTICS_TRACKING_ID || 'GOOGLE_ANALYTICS_TRACKING_ID',
    languages: [
      {
        name: 'English',
        id: 'en'
      },
      {
        name: 'French',
        id: 'fr'
      }
    ]
  },
  port: process.env.PORT || 3000,
  host: process.env.HOST || '0.0.0.0',
  templateEngine: 'swig',
  // Session Cookie settings
  sessionCookie: {
    // session expiration is set by default to 24 hours
    maxAge: 24 * (60 * 60 * 1000),
    // httpOnly flag makes sure the cookie is only accessed
    // through the HTTP protocol and not JS/browser
    httpOnly: true,
    // secure cookie should be turned to true to provide additional
    // layer of security so that the cookie is set only when working
    // in HTTPS mode.
    secure: false
  },
  oauthd: {
    login: 'cooluhuru@gmail.com',
    pass: 'qwe123QWE',
    serverURL: 'http://localhost:6284',
    OAUTHD_ID: 'Ljs_v2bxsG77cXLXtkWaOm4nAHE',
    OAUTHD_SECRET: 'pfu1o7O5dry0llvQ9c0pSUxLF20'
  },
  // sessionSecret should be changed for security measures and concerns
  sessionSecret: process.env.SESSION_SECRET || 'MEAN',
  jwt: {
    secret: process.env.TOKEN_SECRET || 'shhhhhhhhhh',
    authHeaderName: 'x-access-token'
  },
  // sessionKey is set to the generic sessionId key used by PHP applications
  // for obsecurity reasons
  sessionKey: 'sessionId',
  sessionCollection: 'sessions',
  logo: 'logo.png',
  favicon: 'favicon.ico',
  uploads: {
    profileUpload: {
      dest: './client/core/img/profile/uploads/', // Profile upload destination path
      limits: {
        fileSize: 1 * 1024 * 1024 // Max file size in bytes (1 MB)
      }
    }
  }
};
