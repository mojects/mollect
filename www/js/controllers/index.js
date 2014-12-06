angular.module('mollect')

.controller('IndexCtrl', function($scope, Nodes) {
    console.log('IndexCtrl');

    $scope.nodes = Nodes.getIndexNodes();
})