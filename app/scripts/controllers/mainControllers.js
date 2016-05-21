/**
 * Created by ChenLetian on 16/5/21.
 */

var PCControllers = angular.module('PCControllers', []);
PCControllers.controller('indexController', ['$scope', function ($scope) {
    $scope.name = "index"
}]);
PCControllers.controller('loginController', ['$scope', function ($scope) {
    $scope.name = "login"
}]);
PCControllers.controller('signupController', ['$scope', function ($scope) {
    $scope.name = "signup"
}]);