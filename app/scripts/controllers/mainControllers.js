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
}])
.controller('youMayBeKnowController', ['$scope', 'UserRelation', 'User'], function($scope, UserRelation, User) {
    UserRelation.maybeknow(function (response) {
        $scope.persons = response.data;
        for (var person in $scope.persons) {
            User.query(person.uid, function (res) {
                person.nickname = res.data.nickname;
                person.avatar = res.data.avatar;
                person.gender = res.data.gender;
                person.signature = res.data.signature;
                User.query(person.mid, function (res) {
                    person.midNickname = res.nickname;
                });
            });
        }
    });
});