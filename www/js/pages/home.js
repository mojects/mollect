angular.module('mollect')
  .controller('HomeCtrl',
  function($scope, desk, $location,
           $routeParams, nodes, sync) {
    console.log('HomeCtrl', $routeParams.type);

    $scope.nodeGroups = nodes.getIndexNodes($routeParams.type);
    $scope.selectedTags = Case.selectedTags;

    $scope.clientVersion =     settings.client_version          ;

    $scope.sync = function() {
      sync.run(desk.showErrorOrSuccess);
    };

    $scope.suggest = function(tag) {
      Case.addTag(tag);
    };

    $scope.setTag = function(tag) {
      Case.addTag(tag);
    };

    $scope.test = function(arg) {
      desk.showErrorOrSuccess(arg);
    }
  });