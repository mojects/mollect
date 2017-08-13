ang
.directive("tagsEdit", function() {
  return {
    templateUrl: 'js/directives/tags-edit.html',
    scope : {
      label : "@",
      createNewTags: "@",
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

function tagsEdit($scope, nodes) {

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

    $scope.tagInputChanged = function(tag) {
      $scope.inputText = tag
    }

    $scope.addTag = (tag) => {
      if (typeof tag != 'object') {
        if (!$scope.createNewTags) return
        tag = { name: tag }
      }
      $scope.pickedTags.pushUnique(tag)
    }

    $scope.dropTag = function(tag) {
      $scope.pickedTags.removeByName(tag)
    }

}