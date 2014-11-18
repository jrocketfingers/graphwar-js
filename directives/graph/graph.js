angular.module('graphwar').directive('graph', function($timeout, gameSettingsSvc) {
      return {
          restrict: 'E',
          templateUrl: 'directives/graph/graph.html',
          scope: {
            'width': '=',
            'height': '='
          },
          link: function(scope, element, attrs) {
              var Graph;
              scope.xOrigin = 0;
              scope.yOrigin = 0;

              scope.locked = graph.locked;


              scope.shoot = function () {
                  var x = scope.xOrigin;
                  var y = scope.yOrigin;
                  try {
                      var parsed = window.parser.parse(scope.function);
                      Graph.clear();
                      Graph.shoot(function (x) {
                          return window.parser.calculate(parsed, x);
                      }, new graphwar.Point(x, y), 1000, 0.1, 1000, true);
                      scope.error = "";
                  }
                  catch (err) {
                      scope.error = err;
                  }
              };


              // prepare the graph
              $timeout(function() {
                  var xlim = { 'lower': -25, 'upper': 25 };
                  var ylim = { 'lower': -25, 'upper': 25 };

                  Graph = new graphwar.Graph('graph', xlim, ylim, scope.width, scope.height);
              });
          }
      }
  });