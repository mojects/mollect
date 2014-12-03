angular.module('mollect')

.controller('IndexCtrl', function($scope, Nodes) {
        $scope.nodes = Nodes.getIndexNodes();
})