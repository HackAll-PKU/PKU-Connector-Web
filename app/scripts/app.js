'use strict';

// Declare app level module which depends on views, and components
angular.module('PKU-Connector-Web', [
    'ngRoute',
    'PCControllers',
    'ngStorage'
]).
config(['$routeProvider', '$httpProvider', function($routeProvider, $httpProvider) {

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
    when('/talking', {
        templateUrl: '/app/views/talking.html',
        controller: 'talkingController'
    }).
    when('/signup', {
        templateUrl: '/app/views/signup.html',
        controller: 'signupController'
    }).
    when('/profile', {
        templateUrl: '/app/views/profile.html',
        controller: 'profileController'
    }).
    when('/user/:uid', {
        templateUrl: '/app/views/userhome.html',
        controller: 'userhomeController'
    }).
    when('/group/:gid', {
        templateUrl: '/app/views/grouphome.html',
        controller: 'grouphomeController'
    }).
    when('/friends/:uid/:selected', {
        templateUrl: '/app/views/friends.html',
        controller: 'friendsController'
    }).
    otherwise({redirectTo: '/login'});

    $httpProvider.interceptors.push(['$q', '$location', '$localStorage', function($q, $location, $localStorage) {
        return {
            'request': function (config) {
                config.headers = config.headers || {};
                if ($localStorage.token) {
                    config.headers.Authorization = 'Bearer:' + $localStorage.token;
                }
                return config;
            },
            'responseError': function(response) {
                return $q.reject(response);
            }
        };
    }]);

}]).filter("emoji",function($sce){
    return function(input){
        var regex = /\[:(.+?):]/gm;
        var out = input.replace(regex,'<span class="ep-emojies-c"><span class="ep-e" data-index="$1"></span></span>');
        return $sce.trustAsHtml(out);
    }
});
