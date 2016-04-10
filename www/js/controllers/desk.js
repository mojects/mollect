ang

.controller('DeskCtrl', function($scope, $rootScope, desk) {

        $scope.desk = desk;

        $rootScope.$on('$locationChangeSuccess', function () {
            desk.clean();
        });

        /*

    $scope.showErrorOrSuccess = function(err) {
        $scope.info = err || "Все четко как чичотка!";
        $scope.alert = err || "";
    };    */

})

.service("desk", desk);


function desk($rootScope, $timeout) {
    var self = this;
    this.info = null;
    this.alert = null;

    this.clean = function() {
        self.info = null;
        self.alert = null;
    };

    this.showErrorOrSuccess = function(err) {
        self.info = err ? "" : "Все четко как чичотка!";
        self.alert = err || "";
        self.refresh();
    };

    this.refresh = function() {
        $timeout(function() {
            $rootScope.$apply();
        });
    }
}