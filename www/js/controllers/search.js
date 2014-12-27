ang

.controller('SearchCtrl', function($scope,Case) {
    
    $scope.containsString = "";
    $scope.category = "all";
    $scope.searchInDescription = true;
    $scope.excludeTags = [];
    $scope.includeTags = [];
    $scope.saveLastTag = [];

    $scope.search = function() {
        $scope.saveLastTag.forEach(function(f){ f(); });

        var c = newClass(NodesWalker);

        c.containsString = $scope.containsString;
        c.searchInDescription = $scope.searchInDescription;
        c.category = $scope.category;

        $scope.includeTags.forEach(function(tag){
            c.include_ids.push(tag.id);
        });
        $scope.excludeTags.forEach(function(tag){
            c.exclude_ids.push(tag.id);
        });

        c.depth = 10;
        c.getChildren(outputNodes);

        function outputNodes(err, nodes) {
            $scope.resultNodes = nodes;
        }
    };



        
})