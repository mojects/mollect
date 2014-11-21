angular.module('mollect')

.controller('NewCtrl', function($scope, $location, Projects) {
    $scope.save = function() {
        Projects.$add($scope.project).then(function(data) {
            $location.path('/');
        });
    };
})