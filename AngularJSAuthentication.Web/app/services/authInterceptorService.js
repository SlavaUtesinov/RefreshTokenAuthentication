'use strict';
app.factory('authInterceptorService', ['$q', '$injector', '$location', 'localStorageService', 'ngAuthSettings', function ($q, $injector, $location, localStorageService, ngAuthSettings) {

    var authInterceptorServiceFactory = {};
    var refreshInProgress = false;


    var _refreshToken = function () {
        var deferred = $q.defer();
        refreshInProgress = true;

        var authData = localStorageService.get('authorizationData');

        if (authData) {

            if (authData.useRefreshTokens) {

                var data = "grant_type=refresh_token&refresh_token=" + authData.refreshToken + "&client_id=" + ngAuthSettings.clientId;

                localStorageService.remove('authorizationData');
                var $http = $injector.get("$http");

                $http.post(ngAuthSettings.apiServiceBaseUri + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {

                    localStorageService.set('authorizationData', { token: response.access_token, userName: response.userName, refreshToken: response.refresh_token, useRefreshTokens: true });
                    
                    deferred.resolve(response);

                }).error(function (err, status) {
                    _logOut();                    
                    deferred.reject(err);
                });
            }
        }

        return deferred.promise;
    };

    var _request = function (config) {

        var deferred = $q.defer();

        if (!refreshInProgress) {            

            var diff = 0;
            if (ngAuthSettings.dateTime)
                diff = ((new Date()) - ngAuthSettings.dateTime) / 1000 / 60;

            if (diff > 1) {
                ngAuthSettings.dateTime = new Date();

                _refreshToken().then(function () {
                        config.headers = config.headers || {
                        };
                        var authData = localStorageService.get('authorizationData');
                        if (authData) {
                            config.headers.Authorization = 'Bearer ' + authData.token;
                        }
                        refreshInProgress = false;
                        deferred.resolve(config);
                    },
                    function (err) {
                        refreshInProgress = false;
                        deferred.reject(err);
                    }
                );
            }
            else {

                config.headers = config.headers || {};
                var authData = localStorageService.get('authorizationData');
                if (authData) {
                    config.headers.Authorization = 'Bearer ' + authData.token;
                }
                deferred.resolve(config);
            }
        }
        else {
            deferred.resolve(config);
        }

                         
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