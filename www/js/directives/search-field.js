ang.directive("searchField", function() {
  return {
    templateUrl: 'js/directives/search-field.html',
    scope : {
      searching: "="
    },
    controller : function($scope, $routeParams, $location, nodes, desk) {

      $scope.text = $routeParams.text
      $scope.tags = []
      loadListFromParam('tags')

      $scope.search = function () {
        $location.path('/search').search({
          text: $scope.text,
          tags: $scope.tags.map((tag) => tag.id)
        });
      };

      function loadListFromParam(listName) {
        if (!$routeParams[listName]) return

        nodes
        .byIds($routeParams[listName])
        .then((nodes) => {
          $scope[listName].merge(nodes)
          desk.refresh()
        })
      }

    }
  };
});
