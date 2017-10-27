angular.module('mollect')
.controller('ShowCtrl',
function($scope, nodes, Case, $routeParams, $location) {

  $scope.node = nodes.getNodeWithDetails($routeParams.nodeId)
  $scope.ratingIndex = -1

  $scope.rateFunction = (rating) => {
      $scope.node.rate(rating)
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