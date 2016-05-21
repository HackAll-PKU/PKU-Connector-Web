/**
 * Created by ChenLetian on 16/5/21.
 */

describe('indexController', function() {
    beforeEach(module('PCControllers'));

    it('should bind name', inject(function($controller) {
        var scope = {},
            controller = $controller('indexController', {$scope: scope});
        expect(scope.name).toBe("index")
    }));
});

describe('loginController', function() {
    beforeEach(module('PCControllers'));

    it('should bind name', inject(function($controller) {
        var scope = {},
            controller = $controller('loginController', {$scope: scope});
        expect(scope.name).toBe("login")
    }));
});

describe('signupController', function() {
    beforeEach(module('PCControllers'));

    it('should bind name', inject(function($controller) {
        var scope = {},
            controller = $controller('signupController', {$scope: scope});
        expect(scope.name).toBe("signup")
    }));
});