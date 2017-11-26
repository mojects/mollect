ang.controller('SearchCtrl',
function ($scope, $routeParams) {

  if (!($routeParams.text || $routeParams.tags)) return

  $scope.searching = true

  var c = newClass(NodesWalker)

  c.containsString = $routeParams.text
  c.include_ids = $routeParams.tags
  c.searchInDescription = true
  c.category = 'all'
  c.depth = 10

  c.getChildren((err, nodes) => {
    $scope.resultNodes = nodes
    $scope.searching = false
  });

});