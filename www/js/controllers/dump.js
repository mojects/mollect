angular.module('mollect')

    .controller('DumpCtrl', function($scope, $rootScope) {

        $scope.dump = {}

        var db = $.WebSQL('mollect');

        async.parallel([
            async.apply(getTable, "nodes"),
            async.apply(getTable, "links"),
            async.apply(getTable, "settings")
        ], function() {
            $rootScope.$apply();
        });

        function getTable(table, callback) {
            db.query("SELECT * FROM "+table+";")
                .done(function (result) {
                    $scope.dump[table] = result;
                    callback()
                });
        }

    });