'use strict';
app.controller('indexController', ['$scope', '$location', 'authService', function ($scope, $location, authService) {

    $scope.logOut = function () {
        authService.logOut();        
    }

    $scope.authentication = authService.authentication;
    $scope.isAdmin = authService.authentication.isAdmin;

}]);