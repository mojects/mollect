ang = angular.module('mollect', ['ngRoute', 'ngResource',
    'ngSanitize', 'angucomplete-alt']);

var $$q = null, $$sce = null;

ang
.config(['$routeProvider', routesSetup])
.run(function($window, $rootScope, $q, $sce, dbInitializer) {
  dbInitializer.init()
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
  $$sce = $sce;

  log(document.URL);
});
