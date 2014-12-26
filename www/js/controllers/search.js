ang

.controller('SearchCtrl', function($scope,Case) {
    
    $scope.containsString = "";
    $scope.searchInDescription = true;
    $scope.excludeTags = [];
    $scope.includeTags = [];
    $scope.saveLastTag = [];

    $scope.search = function() {
        $scope.saveLastTag.forEach(function(f){ f(); });

        return;

        Case.createFreshCase
            .then(attachTags)
            .then(Case.searchNodes);
        
        function attachTags() {

            var tags = [];
            $scope.includeTags.forEach(function(tag){
                tag.weight = 100;
                tags.push(tag);
            });
            $scope.excludeTags.forEach(function(tag){
                tag.weight = -1;
                tags.push(tag);   
            });

            return $$q.all(tags.map(Case.addTag));
        }

    };

        
})