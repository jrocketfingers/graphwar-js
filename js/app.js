/// <reference path="defs/angular.d.ts" />
/// <reference path="graph.ts" />
/// <reference path="player.ts" />
var game;
(function (game) {
    'use strict';
    angular.module('graphwar').controller('SetupCtrl', function ($scope) {
        $scope.players = [];
        $scope.newPlayer = function () {
            $scope.players.append(new graphwar.Player($scope.newPlayerName));
        };
    });
    angular.module('graphwar').controller('GameCtrl', function ($scope, $routeParams) {
    });
})(game || (game = {}));
//# sourceMappingURL=app.js.map