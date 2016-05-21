/**
 * created by chenletian on 16/5/21.
 */

var PCControllers = angular.module('PCControllers', [
    'ngStorage',
    'PCServices'
]);
PCControllers.controller('indexController', ['$scope', function ($scope) {
    $scope.name = "index"
}])
.controller('loginController', ['$scope', '$location', 'User', function ($scope, $location, User) {
    $scope.indicator = 'welcome';
    $scope.login = function() {
        uname = $scope.uname;
        password = $scope.password;
        User.login(uname, password, function successcallback(response) {
            $scope.indicator = 'ok';
            $location.path('/');
        }, function errorcallback(response) {
            $scope.indicator = response.data.msg;
        });
    };
}])
.controller('signupController', ['$scope', '$location', 'User', function ($scope, $location, User) {
    $scope.indicator = 'welcome';
    $scope.signup = function() {
        uname = $scope.uname;
        password = $scope.password;
        User.save({uname: uname, password: password}, function(response) {
            $scope.indicator = 'ok!';
            $location.path('login');
        }, function () {
            $scope.indicator = 'failed!';
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