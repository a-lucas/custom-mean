'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider', '$httpProvider',
  function ($locationProvider, $httpProvider) {
    $locationProvider.html5Mode(true).hashPrefix('!');

    $httpProvider.interceptors.push('authInterceptor');
  }
]);

angular.module(ApplicationConfiguration.applicationModuleName).run(function ($rootScope, $state, $window, gettextCatalog, Authentication) {

  /****
   * I18n
   */

  $rootScope.config = $window.config || {};

  $rootScope.selectLang = function(lang) {
    $rootScope.language = lang;
    gettextCatalog.currentLanguage = lang.id;
    if ($state.current.name.length >0) {
      $state.go($state.current.name, {}, { reload: true });
    }
  };
  $rootScope.selectLang($rootScope.config.app.languages[0]);

  gettextCatalog.debug = true;

  // Store previous state
  function storePreviousState(state, params) {
    // only store this state if it shouldn't be ignored
    if (!state.data || !state.data.ignoreState) {
      $state.previous = {
        state: state,
        params: params,
        href: $state.href(state, params)
      };
    }
  }
  // Check authentication before changing state
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {

    if (typeof toState.roles !== 'object') {
      throw 'A Role property must be set for ' + toState;
    }
    if (toState.roles.length === 0) {
      return true;
    }
    if (toState.roles.length > 0 && Authentication.isLoggedIn() === false) {
      event.preventDefault();
      $state.go('authentication.signin').then(function () {
        storePreviousState(toState, toParams);
      });

    } else if (!Authentication.isAllowed(toState.roles)) {
      event.preventDefault();
      $state.go('forbidden');
    }
  });

  // Record previous state
  $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
    storePreviousState(fromState, fromParams);
  });


});

//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash && window.location.hash === '#_=_') {
    if (window.history && history.pushState) {
      window.history.pushState('', document.title, window.location.pathname);
    } else {
      // Prevent scrolling by storing the page's current scroll offset
      var scroll = {
        top: document.body.scrollTop,
        left: document.body.scrollLeft
      };
      window.location.hash = '';
      // Restore the scroll offset, should be flicker free
      document.body.scrollTop = scroll.top;
      document.body.scrollLeft = scroll.left;
    }
  }

  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
