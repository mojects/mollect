ang
.directive("tagsEdit", function() {
    return {
        templateUrl: 'views/tags-edit.html',
        scope : {
            label : "@",
            tagStyle : "@",
            pickedTags : "=",
            suggestedTags : "=",
            saveLastTag : "="
        },
        controller : tagsEdit
    };
});

function tagsEdit($scope, NodesFactory) {

    $scope.tagStyle = $scope.tagStyle || "success";
    // All possible tags:
    NodesFactory.tags().then(function(tags) {
        $scope.tags_list = tags;
    });
    
    $scope.$watch('selectedTag', function(newValue, oldValue) {
        if (newValue) {
            var tag = newValue.originalObject;
            $scope.addTag(tag);
        }
    });


    $scope.saveLastTag.push(function() {
        if (inputTag)
            $scope.addTag(inputTag);
    });

    var inputTag = null;
    $scope.tagInputChanged = function(tag) {
        // if (tag)
            inputTag = tag;
    }
    
    $scope.addTag = function(tag) {
        if (typeof tag != 'object') tag = { name: tag };
        $scope.pickedTags.pushUnique(tag);
    }

    $scope.dropTag = function(tag) {
        $scope.pickedTags.removeByName(tag);
    }

}