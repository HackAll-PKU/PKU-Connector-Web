/**
 * created by chenletian on 16/5/21.
 */
var PCControllers = angular.module('PCControllers', [
    'ngStorage',
    'PCServices',
    'infinite-scroll',
    'ngFileUpload',
    'angular-loading-bar',
    'ngAnimate'
]);
PCControllers
.controller('indexController', ['$scope', '$location', 'User', 'Group', 'UserRelation', 'GroupRelation', 'Talking', 'CONFIGURATIONS',
    function ($scope, $location, User, Group, UserRelation, GroupRelation, Talking, CONFIGURATIONS) {
    if(!User.getCurrentUser()) {
        $location.path('#/login');
        return;
    }
    User.query(User.getCurrentUser().uid, function (res) {
        $scope.me = res.data.data;
        UserRelation.queryFollows({uid: $scope.me.uid}, function (res) {
            $scope.me.follows = res.data.users.length + res.data.groups.length;
            $scope.groups = res.data.groups;
            function getGroupInfo(index) {
                Group.get({gid: $scope.groups[index].gid}, function (res) {
                    $scope.groups[index].gname = res.data.gname;
                    $scope.groups[index].avatar = res.data.avatar;
                });
            }
            for (var index in res.data.groups){
                getGroupInfo(index);
            }
        });
        UserRelation.queryFollowers({uid: $scope.me.uid}, function (res) {
            $scope.me.followers = res.data.length;
        });
        Talking.userCountGet({uid: $scope.me.uid}, function (res) {
            $scope.me.talkings = res.data;
        });
    });
    $scope.name = "index"
}])
.controller('loginController', ['$scope', '$location', 'User', '$timeout', function ($scope, $location, User, $timeout) {
    $scope.indicator = 'Log in';
    $scope.loading = false;
    $scope.failed = false;
    $scope.login = function() {
        var uname = $scope.uname;
        var password = $scope.password;
        $scope.loading = true;
        User.login(uname, password, function successCallback(response) {
            $scope.indicator = '登录成功! 正在跳转.';
            $timeout(function () {
                $scope.indicator = '登录成功! 正在跳转..';
            }, 500);
            $timeout(function () {
                $scope.indicator = '登录成功! 正在跳转...';
            }, 1000);
            $timeout(function () {
                $location.path('/');
            }, 1500);
            $scope.loading = false;
        }, function errorCallback(response) {
            $scope.indicator = '登录失败,' + response.data.msg;
            $scope.failed = true;
            $timeout(function () {
                $scope.indicator = 'Log in';
                $scope.failed = false;
            }, 2000);
            $scope.loading = false;
        });
    };
}])
.controller('signupController', ['$scope', '$location', 'User', '$timeout', function ($scope, $location, User, $timeout) {
    $scope.indicator = 'Sign Up';
    $scope.loading = false;
    $scope.failed = false;
    $scope.signup = function() {
        $scope.loading = true;
        var uname = $scope.uname;
        var password = $scope.password;
        var nickname = $scope.nickname;
        var signature = $scope.signature;
        var enrollmentYear = $scope.enrollmentYear;
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
.controller('profileController', ['$scope', '$location', 'User', '$timeout', 'Upload', 'CONFIGURATIONS', function ($scope, $location, User, $timeout, Upload, CONFIGURATIONS) {
    $scope.uploadAvatar = function(file) {
        console.log($scope.file);
        if (file) {
            Upload.upload({
                url: CONFIGURATIONS.baseURL + '/image',
                data: {
                    image: file
                }
            }).then(function (res) {
                $scope.avatar = res.data.data[0];
            }, function (res) {
                alert("图片上传失败!\n" + res);
            }, function (evt) {
                console.log("progress: " + Math.min(100, parseInt(100.0 * evt.loaded / evt.total)));
            });
        }
    };
    $scope.uploadBackground = function (file) {
        if (file) {
            Upload.upload({
                url: CONFIGURATIONS.baseURL + '/image',
                data: {
                    image: file
                }
            }).then(function (res) {
                $scope.background = res.data.data[0];
            }, function (res) {
                alert("图片上传失败!\n" + res);
            }, function (evt) {
                console.log("progress: " + Math.min(100, parseInt(100.0 * evt.loaded / evt.total)));
            });
        }
    };
    $scope.indicator = '正在加载个人信息';
    $scope.loading = true;
    $scope.failed = false;
    User.query(User.getCurrentUser().uid, function(res) {
        $scope.uname = res.data.data.uname;
        $scope.nickname = res.data.data.nickname;
        $scope.signature = res.data.data.signature;
        $scope.enrollmentYear = res.data.data.enrollment_year;
        $scope.avatar = res.data.data.avatar;
        $scope.background = res.data.data.background;
        $scope.loading = false;
        $scope.indicator = '保存'
    }, function() {
        $scope.indicator = '无法获取个人信息,请检查网络';
        $scope.failed = true;
        $scope.loading = false;
        $timeout(function () {
            $location.path('/profile');
        }, 2000);
    });

    $scope.save = function() {
        $scope.loading = true;
        var uname = $scope.uname;
        var nickname = $scope.nickname;
        var signature = $scope.signature;
        var enrollmentYear = $scope.enrollmentYear;
        var avatar = $scope.avatar;
        var background = $scope.background;
        User.update(User.getCurrentUser().uid, {uname: uname, nickname: nickname, signature: signature, enrollmentYear: enrollmentYear, avatar: avatar, background: background}, function(response) {
            $scope.indicator = '保存成功! 正在跳转.';
            $timeout(function () {
                $scope.indicator = '保存成功! 正在跳转..';
            }, 500);
            $timeout(function () {
                $scope.indicator = '保存成功! 正在跳转...';
            }, 1000);
            $timeout(function () {
                $location.path('/');
            }, 1500);
            $scope.loading = false;
        }, function (response) {
            $scope.indicator = '保存失败' + response.data.msg;
            $scope.failed = true;
            $timeout(function () {
                $scope.indicator = '保存';
                $scope.failed = false;
            }, 2000);
            $scope.loading = false;
        });
    };
}])
.controller('youMayBeKnowController', ['$scope', 'UserRelation', 'User', function ($scope, UserRelation, User) {
    if (!User.getCurrentUser()) return;

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
.controller('homepageTalkingsController', ['$scope', 'Talking', 'User', 'Group', '$interval', function ($scope, Talking, User, Group, $interval) {
    if (!User.getCurrentUser()) return;

    var lastUpdateTime;
    var currentPage = 0;
    var pages = 0;

    $scope.contents = [];
    $scope.hasNextPage = false;
    $scope.hasNew = false;
    $scope.newCount = 0;
    $scope.busy = false;

    Date.prototype.format = function(fmt) {
        var o = {
            "M+" : this.getMonth()+1,                 //月份
            "d+" : this.getDate(),                    //日
            "h+" : this.getHours(),                   //小时
            "m+" : this.getMinutes(),                 //分
            "s+" : this.getSeconds(),                 //秒
            "q+" : Math.floor((this.getMonth()+3)/3), //季度
            "S"  : this.getMilliseconds()             //毫秒
        };
        if(/(y+)/.test(fmt))
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
        for(var k in o)
            if(new RegExp("("+ k +")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        return fmt;
    };

    function fetchExtraInfo(Array, index) {
        //设置时间格式
        Array[index].timestamp = new Date(Array[index].timestamp).format("yyyy-MM-dd hh:mm:ss");
        //查询发表者信息
        User.query(Array[index].user_uid, function (res) {
            Array[index].user_nickname = res.data.data.nickname;
            Array[index].user_avatar = res.data.data.avatar;
        });
        //查询用户组信息
        if(Array[index].group_gid){
            Group.get({gid: Array[index].group_gid}, function (res) {
                Array[index].group_gname = res.data.gname;
            });
        }
        //查询mention信息
        var strs = Array[index].text.split('@');
        if (strs.length > 1) {
            var mentionedUid = JSON.parse('['+strs[strs.length - 1]+']');
            strs.splice(strs.length - 1, 1);
            Array[index].text = strs.join('@');

            if(mentionedUid.length > 0){
                Array[index].mentionedUsers = [];
                for (var i in mentionedUid) {
                    fetchNickname(Array[index].mentionedUsers, mentionedUid, i);
                }
            }
        }
        //解析image数组
        Array[index].image = JSON.parse(Array[index].image);
        Array[index].showLargeImage = -1;
    }

    function fetchNickname(Array, Uids, index) {
        User.query(Uids[index], function (res) {
            Array[index] = {uid: Uids[index], nickname: res.data.data.nickname};
        });
    }

    $scope.getNextPageContents = function () {
        $scope.busy = true;
        ++currentPage;
        if (currentPage == 1) lastUpdateTime = Math.round(new Date().getTime() / 1000);

        Talking.query((currentPage == 1) ? null : {page: currentPage}, function (response) {
            var newRows = response.data.rows;
            for (var index in newRows) fetchExtraInfo(newRows, index);
            $scope.contents = $scope.contents.concat(newRows);
            if(response.data.pages) pages = response.data.pages;
            $scope.hasNextPage = pages > currentPage;
            $scope.busy = false
        });

    };

    $scope.getNewContents = function () {
        Talking.query({after: lastUpdateTime}, function (response) {
            var newRows = response.data.rows;
            for (var index in newRows) fetchExtraInfo(newRows, index);
            $scope.contents = newRows.concat($scope.contents);
            $scope.hasNew = false;
        });
        lastUpdateTime = Math.round(new Date().getTime() / 1000);
    };

    $scope.getNextPageContents();

    var interval = $interval(function () {
        Talking.queryCount({after: lastUpdateTime}, function (response) {
            $scope.newCount = response.data;
            $scope.hasNew = $scope.newCount > 0;
        });
    }, 10 * 1000
    );

    $scope.$on("$destroy", function() {
        $interval.cancel(interval);
    });

}])
.controller('navController', ['$scope', 'User', function ($scope, User) {
    $scope.logout = function () {
        User.logout();
    }
}])
.controller('talkingPostController', ['$scope', 'Talking', 'Group', 'GroupRelation', 'UserRelation', '$timeout', 'Upload', 'CONFIGURATIONS', function ($scope, Talking, Group, GroupRelation, UserRelation, $timeout, Upload, CONFIGURATIONS) {
    $scope.topicSelecting = false;
    $scope.userSelecting = false;
    $scope.text = "";
    //发表
    $scope.submit = function () {
        //创建话题
        if ($scope.gid == -1) {
            Group.save({gname: $scope.gname}, function (res) {
                $scope.gid = res.data.gid;
                submitNext();
            });
        } else submitNext();

        function submitNext() {
            var image = ($scope.imageSelecting && $scope.image.length > 0) ? JSON.stringify($scope.image) : undefined;
            if (!$scope.text && !image) {
                alert('内容为空!');
                return;
            }
            if (!$scope.text) $scope.text = "";
            //关注话题
            if($scope.gid) GroupRelation.save({gid: $scope.gid}, null);

            var rawText = $scope.text;
            var uidArray = [];
            for (var index in $scope.userList) {
                uidArray[index] = $scope.userList[index].uid;
            }
            rawText += '@' + uidArray.toString();

            Talking.save({text: rawText, gid: $scope.gid, image: image},function () {
                $scope.text = "";
                $scope.topicSelecting = false;
                $scope.userSelecting = false;
                $scope.imageSelecting = false;
                $scope.gid = undefined;
                $scope.gname = undefined;
                $scope.userList = [];
                $scope.image = [];
                alert('您的说说发布成功!');
            },function (r) {
                alert('您的说说发布失败('+r.data.msg+')!');
            });
        }
    };

    //话题
    $scope.selectTopic = function () {
        $scope.topicSelecting = !$scope.topicSelecting;
        if(!$scope.topicSelecting) {
            $scope.gid = undefined;
            $scope.gname = undefined;
            $scope.topicInput = undefined;
        }
    };

    $scope.topicSelected = function (gid, gname) {
        $scope.gid = gid;
        $scope.gname = gname;
        $scope.topicInput = gname;
        $scope.groupResult = undefined;
    };

    var timeout_group;
    $scope.$watch('topicInput', function(newValue, oldValue, scope) {
        $timeout.cancel(timeout_group);
        if(!newValue) {
            scope.groupResult = undefined;
            return;
        }
        //用timeout减少输入时的网络请求次数
        timeout_group = $timeout(function () {
            Group.query({gname: newValue}, function (res) {
                if(res.data.length == 0) res.data = [{gid: -1, gname: newValue}];
                else for (var index in res.data) {
                    if (res.data[index].gname == newValue) break;
                    if(index == res.data.length - 1) {
                        res.data = res.data.concat([{gid: -1, gname: newValue}]);
                    }
                }
                scope.groupResult = res.data;
            });
        }, 100);
    });

    //提及
    $scope.userList = [];//{uid:1, nickname: "user1"}, {uid:2, nickname: "user2"}, {uid:3, nickname: "user3"}, {uid:4, nickname: "user4"}

    $scope.selectUser = function () {
        $scope.userSelecting = !$scope.userSelecting;
        if(!$scope.userSelecting) {
            $scope.userList = [];
            $scope.userInput = undefined;
            $scope.userResult = undefined;
        }
    };

    $scope.userSelected = function (uid, nickname) {
        if(uid != -1) $scope.userList = $scope.userList.concat([{uid:uid, nickname: nickname}]);
        $scope.userInput = undefined;
        $scope.userResult = undefined;
    };

    $scope.deleteFromList = function (uid) {
        for (var index in $scope.userList) {
            if ($scope.userList[index].uid == uid) $scope.userList.splice(index, 1);
        }
    };

    var timeout_user;
    $scope.$watch('userInput', function(newValue, oldValue, scope) {
        $timeout.cancel(timeout_user);
        if(!newValue) {
            scope.userResult = undefined;
            return;
        }
        //用timeout减少输入时的网络请求次数
        timeout_user = $timeout(function () {
            UserRelation.querySuggestion({nickname: newValue}, function (res) {
                //去掉已在列表中的
                for (var i1 in res.data) {
                    for (var i2 in scope.userList) {
                        if (res.data[i1].uid == scope.userList[i2].uid) res.data.splice(i1, 1);
                    }
                }
                if (res.data.length == 0) res.data = [{uid: -1, nickname: newValue}];
                scope.userResult = res.data;
            });
        }, 100);
    });

    new EmojiPanel(document.getElementById('emoji-panel'), {
        onClick: function(emoji) {
            $scope.text += '[:' + emoji.index + ':]';//emoji.unified
            //TODO:效率不行啊!!!
        }
    });

    $scope.imageSelecting = false;
    $scope.image = [];
    $scope.uploadImage = function(file) {
        console.log($scope.file);
        if (file) {
            Upload.upload({
                url: CONFIGURATIONS.baseURL + '/image',
                data: {
                    image: file
                }
            }).then(function (res) {
                $scope.image = $scope.image.concat([res.data.data[0]]);
            }, function (res) {
                alert("图片上传失败!\n" + res);
            }, function (evt) {
                console.log("progress: " + Math.min(100, parseInt(100.0 * evt.loaded / evt.total)));
            });
        }
    };

    $scope.deleteImage = function (path) {
        for (var index in $scope.image) {
            if ($scope.image[index] == path) $scope.image.splice(index, 1);
        }
    }
}])
.controller('userhomeController', ['$scope', '$routeParams', 'User', 'UserRelation', 'Talking', function($scope, $routeParams, User, UserRelation, Talking) {
    $scope.uid = $routeParams.uid;
    $scope.isme = false;
    if ($scope.uid == User.getCurrentUser().uid) {
        $scope.isme = true;
    }
    function getUserRelation() {
        UserRelation.get({uid: $scope.uid}, function (res) {
            switch (res.data.flag) {
                case 0:
                    $scope.hasAttentioned = false;
                    $scope.attentionIndicator = "+ 关注";
                    break;
                case 1:
                    $scope.hasAttentioned = true;
                    $scope.attentionIndicator = "已关注";
                    break;
                case 2:
                    $scope.hasAttentioned = false;
                    $scope.attentionIndicator = "已被Ta关注";
                    break;
                case 3:
                    $scope.hasAttentioned = true;
                    $scope.attentionIndicator = "已互相关注";
            }
        });
    }

    User.query($scope.uid, function(res) {
        $scope.me = res.data.data;
        UserRelation.queryFollows({uid: $scope.me.uid}, function (res) {
            $scope.me.follows = res.data.users.length + res.data.groups.length;
        });
        UserRelation.queryFollowers({uid: $scope.me.uid}, function (res) {
            $scope.me.followers = res.data.length;
        });
        Talking.userCountGet({uid: $scope.me.uid}, function (res) {
            $scope.me.talkings = res.data;
        });
        getUserRelation();
    });

    $scope.attention = function (res) {
        UserRelation.save({uid: $scope.uid}, null, function (req) {
            getUserRelation();
        });
    };
    $scope.unattention = function (res) {
        UserRelation.delete({uid: $scope.uid}, function (req) {
            getUserRelation();
        });
    };

}])
.controller('grouphomeController', ['$scope', '$routeParams', 'User', 'UserRelation', 'Talking', 'Group', 'GroupRelation', function($scope, $routeParams, User, UserRelation, Talking, Group, GroupRelation) {
    $scope.gid = $routeParams.gid;

    function getGroupRelation() {
        GroupRelation.get({gid: $scope.gid}, function (res) {
            if (res.data.flag) {
                $scope.hasAttentioned = true;
                $scope.attentionIndicator = "已关注"
            }
            else {
                $scope.hasAttentioned = false;
                $scope.attentionIndicator = "+ 关注"
            }
        });
    }

    Group.get({gid: $scope.gid}, function (res) {
        $scope.me = res.data;
        $scope.me.background = "http:/pikkacho.cn/uploads/default_background.jpg"
        Talking.groupCountGet({gid: $scope.gid}, function (res) {
            $scope.me.talkings = res.data;
        });
        GroupRelation.queryFollowers({gid: $scope.gid}, function (res) {
            $scope.me.followers = res.data;
            $scope.me.followersCount = res.data.length;
        });
        getGroupRelation();
    });

    $scope.attention = function (res) {
        GroupRelation.save({gid: $scope.gid}, null, function (req) {
            getGroupRelation();
        });
    };
    $scope.unattention = function (res) {
        GroupRelation.delete({gid: $scope.gid}, function (req) {
            getGroupRelation();
        });
    };
}]).controller('userhomeTalkingsController', ['$scope', 'Talking', 'User', 'Group', '$routeParams', function ($scope, Talking, User, Group, $routeParams) {
    //if (!User.getCurrentUser()) return;
    var thisUid = $routeParams.uid;
    
    var currentPage = 0;
    var pages = 0;

    $scope.contents = [];
    $scope.hasNextPage = false;
    $scope.busy = false;

    Date.prototype.format = function(fmt) {
        var o = {
            "M+" : this.getMonth()+1,                 //月份
            "d+" : this.getDate(),                    //日
            "h+" : this.getHours(),                   //小时
            "m+" : this.getMinutes(),                 //分
            "s+" : this.getSeconds(),                 //秒
            "q+" : Math.floor((this.getMonth()+3)/3), //季度
            "S"  : this.getMilliseconds()             //毫秒
        };
        if(/(y+)/.test(fmt))
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
        for(var k in o)
            if(new RegExp("("+ k +")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        return fmt;
    };

    function fetchExtraInfo(Array, index) {
        //设置时间格式
        Array[index].timestamp = new Date(Array[index].timestamp).format("yyyy-MM-dd hh:mm:ss");
        //查询发表者信息
        User.query(Array[index].user_uid, function (res) {
            Array[index].user_nickname = res.data.data.nickname;
            Array[index].user_avatar = res.data.data.avatar;
        });
        //查询用户组信息
        if(Array[index].group_gid){
            Group.get({gid: Array[index].group_gid}, function (res) {
                Array[index].group_gname = res.data.gname;
            });
        }
        //查询mention信息
        var strs = Array[index].text.split('@');
        if (strs.length > 1) {
            var mentionedUid = JSON.parse('['+strs[strs.length - 1]+']');
            strs.splice(strs.length - 1, 1);
            Array[index].text = strs.join('@');

            if(mentionedUid.length > 0){
                Array[index].mentionedUsers = [];
                for (var i in mentionedUid) {
                    fetchNickname(Array[index].mentionedUsers, mentionedUid, i);
                }
            }
        }
        //解析image数组
        Array[index].image = JSON.parse(Array[index].image);
        Array[index].showLargeImage = -1;
    }

    function fetchNickname(Array, Uids, index) {
        User.query(Uids[index], function (res) {
            Array[index] = {uid: Uids[index], nickname: res.data.data.nickname};
        });
    }

    $scope.getNextPageContents = function () {
        $scope.busy = true;
        ++currentPage;

        Talking.userGet((currentPage == 1) ? {uid: thisUid} : {uid: thisUid, page: currentPage}, function (response) {
            var newRows = response.data.rows;
            for (var index in newRows) fetchExtraInfo(newRows, index);
            $scope.contents = $scope.contents.concat(newRows);
            if(response.data.pages) pages = response.data.pages;
            $scope.hasNextPage = pages > currentPage;
            $scope.busy = false
        });

    };
    $scope.getNextPageContents();
}]).controller('grouphomeTalkingsController', ['$scope', 'Talking', 'User', 'Group', '$routeParams', function ($scope, Talking, User, Group, $routeParams) {
    //if (!User.getCurrentUser()) return;
    var thisGid = $routeParams.gid;

    var currentPage = 0;
    var pages = 0;

    $scope.contents = [];
    $scope.hasNextPage = false;
    $scope.busy = false;

    Date.prototype.format = function(fmt) {
        var o = {
            "M+" : this.getMonth()+1,                 //月份
            "d+" : this.getDate(),                    //日
            "h+" : this.getHours(),                   //小时
            "m+" : this.getMinutes(),                 //分
            "s+" : this.getSeconds(),                 //秒
            "q+" : Math.floor((this.getMonth()+3)/3), //季度
            "S"  : this.getMilliseconds()             //毫秒
        };
        if(/(y+)/.test(fmt))
            fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
        for(var k in o)
            if(new RegExp("("+ k +")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        return fmt;
    };

    function fetchExtraInfo(Array, index) {
        //设置时间格式
        Array[index].timestamp = new Date(Array[index].timestamp).format("yyyy-MM-dd hh:mm:ss");
        //查询发表者信息
        User.query(Array[index].user_uid, function (res) {
            Array[index].user_nickname = res.data.data.nickname;
            Array[index].user_avatar = res.data.data.avatar;
        });
        //查询用户组信息
        if(Array[index].group_gid){
            Group.get({gid: Array[index].group_gid}, function (res) {
                Array[index].group_gname = res.data.gname;
            });
        }
        //查询mention信息
        var strs = Array[index].text.split('@');
        if (strs.length > 1) {
            var mentionedUid = JSON.parse('['+strs[strs.length - 1]+']');
            strs.splice(strs.length - 1, 1);
            Array[index].text = strs.join('@');

            if(mentionedUid.length > 0){
                Array[index].mentionedUsers = [];
                for (var i in mentionedUid) {
                    fetchNickname(Array[index].mentionedUsers, mentionedUid, i);
                }
            }
        }
        //解析image数组
        Array[index].image = JSON.parse(Array[index].image);
        Array[index].showLargeImage = -1;
    }

    function fetchNickname(Array, Uids, index) {
        User.query(Uids[index], function (res) {
            Array[index] = {uid: Uids[index], nickname: res.data.data.nickname};
        });
    }

    $scope.getNextPageContents = function () {
        $scope.busy = true;
        ++currentPage;

        Talking.groupGet((currentPage == 1) ? {gid: thisGid} : {gid: thisGid, page: currentPage}, function (response) {
            var newRows = response.data.rows;
            for (var index in newRows) fetchExtraInfo(newRows, index);
            $scope.contents = $scope.contents.concat(newRows);
            if(response.data.pages) pages = response.data.pages;
            $scope.hasNextPage = pages > currentPage;
            $scope.busy = false
        });

    };

    $scope.getNextPageContents();
}]).controller('friendsController', ['$scope', 'Talking', 'User', 'Group', '$interval', '$routeParams', 'UserRelation', 'GroupRelation', function ($scope, Talking, User, Group, $interval, $routeParams, UserRelation, GroupRelation) {
    var currentUser = User.getCurrentUser();
    if (!currentUser) return;
    var thisUid = $routeParams.uid;
    $scope.isMe = currentUser.uid == thisUid;
    $scope.myUid = currentUser.uid;
    $scope.users = [];

    User.query(thisUid, function (res) {
        $scope.me = res.data.data;
    });

    $scope.select = function (which) {
        $scope.selected = which;
        switch (which) {
            case 0: //关注列表
                UserRelation.queryFollows({uid: thisUid}, function (res) {
                    $scope.users = res.data.users;
                    for (var index in $scope.users){
                        fetchUserInfo($scope.users, index);
                    }
                });
                break;
            case 1: //粉丝列表
                UserRelation.queryFollowers({uid: thisUid}, function (res) {
                    $scope.users = res.data;
                    for (var index in $scope.users){
                        fetchUserInfo($scope.users, index);
                    }
                });
                break;
            /*
            case 2: //用户组列表
                UserRelation.queryFollows({uid: thisUid}, function (res) {
                    $scope.users = res.data.groups;
                    for (var index in $scope.users){
                        fetchGroupInfo($scope.users, index);
                    }
                });
                break;
            */
        }
    };

    function fetchUserInfo(Array, index) {
        //获取用户基本信息
        User.query(Array[index].uid, function (res) {
            Array[index].nickname = res.data.data.nickname;
            Array[index].avatar = res.data.data.avatar;
            Array[index].signature = res.data.data.signature;
        });

        //获取用户关系信息
        fetchUserRelation(Array, index);
    }

    function fetchUserRelation(Array, index) {
        UserRelation.get({uid: Array[index].uid}, function (res) {
            Array[index].flag = res.data.flag;
            switch (res.data.flag) {
                case 0:
                    Array[index].hasAttentioned = false;
                    Array[index].attentionIndicator = "+ 关注";
                    break;
                case 1:
                    Array[index].hasAttentioned = true;
                    Array[index].attentionIndicator = "已关注";
                    break;
                case 2:
                    Array[index].hasAttentioned = false;
                    Array[index].attentionIndicator = "已被Ta关注";
                    break;
                case 3:
                    Array[index].hasAttentioned = true;
                    Array[index].attentionIndicator = "已互相关注";
            }
        });
    }

    /*
    function fetchGroupInfo(Array, index) {
        //获取组基本信息
        Group.get({gid: Array[index].gid}, function (res) {
            Array[index].uid = res.data.gid;
            Array[index].nickname = res.data.gname;
            Array[index].avatar = res.data.avatar;
            Array[index].signature = "";
        });

        //获取组关系信息
        GroupRelation.get({gid: Array[index].gid}, function (res) {
            Array[index].flag = res.data.flag;
            if (res.data.flag) {
                Array[index].hasAttentioned = true;
                Array[index].attentionIndicator = "已关注"
            }
            else {
                Array[index].hasAttentioned = false;
                Array[index].attentionIndicator = "+ 关注"
            }
        });
    }
    */

    $scope.select(Number.parseInt($routeParams.selected));

    $scope.alterAttention = function (index) {
        if ($scope.users[index].hasAttentioned) {//取关
            UserRelation.delete({uid: $scope.users[index].uid}, function (req) {
                fetchUserRelation($scope.users, index);
            });
        } else { //关注
            UserRelation.save({uid: $scope.users[index].uid}, null, function (req) {
                fetchUserRelation($scope.users, index);
            });
        }
    };

}]);