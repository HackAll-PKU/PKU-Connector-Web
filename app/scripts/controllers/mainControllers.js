/**
 * Created by ChenLetian on 16/5/21.
 */

var PCControllers = angular.module('PCControllers', [
    'ngStorage',
    'PCServices'
]);
PCControllers.controller('indexController', ['$scope', function ($scope) {
    $scope.name = "index"
}]);
PCControllers.controller('loginController', ['$scope', 'User', '$localStorage', function ($scope, User, $localStorage) {
    $scope.indicator = 'Welcome';
    $scope.login = function() {
        uname = $scope.uname;
        password = $scope.password;
        User.login(uname, password, function successCallback(response) {
            $scope.indicator = 'OK';
            $localStorage.token = response.data.token;
        }, function errorCallback(response) {
            $scope.indicator = 'Wrong';
        });
    };
}]);
PCControllers.controller('signupController', ['$scope', 'User', function ($scope, User) {
    $scope.indicator = 'Welcome';
    $scope.signup = function() {
        uname = $scope.uname;
        password = $scope.password;
        User.save({uname: uname, password: password}, function(response) {
            $scope.indicator = 'OK!';
        }, function () {
            $scope.indicator = 'Failed!';
        });
    };
}]);

PCControllers.controller('talkingController', ['$scope', 'Talking', function ($scope, Talking) {
    $scope.indicator = 'Welcome';
    $scope.save = function() {
        var text = $scope.text;
        Talking.save({text: text}, function(response) {
            $scope.indicator = 'OK!'+response;
        }, function () {
            $scope.indicator = 'Failed!';
        });
    };
    $scope.get = function() {
        var text = $scope.text;
        Talking.get({tid: text}, function(response) {
            $scope.indicator = 'OK!'+response.data.timestamp;
        }, function () {
            $scope.indicator = 'Failed!';
        });
    };
    $scope.delete = function() {
        var text = $scope.text;
        Talking.delete({tid: text}, function(response) {
            $scope.indicator = 'OK!';
        }, function () {
            $scope.indicator = 'Failed!';
        });
    };
    $scope.query = function() {
        var text = $scope.text;
        Talking.query(function(response) {
            $scope.indicator = 'OK!';
        }, function () {
            $scope.indicator = 'Failed!';
        });
    };
}]);