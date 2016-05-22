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
.controller('youMayBeKnowController', ['$scope', 'UserRelation', 'User', function ($scope, UserRelation, User) {
    UserRelation.maybeknow(function (response) {
        $scope.persons = response.data;
        function getUserInfo(index) {
            User.query($scope.persons[index].uid, function (res) {
                $scope.persons[index].nickname = res.data.data.nickname;
                $scope.persons[index].avatar = res.data.data.avatar;
                User.query($scope.persons[index].mid, function (res2) {
                    $scope.persons[index].midNick = res2.data.data.nickname;
                });
            });
        }
        for (var index in $scope.persons) getUserInfo(index);
    });
}])
.controller('homepageTalkingsController', ['$scope', 'Talking', 'User', '$interval', function ($scope, Talking, User, $interval) {
    var lastCheckTime;
    var currentPage = 0;
    var pages = 0;

    $scope.contents = [];
    $scope.hasNextPage = false;
    $scope.hasNew = false;
    $scope.newCount = 0;

    function getUserInfo(Array, index) {
        Array[index].timestamp = new Date(Array[index].timestamp).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ").replace(/ GMT\+8 /g, "");
        User.query(Array[index].user_uid, function (res) {
            Array[index].user_nickname = res.data.data.nickname;
            Array[index].user_avatar = res.data.data.avatar;
        });
    }

    $scope.getNextPageContents = function () {
        ++currentPage;
        if (currentPage == 1) lastCheckTime = new Date().toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ").replace(/ GMT\+8 /g, "");

        Talking.query((currentPage == 1) ? null : {page: currentPage}, function (response) {
            var newRows = response.data.rows;
            for (var index in newRows) getUserInfo(newRows, index);
            $scope.contents = $scope.contents.concat(newRows);
            if(response.data.pages) pages = response.data.pages;
            $scope.hasNextPage = pages > currentPage;
        });

    };

    $scope.getNewContents = function () {
        Talking.query({after: lastCheckTime}, function (response) {
            var newRows = response.data.rows;
            for (var index in newRows) getUserInfo(newRows, index);
            $scope.contents = newRows.concat($scope.contents);
            $scope.hasNew = false;
        });
        lastCheckTime = new Date().toLocaleTimeString();
    };

    $scope.getNextPageContents();

    $interval(function () {
        Talking.queryCount({after: lastCheckTime}, function (response) {
            $scope.newCount = response.data;
            $scope.hasNew = $scope.newCount > 0;
        });
    }, 10 * 1000
    );
}]);