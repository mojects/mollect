angular.module('mollect')
.controller('RecentCtrl',
function($scope, desk, $location,
         $routeParams, nodes) {

    nodes.recent()
        .then(function (nodes) {
            $scope.nodes = nodes;
        });

});