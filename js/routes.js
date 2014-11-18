var graphwar = angular.module('graphwar', ['ngRoute']).
    config(function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl: 'views/main/main.html',
            controller: 'MainViewCtrl'
        });

        $routeProvider.when('/play', {
            templateUrl: 'views/play/play.html',
            controller: 'PlayViewCtrl'
        });
    });
