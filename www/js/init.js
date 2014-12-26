ang = angular.module('mollect', ['ngRoute', 'ngResource', 'angucomplete-alt']);

var $$q = null;

ang
    .config(function($routeProvider) {
        $routeProvider
            .when('/', {
                controller:'HomeCtrl',
                templateUrl:'views/home.html'
            })
            .when('/obstacles', {
                controller:'HomeCtrl',
                templateUrl:'views/home.html'
            })
            .when('/search', {
                controller:'SearchCtrl',
                templateUrl:'views/search.html'
            })
            .when('/edit/:nodeId', {
                controller:'EditCtrl',
                templateUrl:'views/edit.html'
            })                         
            .when('/new', {
                controller:'EditCtrl',
                templateUrl:'views/edit.html'
            })
            .when('/delete/:nodeId', {
                controller:'DeleteCtrl',
                templateUrl:'views/show.html'
            })
            .when('/node/:nodeId', {
                controller:'ShowCtrl',
                templateUrl:'views/show.html'
            })
            .when('/config', {
                controller:'ConfigCtrl',
                templateUrl:'views/utils/config.html'
            })
            .when('/dump', {
                controller:'DumpCtrl',
                templateUrl:'views/utils/dump.html'
            })

            .when('/stuff', {
                templateUrl:'views/utils/stuff.html'
            })
            .when('/icons', {
                templateUrl:'css/icons/demo-in.html'
            })
            .when('/error', {
                templateUrl:'views/utils/error.html'
            })
            .otherwise({
                templateUrl:'views/utils/error.html'
            });
    })

    .run(function($window, $rootScope, $q, dbInitializer) {
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

        $$q = $q;

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