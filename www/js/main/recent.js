angular.module('mollect')
.controller('RecentCtrl',
function($scope, desk, $location,
         $routeParams, NodesFactory) {

    NodesFactory.recent()
        .then(function (nodes) {
            $scope.nodes = nodes;
        });

});