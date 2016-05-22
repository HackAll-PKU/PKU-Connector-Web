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
.controller('homepageTalkingsController', ['$scope', 'Talking', 'User', function ($scope, Talking, User) {
    var lastCheckTime;
    var currentPage = 0;
    var pages = 0;

    $scope.contents = [];
    $scope.hasNextPage = false;
    $scope.hasNew = false;
    $scope.newCount = 0;

    function getUserInfo(Array, index) {
        User.query(Array[index].user_uid, function (res) {
            Array[index].user_nickname = res.data.data.nickname;
            Array[index].user_avatar = res.data.data.avatar;
        });
    }

    $scope.getNextPageContents = function () {
        ++currentPage;
        if (currentPage == 1) lastCheckTime = new Date().toLocaleTimeString();

        Talking.query((currentPage == 1) ? null : {page: currentPage}, function (response) {
            var newRows = response.data.rows;
            for (var index in newRows) getUserInfo(newRows, index);
            $scope.contents = $scope.contents.concat(newRows);
            if(response.data.pages) pages = response.data.pages;
            $scope.hasNextPage = pages > currentPage;
        });

    };

    function checkNew() {
        Talking.queryCount({after: lastCheckTime}, function (response) {
            $scope.newCount = response.data;
            $scope.hasNew = $scope.newCount > 0;
        });
    }

    $scope.getNewContents = function () {
        Talking.query({after: lastCheckTime}, function (response) {
            var newRows = response.data.rows;
            for (var index in newRows) getUserInfo(newRows, index);
            $scope.contents = newRows.concat($scope.contents);
            checkNew();
        });
        lastCheckTime = new Date().toLocaleTimeString();
    };

    $scope.getNextPageContents();
    setInterval("checkNew()", 30*1000);

}]);