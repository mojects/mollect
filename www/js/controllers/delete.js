angular.module('mollect')

.controller('DeleteCtrl', function($scope, Node, $routeParams) {
    console.log('DeleteCtrl');

        var node = new Node($routeParams.nodeId);
        node.delete().then(function(){
            location.href = "#/";
        });

})