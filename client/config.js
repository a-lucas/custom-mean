'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function () {
  // Init module configuration options
  var applicationModuleName = 'mean';
  var applicationModuleVendorDependencies = ['ngResource', 'ngAnimate', 'ngMessages', 'ui.router', /*'angularFileUpload',*/ 'lumx', 'gettext'];

  // Add a new vertical module
  var registerModule = function (moduleName, dependencies) {
    console.log('registring module: ', moduleName);
    // Create angular module
    angular.module(moduleName, dependencies || []);

    // Add the module to the AngularJS configuration file
    angular.module(applicationModuleName).requires.push(moduleName);

    console.log('Modules & dependencies ', applicationModuleName, applicationModuleVendorDependencies);
  };

  return {
    applicationModuleName: applicationModuleName,
    applicationModuleVendorDependencies: applicationModuleVendorDependencies,
    registerModule: registerModule
  };
})();
