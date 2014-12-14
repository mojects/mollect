angular.module('mollect')

.controller('HomeCtrl', function($scope, $location, Nodes, sync) {
    console.log('HomeCtrl');

    var obstacles = $location.path() == "/obstacles";

    $scope.nodeGroups = Nodes.getIndexNodes(obstacles);

        $scope.clientVersion =     settings.client_version          ;

    $scope.sync = function() {
        sync.run();
    }

        $scope.isActive = function(arg) {
            return arg == 'trick';
        }
})