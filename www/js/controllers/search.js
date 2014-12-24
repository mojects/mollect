ang

.controller('SearchCtrl', function($scope,Case) {
    
    $scope.containsString;
    $scope.searchInDescription;
    $scope.excludeTags;

    $scope.search = function() {
        $scope.saveLastTag.forEach(function(f){ f(); });
        
        MAke stac of deffered:
        
        Case.createFreshCase
        .then(addTags);
        
        function addTags() {
            $scope.includeTags.forEach(function(tag){
                tag.weight = 100;
                (tag);
            });
    
            async.map($scope.includeTags, Case.addTag, function(err, results){
                self.unlinkAbsentTags(results)
                    .then(function(){callback();});
            });

            
            .then(function () {
                    $scope.relatedNodes = Case.getRelatedNodes();
            });
        }
        
    };

        
})