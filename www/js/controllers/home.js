angular.module('mollect')

    .controller('HomeCtrl', function($scope, desk, $location, NodesFactory, sync) {
        console.log('HomeCtrl');

        var obstacles = $location.path() == "/obstacles";

        $scope.nodeGroups = NodesFactory.getIndexNodes(obstacles);
        $scope.selectedTags = Case.selectedTags;

        $scope.clientVersion =     settings.client_version          ;

        $scope.sync = function() {
            sync.run(function(err){
                desk.showErrorOrSuccess(err);
            });
        }

        $scope.suggest = function(tag) {
            Case.addTag(tag);
        }

        $scope.setTag = function(tag) {
            Case.addTag(tag);
        }

        $scope.test = function(arg) {
            desk.showErrorOrSuccess(arg);
        }
    })