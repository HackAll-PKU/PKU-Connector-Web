'use strict';

// Declare app level module which depends on views, and components
angular.module('PKU-Connector-Web', [
  'ngRoute',
  'PCControllers'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.
  when('/', {
    templateUrl: '/app/views/main.html',
    controller: 'indexController'
  }).
  when('/index', {
    templateUrl: '/app/views/main.html',
    controller: 'indexController'
  }).
  when('/login', {
    templateUrl: '/app/views/login.html',
    controller: 'loginController'
  }).
  when('/signup', {
    templateUrl: '/app/views/signup.html',
    controller: 'signupController'
  }).
  otherwise({redirectTo: '/login'});
}]);
