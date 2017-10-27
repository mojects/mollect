function routesSetup($routeProvider) {
  $routeProvider
    .when('/home/:type', {
      controller:'HomeCtrl',
      templateUrl:'js/main/home.html'
    })
    .when('/', {
      controller:'HomeCtrl',
      templateUrl:'js/main/home.html'
    })
    .when('/search', {
      controller:'SearchCtrl',
      templateUrl:'js/main/search.html'
    })
    .when('/recent', {
      controller:'RecentCtrl',
      templateUrl:'js/main/recent.html'
    })
    .when('/edit/:nodeId', {
      controller:'EditCtrl',
      templateUrl:'js/main/edit.html'
    })
    .when('/new', {
      controller:'EditCtrl',
      templateUrl:'js/main/edit.html'
    })
    .when('/node/:nodeId', {
      controller:'ShowCtrl',
      templateUrl:'html/main/show.html'
    })
    .when('/config', {
      controller:'ConfigCtrl',
      templateUrl:'js/utils/config.html'
    })
    .when('/dump', {
      controller:'DumpCtrl',
      templateUrl:'js/utils/dump.html'
    })

    .when('/stuff', {
      templateUrl:'js/utils/stuff.html'
    })
    .when('/icons', {
      templateUrl:'css/icons/demo-in.html'
    })
    .when('/error', {
      templateUrl:'js/utils/error.html'
    })
    .otherwise({
      templateUrl:'js/utils/error.html'
    });
}