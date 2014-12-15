angular.module('mollect')

.controller('HomeCtrl', function($scope, desk, $location, Nodes, sync) {
    console.log('HomeCtrl');

    var obstacles = $location.path() == "/obstacles";

    $scope.nodeGroups = Nodes.getIndexNodes(obstacles);

        $scope.clientVersion =     settings.client_version          ;

    $scope.sync = function() {
        sync.run(function(err){
            desk.showErrorOrSuccess(err);
        });
    }

        $scope.isActive = function(arg) {
            return arg == 'trick';
        }

        $scope.test = function(arg) {
            desk.showErrorOrSuccess(arg);
        }
})