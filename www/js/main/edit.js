ang

.controller('EditCtrl', function($scope, $location, NodesFactory, Case, $routeParams) {

    $scope.saveLastTag = [];

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
        $scope.node = NodesFactory.getNodeWithDetails($routeParams.nodeId);
    }

    // ERROR
    $scope.error = function(err) {
        $scope.alert = err;
        $scope.$apply();
    }

    $scope.save = function() {
        $scope.info = "";
        $scope.alert = "";
        $scope.saveLastTag.forEach(function(f){ f(); });

        NodesFactory.insertNode($scope.node)
            .then(function(nodeId){
                $scope.info = "Saved!";
                location.href = "#/node/" + nodeId;
            });
    };

})