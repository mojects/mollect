angular.module('mollect')

    .controller('ShowCtrl', function($scope, Nodes, Case, $routeParams) {
        $scope.node = Nodes.getNodeWithDetails($routeParams.nodeId)

        Case.attachNode($routeParams.nodeId)
            .then(function () {
                $scope.relatedNodes = Case.getRelatedNodes();
            });


    })