ang.controller('SearchCtrl',
function ($scope, $routeParams, $location, nodes) {

  $scope.containsString = $routeParams.containsString || "";
  $scope.category = $routeParams.category || "all";
  $scope.searchInDescription =
    $routeParams.searchInDescription === undefined ?
    true : $routeParams.searchInDescription;

  $scope.includeTags = [];

  if ($routeParams.includeTags)
    nodes.byIds($routeParams.includeTags)
    .then((nodes) =>
      $scope.includeTags.merge(nodes));

  $scope.excludeTags = [];
  $scope.saveLastTag = [];

  $scope.search = function () {
    //$scope.saveLastTag.forEach((f) => f());

    $location.path('/search').search({
      containsString: $scope.containsString,
      includeTags: $scope.includeTags.map((tag) => tag.id)
    });
  };

  function showSearchResult() {
    var c = newClass(NodesWalker);

    c.containsString = $scope.containsString;
    c.searchInDescription = $scope.searchInDescription;
    c.category = $scope.category;

    $scope.includeTags.forEach(function (tag) {
      c.include_ids.push(tag.id);
    });
    $scope.excludeTags.forEach(function (tag) {
      c.exclude_ids.push(tag.id);
    });

    c.depth = 10;
    c.getChildren(outputNodes);

    function outputNodes(err, nodes) {
      $scope.resultNodes = nodes;
    }
  }

});