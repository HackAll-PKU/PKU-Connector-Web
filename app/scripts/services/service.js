/**
 * Created by ChenLetian on 16/5/21.
 */
var baseURL = 'http://pikkacho.cn/api/v1';
var PCServices = angular.module('PCServices', ['ngStorage', 'ngResource']);

PCServices.factory('User', ['$http', '$localStorage', function ($http, $localStorage) {

        function urlBase64Decode(str) {
            var output = str.replace('-', '+').replace('_', '/');
            switch (output.length % 4) {
                case 0:
                    break;
                case 2:
                    output += '==';
                    break;
                case 3:
                    output += '=';
                    break;
                default:
                    throw 'Illegal base64url string!';
            }
            return window.atob(output);
        }

        function getUserFromToken() {
            return $localStorage.user;
        }

        return {
            save: function(data, success, error) {
                $http.post(baseURL + '/user', data).then(success, error);
            },
            login: function(uname, password, success, error) {
                $http.post(baseURL + '/authentication', {uname: uname, password: password}).then(function successHandler(response) {
                    $localStorage.token = response.data.token;
                    var encoded = response.data.token.split('.')[1];
                    $localStorage.user = JSON.parse(urlBase64Decode(encoded));
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
                return getUserFromToken();
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
            'groupGet': {url: baseURL + '/talkings/g/:gid', method: 'GET'}
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