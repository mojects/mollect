ang
.directive("tagsEdit", function() {
  return {
    templateUrl: 'js/directives/tags-edit.html',
    scope : {
      label : "@",
      searchOnEnter: "&",
      tagStyle : "@",
      pickedTags : "=",
      suggestedTags: "=",
      inputText: "=",
      saveLastTag : "="
    },
    transclude: true,
    controller : tagsEdit
  };
});

function tagsEdit($scope, nodes, desk) {

    $scope.tagStyle = $scope.tagStyle || "success";
    // All possible tags:
    nodes.tags().then(function(tags) {
      $scope.tags_list = tags;
    });

    $scope.$watch('selectedTag', function(newValue) {
      var tag
      if (newValue && (tag = newValue.originalObject))
        $scope.addTag(tag)
    });

    if ($scope.saveLastTag) {
      $scope.saveLastTag = () => {
        if ($scope.inputText)
          $scope.addTag($scope.inputText)
      }
    }

    $scope.inputChanged = function(tag) {
      $scope.inputText = tag
    }

    $scope.addTag = (tag) => {
      if (typeof tag == 'object')
        addTag(tag)
      else
        performSearch(tag) || addTag({ name: tag })
    }

    function performSearch(tag) {
      if (!$scope.searchOnEnter) return false

      $scope.inputChanged(tag)
      setTimeout(() => {
        $scope.searchOnEnter()
        desk.refresh()
      }, 0)
      return true
    }

    function addTag(tag) {
      $scope.pickedTags.pushUnique(tag)
    }

    $scope.dropTag = function(tag) {
      $scope.pickedTags.removeByName(tag)
    }

}