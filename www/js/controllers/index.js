angular.module('mollect')

.controller('IndexCtrl', function($scope, Nodes) {
    console.log('IndexCtrl');

    Nodes.getIndexNodes()
        .then(function(nodes) {
                $scope.nodes = nodes;
        });
})