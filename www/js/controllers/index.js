angular.module('mollect')

.controller('ListCtrl', function($scope, Projects) {
    $scope.projects = Projects;
})