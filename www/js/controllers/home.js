angular.module('mollect')

.controller('IndexCtrl', function($scope, Nodes, sync) {
    console.log('IndexCtrl');

    $scope.nodes = Nodes.getIndexNodes();

        $scope.clientVersion =     settings.client_version          ;

    $scope.sync = function() {
        sync.run();
    }
})