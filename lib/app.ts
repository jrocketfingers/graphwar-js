/// <reference path="defs/angular.d.ts" />
/// <reference path="graph.ts" />
/// <reference path="player.ts" />

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


    angular.module('graphwar').controller('SetupCtrl', function($scope) {
        $scope.players = [];
        $scope.newPlayer = function() : void {
            $scope.players.append(new graphwar.Player($scope.newPlayerName));
        }
    });

    angular.module('graphwar').controller('GameCtrl', function($scope, $routeParams) {
        var xlim:graphwar.util.Limit = {'lower': -25, 'upper': 25};
        var ylim:graphwar.util.Limit = {'lower': -25, 'upper': 25};
        var graph = new graphwar.Graph('graph', xlim, ylim);

        $scope.xOrigin = 0;
        $scope.yOrigin = 0;

        $scope.locked = graph.locked;

        $scope.shoot = function() : void {
            var x = $scope.xOrigin;
            var y = $scope.yOrigin;

            try {
                var parsed = (<any>window).parser.parse($scope.function);

                graph.clear();
                graph.shoot(function (x) {
                    return (<any>window).parser.calculate(parsed, x);
                }, new graphwar.Point(x, y), 1000, 0.1, 1000, true);

                $scope.error = "";
            } catch(err) {
                $scope.error = err;
            }
        }
    });
}
