/**
 * Created by ChenLetian on 16/5/21.
 */

describe('indexController', function() {
    beforeEach(module('PCControllers'));

});

describe('loginController', function() {
    var scope, controller, $httpBackend, storage, location, user;

    beforeEach(module('PCControllers'));

    beforeEach(inject(function($controller, $localStorage, $rootScope, _$httpBackend_, $location, User) {
        $httpBackend = _$httpBackend_;
        $httpBackend.expectPOST('http://pikkacho.cn/api/v1/authentication').respond({
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmFtZSI6ImNsdCIsInVpZCI6NCwiaWF0IjoxNDYzODUwNjIxLCJleHAiOjE0NjQwMjM0MjF9.n22c1SBeeLsFl6-5Vqv03mDe8bX3VkdwBnY9q3wcl8c',
            uid: '4',
            uname: 'clt'
        });
        scope = $rootScope.$new();
        controller = $controller('loginController', {$scope: scope});
        storage = $localStorage;
        storage.token = undefined;
        storage.user = undefined;
        location = $location;
        user = User;
    }));

    it('should store token and user info', function() {
        expect(storage.token).toBeUndefined();
        expect(storage.user).toBeUndefined();
        scope.uname = 'clt';
        scope.password = '123';
        scope.login();
        expect(storage.token).toBeUndefined();
        expect(storage.user).toBeUndefined();
        $httpBackend.flush();
        expect(storage.token).toEqual("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmFtZSI6ImNsdCIsInVpZCI6NCwiaWF0IjoxNDYzODUwNjIxLCJleHAiOjE0NjQwMjM0MjF9.n22c1SBeeLsFl6-5Vqv03mDe8bX3VkdwBnY9q3wcl8c");
        expect(storage.user.uname).toEqual("clt");
        expect(storage.user.uid).toEqual('4');
        expect(location.path()).toBe('/');
        expect(user.getCurrentUser().uname).toEqual("clt");
        expect(user.getCurrentUser().uid).toEqual('4');
    });
});

describe('signupController', function() {
    var scope, controller, $httpBackend, location;

    beforeEach(module('PCControllers'));

    beforeEach(inject(function($controller, $rootScope, _$httpBackend_, $location) {
        $httpBackend = _$httpBackend_;
        $httpBackend.expectPOST('http://pikkacho.cn/api/v1/user').respond({msg: "OK", data: {uid: 5}});
        scope = $rootScope.$new();
        controller = $controller('signupController', {$scope: scope});
        location = $location;
    }));

    it('should respond OK', function() {
        expect(scope.indicator).toBe('Sign Up');
        scope.uname = 'clt';
        scope.password = '123';
        scope.signup();
        expect(scope.indicator).toBe('Sign Up');
        $httpBackend.flush();
        expect(scope.indicator).toBe('注册成功! 正在跳转.');
    });

});

describe('UserService', function() {
    var $httpBackend, user;

    beforeEach(module('PCServices'));

    beforeEach(inject(function(User, _$httpBackend_) {
        $httpBackend = _$httpBackend_;
        $httpBackend.expectPUT('http://pikkacho.cn/api/v1/user/4').respond({msg: "OK"});
        user = User;
    }));

    it('should update user\'s profile', function () {
        user.update(4, {uname: "clt"}, function(response){
            expect(response.data.msg).toBe("OK");
        }, function() {

        });
        $httpBackend.flush();
    });
});