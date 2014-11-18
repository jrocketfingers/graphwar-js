angular.module('graphwar')
    .controller('PlayViewCtrl', function($scope, gameSettingsSvc) {
        angular.extend($scope, gameSettingsSvc.data);
    });
