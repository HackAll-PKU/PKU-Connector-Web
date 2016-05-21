/**
 * Created by ChenLetian on 16/5/21.
 */
var baseURL = 'http://pikkacho.cn/api/v1';
angular.module('UserService', [
        'ngStorage'
    ])
    .factory('User', ['$http', '$localStorage', function ($http, $localStorage) {

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
            var user = $localStorage.user;
            if (user) {
                return user;
            }
            var token = $localStorage.token;
            if (typeof token !== 'undefined') {
                var encoded = token.split('.')[1];
                user = JSON.parse(urlBase64Decode(encoded));
                $localStorage.user = user;
            }
            return user;
        }

        return {
            save: function(data, success, error) {
                $http.post(baseURL + '/user', data).then(success, error);
            },
            login: function(uname, password, success, error) {
                $http.post(baseURL + '/authentication', {uname: uname, password: password}).then(function successHandler(response) {
                    $localStorage.token = response.data.token;
                    $localStorage.user = getUserFromToken();
                    success();
                }, error);
            },
            query: function(uid, success, error) {
                $http.get(baseURL + '/user/:uid', {params: {uid: uid}}).then(success, error);
            },
            update: function(uid, data, success, error) {
                $http.put(baseURL + '/user/:uid', data, {params: {uid: uid}}).then(success, error);
            },
            getCurrentUser: function() {
                return getUserFromToken();
            }
        }
    }]);