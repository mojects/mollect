angular.module('mollect')
.controller('ShowCtrl', function($scope, nodes, Case, $routeParams, $location) {

  $scope.node = {name: "Loading..."}

  load()
  async function load() {
    var n = await nodes.getNodeWithDetails($routeParams.nodeId)
    $scope.node = n
  }

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