angular.module('mollect')

    .controller('ShowCtrl', function($scope, NodesFactory, Case, $routeParams) {
        $scope.node = NodesFactory.getNodeWithDetails($routeParams.nodeId)

        $scope.rating = -1;


        $scope.rateFunction = function(rating) {
            // alert("Rating selected - " + rating);
        };

        Case.attachNode($routeParams.nodeId)
            .then(function () {
                $scope.relatedNodes = Case.getRelatedNodes();
            });


    })