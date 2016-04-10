angular.module('mollect')
.controller('RecentCtrl', 
function($scope, desk, $location,
         $routeParams, NodesFactory, sync) {

//    $scope.nodes = NodesFactory.recent();


    NodesFactory.recent()
        .then(function (nodes) {
            console.log('!!!', nodes);
            $scope.nodes = nodes;
        });
    
});