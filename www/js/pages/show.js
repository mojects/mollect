angular.module('mollect')
.controller('ShowCtrl',
function($scope, nodes, Case, $routeParams, $location) {

  $scope.node = {name: "Loading..."}

  nodes.getNodeWithDetails($routeParams.nodeId)
  .then((n) => $scope.node = n)

  $scope.delete = () => {
    if (!confirm('Delete?')) return

    $scope.node.delete()
    .then(() => {
      $location.url("/").replace()
    })
  }


  Case.attachNode($routeParams.nodeId)
  .then(function () {
      $scope.relatedNodes = Case.getRelatedNodes()
  })


});