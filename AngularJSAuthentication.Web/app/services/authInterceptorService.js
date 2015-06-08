'use strict';
app.factory('authInterceptorService', ['$q', '$injector', '$location', 'localStorageService', 'authService', function ($q, $injector, $location, localStorageService, authService) {

    var authInterceptorServiceFactory = {};

    var _request = function (config) {
        var deferred = $q.defer();
        
        
        config.headers = config.headers || {};
       
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            config.headers.Authorization = 'Bearer ' + authData.token;
        }
        deferred.resolve(config);
                         
        //return config;
        return deferred.promise;
    }

    var _responseError = function (rejection) {
        if (rejection.status == 401) {
            //var authService = $injector.get('authService');
            //var authData = localStorageService.get('authorizationData');

            //if (authData) {
            //    if (authData.useRefreshTokens) {
            //        $location.path('/refresh');
            //        return $q.reject(rejection);
            //    }
            //}
            //authService.logOut();
            $location.path('/notAutorize');
        }
        return $q.reject(rejection);
    }

    authInterceptorServiceFactory.request = _request;
    authInterceptorServiceFactory.responseError = _responseError;

    return authInterceptorServiceFactory;
}]);