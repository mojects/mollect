angular.module('mollect')

.controller('IndexCtrl', function($scope, Nodes, sync) {
    console.log('IndexCtrl');

    $scope.nodes = Nodes.getIndexNodes();


    $scope.sync = function() {
        sync.run();
    }
})