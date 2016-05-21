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
                $http.post(baseURL + '/user', data).success(success).error(error);
            },
            signin: function(uname, password, success, error) {
                $http.post(baseURL + '/authentication', {uname: uname, password: password}).success(success).error(error);
            },
            query: function(uid, success, error) {
                $http.get(baseURL + '/user/:uid', {params: {uid: uid}}).success(success).error(error);
            }
        }
    }]);