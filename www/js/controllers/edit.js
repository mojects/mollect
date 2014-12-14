ang

.controller('EditCtrl', function($scope, $location, Nodes, Case, $routeParams) {

    // All possible tags:
    var tags_objects = Nodes.tags().then(function(tags) {
        $scope.tags_list = tags;
    });

    if ($location.path() == "/new")
        initNew();
    else
        initEdit();
   
    // NEW:
    function initNew() {
        if ($routeParams.type)
            $scope.node = {category: $routeParams.type};
        else
            $scope.node = {category: "thing"};

        $scope.node.tags = [];

        if ($routeParams.isReaction) {
            if (Case.currentStepNode == null) {
                $scope.alert = "currentStepNode missing";
                return;
            }
            var relatedTags = Case.getAttributesForNewReaction();
            $scope.suggestedTags = relatedTags.unselected;
            $scope.node.tags = relatedTags.selected;
        }
    }

    // EDIT:
    function initEdit() {
        $scope.node = Nodes.getNodeWithDetails($routeParams.nodeId);
    }

    // ERROR
    $scope.error = function(err) {
        $scope.alert = err;
        $scope.$apply();
    }

    $scope.$watch('selectedTag', function(newValue, oldValue) {
        if (newValue) {
            var tag = newValue.originalObject;
            if (typeof tag == 'object') tag = tag.name;
            $scope.addTag(tag);
        }
    });

    $scope.tagInputChanged = function(tag) {
        $scope.inputTag = tag;
    }

    $scope.addTag = function(tag) {
        console.log("New tag: " + tag);
        $scope.node.tags.pushUnique({ name: tag });
    }

    $scope.dropTag = function(tag) {
        console.log("Drop tag: " + tag);
        $scope.node.tags.removeByName(tag);
    }

    $scope.save = function() {
        $scope.info = "";
        $scope.alert = "";

        if ($scope.inputTag)
            $scope.addTag($scope.inputTag);

        Nodes.insertNode($scope.node)
            .then(function(nodeId){
                $scope.info = "Saved!";
                location.href = "#/node/" + nodeId;
            });
    };

})