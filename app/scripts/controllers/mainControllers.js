/**
 * created by chenletian on 16/5/21.
 */

var pccontrollers = angular.module('PCControllers', [
    'ngStorage',
    'UserService'
])
.controller('indexController', ['$scope', function ($scope) {
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
