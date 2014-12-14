ang

.controller('ConfigCtrl', function($scope, $rootScope, settingsManager, sync) {

        if(!settings.client_code) {
            $scope.alert = "Settings is not initialized";
            return;
        }

    $scope.servers  = {
          local: 'http://mollect-server:3001',
          staging: 'http://mollect-server.herokuapp.com',
          prod:'http://mollect-prod.herokuapp.com'
      };


    $scope.code =         settings.client_code  ;
    $scope.server =         settings.server  ;
    $scope.isInitialized = $scope.server && $scope.code;

    $scope.save = function() {
        $scope.info = "";
        $scope.alert = "";

        settingsManager.setClientSetting("client_code", $scope.code);
        settingsManager.setClientSetting("server", $scope.server);

        $scope.info = "Saved!";
    };

    $scope.cleanLocal = function() {
        $scope.info = "";
        $scope.alert = "";

        sync.cleanLocal(function(err){
           if (err)
               $scope.alert = err;
            else
               $scope.info = "Теперь ты чист как жьопа младенца!";
            $rootScope.$apply();
        });
    }

})