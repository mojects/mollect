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
        $scope.node = {category: "thing"};
        $scope.node.tags = [];
        if ($routeParams.isReaction) {
            $scope.suggestedTags =  Case.getAttributesForNewReaction();
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
            console.log("New tag: " + tag);
            $scope.node.tags.push(tag);
        }
    });

    $scope.dropTag = function(tag) {
        console.log("Drop tag: " + tag);
        $scope.node.tags.remove(tag);
    }

    $scope.save = function() {
        $scope.info = "";
        $scope.alert = "";

        Nodes.insertNode($scope.node)
            .then(function(nodeId){
                $scope.info = "Saved!";
                location.href = "#/node/" + nodeId;
            });
    };

})