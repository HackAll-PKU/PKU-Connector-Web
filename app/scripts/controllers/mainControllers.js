/**
 * Created by ChenLetian on 16/5/21.
 */

var PCControllers = angular.module('PCControllers', [
    'ngStorage',
    'UserService'
]);
PCControllers.controller('indexController', ['$scope', function ($scope) {
    $scope.name = "index"
}]);
PCControllers.controller('loginController', ['$scope', function ($scope) {
    $scope.name = "login"
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