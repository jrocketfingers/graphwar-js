angular.module('graphwar')
    .controller('MainViewCtrl', function($scope, $location, gameSettingsSvc) {
        angular.extend($scope, gameSettingsSvc.data);

        $scope.addPlayer = function() {
            if($scope.newPlayer) {
                gameSettingsSvc.addPlayer($scope.newPlayer);

                $scope.newPlayer = '';
            } else {
                $scope.newPlayerFirstError = true;
            }
        };

        $scope.proceed = function() {
            gameSettingsSvc.data.settings = $scope.settings;
            $location.url('/play');
        };
    });