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
.controller('signupController', ['$scope', '$location', 'User' , '$timeout', function ($scope, $location, User, $timeout) {
    $scope.indicator = 'Sign Up';
    $scope.loading = false;
    $scope.failed = false;
    $scope.signup = function() {
        $scope.loading = true;
        uname = $scope.uname;
        password = $scope.password;
        nickname = $scope.nickname;
        signature = $scope.signature;
        enrollmentYear = $scope.enrollmentYear;
        User.save({uname: uname, password: password, nickname: nickname, signature: signature, enrollmentYear: enrollmentYear}, function(response) {
            $scope.indicator = '注册成功! 正在跳转.';
            $timeout(function () {
                $scope.indicator = '注册成功! 正在跳转..';
            }, 500);
            $timeout(function () {
                $scope.indicator = '注册成功! 正在跳转...';
            }, 1000);
            $timeout(function () {
                $location.path('login');
            }, 1500);
            $scope.loading = false;
        }, function (response) {
            $scope.indicator = '注册失败' + response.data.msg;
            $scope.failed = true;
            $timeout(function () {
                $scope.indicator = 'Sign Up';
                $scope.failed = false;
            }, 2000);
            $scope.loading = false;
        });
    };
    $scope.$watch('uname', function(newValue, oldValue, scope) {
        if (scope.nickname == oldValue) {
            scope.nickname = newValue;
        }
    });
}])
.controller('talkingController', ['$scope', 'Talking', function ($scope, Talking) {
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