/**
 * Created by ChenLetian on 16/5/21.
 */
var baseURL = 'http://pikkacho.cn/api/v1';
var PCServices = angular.module('PCServices', ['ngStorage', 'ngResource']);

PCServices.factory('User', ['$http', '$localStorage', function ($http, $localStorage) {

        return {
            save: function(data, success, error) {
                $http.post(baseURL + '/user', data).then(success, error);
            },
            login: function(uname, password, success, error) {
                $http.post(baseURL + '/authentication', {uname: uname, password: password}).then(function successHandler(response) {
                    $localStorage.token = response.data.token;
                    $localStorage.user = {
                        uid: response.data.uid,
                        uname: response.data.uname
                    };
                    $localStorage.tokenInfo = {
                        signTime: response.data.iat * 1000,
                        expireTime: response.data.exp * 1000
                    };
                    success();
                }, error);
            },
            query: function(uid, success, error) {
                $http.get(baseURL + '/user/' + uid).then(success, error);
            },
            update: function(uid, data, success, error) {
                $http.put(baseURL + '/user/' + uid, data).then(success, error);
            },
            getCurrentUser: function() {
                var storedUser = $localStorage.user;
                if (storedUser && $localStorage.tokenInfo) {
                    if (new Date().getTime() <= $localStorage.tokenInfo.expireTime)
                        return storedUser;
                }
                return undefined;
            }
        }
    }]);


PCServices.factory('Talking', ['$resource', function ($resource) {
    return $resource(baseURL + '/talking/:tid', null,
        {
            'get': {method: 'GET'},
            'save': {method: 'POST'},
            'delete': {method: 'DELETE'},
            'query': {url: baseURL + '/talkings', method: 'GET'},
            'queryCount': {url: baseURL + '/talkings/new', method: 'GET'},
            'userGet': {url: baseURL + '/talkings/u/:uid', method: 'GET'},
            'userCountGet': {url: baseURL + '/talkings/u/:uid/count', method: 'GET'},
            'groupGet': {url: baseURL + '/talkings/g/:gid', method: 'GET'},
            'groupCountGet': {url: baseURL + '/talkings/g/:gid/count', method: 'GET'},
            'likeTalking':{url:baseURL+'/like/:tid', method: 'POST'},
            'unlikeTalking':{url:baseURL+'/like/:tid', method: 'DELETE'}
        });
}]);

PCServices.factory('Comment', ['$resource', function ($resource) {
    return $resource(baseURL + '/comment/:cid', null,
        {
            'get': {method: 'GET'},
            'save': {method: 'POST'},
            'delete': {method: 'DELETE'},
            'query': {url: baseURL + '/comment/t/:tid', method: 'GET'}
        });
}]);

PCServices.factory('UserRelation', ['$resource', function ($resource) {
    return $resource(baseURL + '/follow/user/:uid', null,
        {
            'save': {method: 'POST'},
            'delete': {method: 'DELETE'},
            'get': {url: baseURL + '/relation/user/:uid/me', method: 'GET'},
            'queryFollows': {url: baseURL + '/relation/user/:uid/follows', method: 'GET'},
            'queryFollowers': {url: baseURL + '/relation/user/:uid/followers', method: 'GET'},
            'maybeknow': {url: baseURL + '/relation/maybeknow', method: 'GET'}
        });
}]);

PCServices.factory('GroupRelation', ['$resource', function ($resource) {
    return $resource(baseURL + '/follow/group/:gid', null,
        {
            'save': {method: 'POST'},
            'delete': {method: 'DELETE'},
            'get': {url: baseURL + '/relation/group/:gid/me', method: 'GET'},
            'queryFollowers': {url: baseURL + '/relation/group/:gid/followers', method: 'GET'}
        });
}]);

PCServices.factory('Group', ['$resource', function ($resource) {
    return $resource(baseURL + '/group/:gid', null,
        {
            'save': {method: 'POST'},
            'delete': {method: 'DELETE'},
            'update': {method: 'PUT'},
            'get': {method: 'GET'},
            'query': {url: baseURL + '/group/suggest/name/:gname', method: 'GET'}
        });
}]);