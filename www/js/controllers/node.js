angular.module('mollect')

    .controller('NodeCtrl', function($scope, Nodes, $routeParams) {
        $scope.node = Nodes.getNodeWithDetails($routeParams.nodeId)

    })