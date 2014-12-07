ang = angular.module('mollect', ['ngRoute', 'ngResource', 'angucomplete-alt']);

if (document.URL.indexOf("http://localhost:8081") !== -1) {
    ang.constant('host', 'http://mollect-server:3001');
    //ang.constant('host', 'http://mollect-server.herokuapp.com');
} else {
    ang.constant('host', 'http://mollect-server.herokuapp.com');
}

ang
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                controller:'IndexCtrl',
                templateUrl:'views/home.html'
            })
         /*   .when('/edit/:projectId', {
                controller:'EditCtrl',
                templateUrl:'detail.html'
            })                         */
            .when('/new', {
                controller:'NewCtrl',
                templateUrl:'views/new.html'
            })
            .when('/node/:nodeId', {
                controller:'NodeCtrl',
                templateUrl:'views/node.html'
            })

            .when('/stuff', {
                templateUrl:'views/stuff.html'
            })
            .when('/error', {
                templateUrl:'views/error.html'
            })
            .otherwise({
                templateUrl:'views/error.html'
            });
    })

    .run(function($window, $rootScope, dbInitializer) {
        $rootScope.online = navigator.onLine;
        $window.addEventListener("offline", function () {
            $rootScope.$apply(function() {
                $rootScope.online = false;
            });
        }, false);
        $window.addEventListener("online", function () {
            $rootScope.$apply(function() {
                $rootScope.online = true;
            });
        }, false);

        log(document.URL);
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