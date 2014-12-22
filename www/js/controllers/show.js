angular.module('mollect')

    .controller('ShowCtrl', function($scope, NodesFactory, Case, $routeParams) {
        $scope.node = NodesFactory.getNodeWithDetails($routeParams.nodeId)

        $scope.ratingIndex = -1;


        $scope.rateFunction = function(rating) {
            $scope.node.rate(rating);
        };

        Case.attachNode($routeParams.nodeId)
            .then(function () {
                $scope.relatedNodes = Case.getRelatedNodes();
            });


    })