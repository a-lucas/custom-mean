/**
 * Created by antoine-work on 18/05/16.
 */
'use strict';

angular.module('core').controller('MeController', function ($scope, Authentication) {
	$scope.user = Authentication.user;
});
