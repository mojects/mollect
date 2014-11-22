angular.module('mollect')

.controller('NewCtrl', function($scope, $location, Node) {

    $scope.save = function() {
        var node = new Node($scope.thing);
        node.$save().then(function(data) {
            $location.path('/');
        });
    };
})