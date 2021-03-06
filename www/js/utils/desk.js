ang
.controller('DeskCtrl', function($scope, $rootScope, desk) {

    $scope.desk = desk;

    $rootScope.$on('$locationChangeSuccess', function () {
        desk.clear();
    });

})
.service("desk", desk);

function desk($rootScope, $timeout) {

  var self = this;
  this.message = null;
  this.alert = null;

  this.info = (message) => {
    console.log(message);
    self.alert = null;
    self.message = message;
    self.refresh();
  };

  this.error = (message) => {
    self.alert = message;
    self.message = null;
    self.refresh();
  };

  this.clear = function() {
    self.message = null;
    self.alert = null;
    self.refresh();
  };

  this.showErrorOrSuccess = function(err) {
      self.message = err ? null : "Все чики-пики лимпопони, ма ныга!";
      self.alert = err;
      self.refresh();
  };

  this.refresh = function() {
    $timeout(function() {
        $rootScope.$apply();
    });
  }
}