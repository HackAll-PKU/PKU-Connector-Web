/**
 * Created by ChenLetian on 16/5/21.
 */
var baseURL = 'http://pikkacho.cn/api/v1';
angular.module('UserService', [
        'ngStorage'
    ])
    .factory('User', ['$http', '$localStorage', function ($http, $localStorage) {
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