angular.module('mollect')

.controller('HomeCtrl', function($scope, Nodes, sync) {
    console.log('HomeCtrl');

    $scope.nodes = Nodes.getIndexNodes();

        $scope.clientVersion =     settings.client_version          ;

    $scope.sync = function() {
        sync.run();
    }
})