angular.module('graphwar')
.service('gameSettingsSvc', function() {
    var service = {
                      'data': {
                          'players': [],
                          'settings': {
                            'width': 800,
                            'height': 800,
                            'minX': -25,
                            'minY': -15,
                            'maxX': 25,
                            'maxY': 15
                          }
                      }
                  };

    var colors = ['blue', 'orange', 'green', 'red', 'purple', 'teal'];
    var currentColor = 0;

    service.addPlayer = function(playerName) {
        service.data.players.push({
                                    'name': playerName,
                                    'soldiers': 1,
                                    'isOrigin': true,
                                    'color': colors[currentColor]
                                  });

        currentColor++;
    };

    return service;
});
