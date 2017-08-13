ang.controller('SearchCtrl',
function ($scope, $routeParams) {

  var c = newClass(NodesWalker);
  c.containsString = $routeParams.text;
  c.include_ids = $routeParams.tags;
  c.searchInDescription = true;
  c.category = 'all';
  c.depth = 10;
  c.getChildren(outputNodes);
  function outputNodes(err, nodes) {
    $scope.resultNodes = nodes;
  }

});