function sync($http) {
    var self = this;
    this.nodes = null;
    this.links = null;
    this.clientVersion = null;
    this.run = function() {
        // this.retrievePrerequisites();
        async.series([
            this.pingServer,
            this.retrievePrerequisites,
            this.sendRequestToServer
        ]);

    }
    this.retrievePrerequisites = function(callback) {
        async.series([
            self.selectNodes,
            self.getClientVersion
        ],
        function(err, results) {
            callback(null, true);
        });
    }
    this.pingServer = function(callback) {
        var req = {
            method: 'OPTIONS',
            url: 'http://mollect-server:3001/sync'
        }
        $http(req).success(function(data, status, headers, config){
            callback(null, true);
        }).error(function(data, status, headers, config){
            throw new Error(status);
        });
    }
    this.selectNodes = function(callback) {
        var db = $.WebSQL('mollect');
        db.query(
            "UPDATE nodes SET sync='sent' WHERE sync='new';",
            "SELECT * FROM nodes WHERE NOT sync IN ('ok', 'new');"
        ).fail(function (tx, err) {
            throw new Error(err.message);
        }).done(function (nodes) {
            self.nodes = nodes;
            callback(null, true);
        });
    }
    this.sendRequestToServer = function(callback) {
        var req = {
            method: 'POST',
            url: 'http://mollect-server:3001/sync.json',
            data: self.buildDataForServer()
        }

        $http(req).success(function(data, status, headers, config){
            // alert('got the point!');
            self.processServerAnswer(callback, data);
        }).error(function(data, status, headers, config){
            throw new Error(status);
        });
    }
    this.processServerAnswer = function(callback, data) {
        var nodes = [];
        data.nodes.forEach(
            function(node) {
                nodes.push([node.id, node.name, node.description, node.category]);
            }
        );
        var db = $.WebSQL('mollect');
        db.query(
            "INSERT OR REPLACE INTO nodes (id, name, description, category, sync, is_deleted) " +
            "VALUES (?, ?, ?, ?, 'original', 0)",
            nodes
        ).fail(function (tx, err) {
            throw new Error(err.message);
        }).done(function (version) {
            return true;
        });
    }
    this.buildDataForServer = function() {
        var data = {};
        data.client_version = this.clientVersion;
        data.nodes = this.nodes;
        data.links = this.links;
        return data;
    }
    this.getClientVersion = function(callback) {
        var db = $.WebSQL('mollect');
        db.query(
            "SELECT version FROM client_version;"
        ).fail(function (tx, err) {
                throw new Error(err.message);
            }).done(function (version) {
                self.clientVersion = version[0].version
                callback(null, true);
            });
    }
    this.setClientVersion = function(version) {
        var db = $.WebSQL('mollect');
        db.query(
            "UPDATE client_version SET version="+version+";"
        ).fail(function (tx, err) {
            throw new Error(err.message);
        }).done(function (version) {
            return true;
        });
    }
}

angular.module('mollect')

    .service('sync', sync)

    .factory('dbInitializer', function (sync) {
        var db = $.WebSQL('mollect');
        db.query(
            'CREATE TABLE IF NOT EXISTS ' +
            'nodes (id INTEGER PRIMARY KEY, name VARCHAR, description TEXT, category VARCHAR(10),'+
            'sync VARCHAR(10), is_deleted INT);',

            'CREATE TABLE IF NOT EXISTS ' +
            'links (id INTEGER PRIMARY KEY, parent_id INT, child_id INT, weight INT,'+
            'sync VARCHAR(10), is_deleted INT);',

            'CREATE TABLE IF NOT EXISTS client_version (version INT);',

            'INSERT INTO client_version (version) '+
            'SELECT 1 FROM (SELECT 1) s WHERE (SELECT count(0) FROM client_version)=0;'
        ).fail(function (tx, err) {
                throw new Error(err.message);
            }).done(function (products) {
                 sync.run();
            });
        return true;
        /*
         To clean DB:
         DROP TABLE IF EXISTS nodes;
         DROP TABLE IF EXISTS links;
         DROP TABLE IF EXISTS  client_version
         */
    })
