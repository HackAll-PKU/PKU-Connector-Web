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
                $http.post(baseURL + '/authentication', {uname: uname, password: password}).then(success, error);
            },
            query: function(uid, success, error) {
                $http.get(baseURL + '/user/:uid', {params: {uid: uid}}).then(success, error);
            },
            update: function(uid, data, success, error) {
                $http.put(baseURL + '/user/:uid', data, {params: {uid: uid}}).then(success, error);
            }
        }
    }]);


PCServices.factory('Talking', ['$resource', function ($resource) {
    return $resource(baseURL + '/talking/:tid', null,
        {
            'get': {method: 'GET'},
            'save': {method: 'POST'},
            'remove': {method: 'DELETE'},
            'delete': {method: 'DELETE'},
            'query': {url: baseURL + '/talkings', method: 'GET'},
            'queryCount': {url: baseURL + '/talkings/new', method: 'GET'},
            'userGet': {url: baseURL + '/talkings/u/:uid', method: 'GET'},
            'groupGet': {url: baseURL + '/talkings/g/:gid', method: 'GET'}
        });
}]);

PCServices.factory('Comment', ['$resource', function ($resource) {
    return $resource(baseURL + '/comment/:cid', null,
        {
            'get': {method: 'GET'},
            'save': {method: 'POST'},
            'remove': {method: 'DELETE'},
            'delete': {method: 'DELETE'},
            'query': {url: baseURL + '/comment/t/:tid', method: 'GET'}
        });
}]);

PCServices.factory('UserRelation', ['$resource', function ($resource) {
    return $resource(baseURL + '/follow/user/:uid', null,
        {
            'get': {url: '/relation/user/:uid/me', method: 'GET'},
            'save': {method: 'POST'},
            'follow': {method: 'POST'},
            'remove': {method: 'DELETE'},
            'delete': {method: 'DELETE'},
            'unfollow': {method: 'DELETE'},
            'queryFollows': {url: baseURL + '/relation/user/:uid/follows', method: 'GET'},
            'queryFollowers': {url: baseURL + '/relation/user/:uid/followers', method: 'GET'},
            'maybeknow': {url: baseURL + '/relation/maybeknow', method: 'GET'}
        });
}]);

PCServices.factory('GroupRelation', ['$resource', function ($resource) {
    return $resource(baseURL + '/follow/group/:gid', null,
        {
            'get': {url: '/relation/group/:uid/me', method: 'GET'},
            'save': {method: 'POST'},
            'follow': {method: 'POST'},
            'remove': {method: 'DELETE'},
            'delete': {method: 'DELETE'},
            'unfollow': {method: 'DELETE'},
            'queryFollowers': {url: baseURL + '/relation/group/:gid/followers', method: 'GET'}
        });
}]);

PCServices.factory('Group', ['$resource', function ($resource) {
    return $resource(baseURL + '/group/:gid', null,
        {
            'get': {url: '/relation/group/:uid/me', method: 'GET'},
            'save': {method: 'POST'},
            'remove': {method: 'DELETE'},
            'delete': {method: 'DELETE'},
            'update':{method: 'PUT'},
            'query': {url: baseURL + '/group/suggest/name/:gname', method: 'GET'}
        });
}]);