ang
.directive("tagsEdit", function() {
    return {
        templateUrl: 'views/tags-edit.html',
        scope : {
            pickedTags : "=",
            suggestedTags : "=",
            saveLastTag : "="
        },
        link : tagsEdit
    };
});

var testVar = "";

function tagsEdit($scope, elem, attrs) {

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

    $scope.$watch('saveLastTag', function(newValue, oldValue) {
        if (newValue == "undefined") {
            newValue = []
        }
        newValue.push(function() {
            testVar += "d";
            if ($scope.inputTag)
                $scope.addTag($scope.inputTag);
        });
    });
    
    $scope.tagInputChanged = function(tag) {
        $scope.inputTag = tag;
    }
    
    $scope.addTag = function(tag) {
        console.log("New tag: " + tag);
        if (typeof tag != 'object') tag = { name: tag };
        $scope.pickedTags.pushUnique(tag);
    }

    $scope.dropTag = function(tag) {
        console.log("Drop tag: " + tag);
        $scope.pickedTags.removeByName(tag);
    }

}