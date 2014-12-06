angular.module('mollect')

    .controller('NodeCtrl', function($scope, Nodes, Case, $routeParams) {
        $scope.node = Nodes.getNodeWithDetails($routeParams.nodeId)

        $scope.relatedNodes = "sds";

        Case.createFreshCase()
            .then(function () {
                $scope.relatedNodes = Case.getRelatedNodes;
            });


    })