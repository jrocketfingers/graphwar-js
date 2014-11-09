/// <reference path="defs/angular.d.ts" />
/// <reference path="graph.ts" />

module game {
    'use strict';

    angular.module('graphwar', ['ngRoute'])
        .config(function ($routeProvider) {

            var routeConfig;
            routeConfig = {
                controller: 'GameCtrl',
                templateUrl: 'graphwar-main.html'
            };

            $routeProvider
                .when('/', routeConfig)
                .otherwise({
                    redirectTo: '/'
                });
        });


    angular.module('graphwar').controller('GameCtrl', function($scope, $routeParams) {
        var xlim:graphwar.util.Limit = {'lower': -25, 'upper': 25};
        var ylim:graphwar.util.Limit = {'lower': -25, 'upper': 25};
        var graph = new graphwar.Graph('graph', xlim, ylim);

        $scope.shoot = function() : void {
            var x = $scope.xOrigin;
            var y = $scope.yOrigin;

            graph.clear();
            graph.shoot(function (x) {
                return x - 10;
            }, new graphwar.Point(x, y), 20, 1000, true);
        }
    });
}
