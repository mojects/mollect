angular.module('mollect', ['ngRoute', 'ngResource'])

    .factory('Node', ['$resource', function($resource) {
        return $resource('http://mollect-server:3001/nodes/:id', null);
    }])

    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                controller:'IndexCtrl',
                templateUrl:'views/index.html'
            })
         /*   .when('/edit/:projectId', {
                controller:'EditCtrl',
                templateUrl:'detail.html'
            })                         */
            .when('/new', {
                controller:'NewCtrl',
                templateUrl:'views/new.html'
            })
            .when('/stuff', {
                templateUrl:'views/stuff.html'
            })
            .otherwise({
                redirectTo:'/'
            });
    })


             /*

    .controller('EditCtrl',
    function($scope, $location, $routeParams, Projects) {
        var projectId = $routeParams.projectId,
            projectIndex;

        $scope.projects = Projects;
        projectIndex = $scope.projects.$indexFor(projectId);
        $scope.project = $scope.projects[projectIndex];

        $scope.destroy = function() {
            $scope.projects.$remove($scope.project).then(function(data) {
                $location.path('/');
            });
        };

        $scope.save = function() {
            $scope.projects.$save($scope.project).then(function(data) {
                $location.path('/');
            });
        };
    });            */