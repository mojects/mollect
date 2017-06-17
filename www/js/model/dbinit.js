ang
    .service('sync', sync)
    .factory('dbInitializer', function (sync, settingsManager, desk) {
        var db = $.WebSQL('mollect');
        db.query(
            'CREATE TABLE IF NOT EXISTS ' +
            ' nodes (id VARCHAR(15) PRIMARY KEY, name VARCHAR, description TEXT, category VARCHAR(10),'+
            '  sync VARCHAR(10), is_deleted INT);',

            'CREATE TABLE IF NOT EXISTS ' +
            ' links (id VARCHAR(15) PRIMARY KEY, parent_id VARCHAR(15), child_id VARCHAR(15), weight INT,'+
            '  sync VARCHAR(10), is_deleted INT);',

            'CREATE TABLE IF NOT EXISTS ' +
            ' loops (parent_id VARCHAR(15), child_id VARCHAR(15), weight INT, depth INT,'+
            '  PRIMARY KEY (parent_id, child_id));',

            'CREATE TABLE IF NOT EXISTS settings (key VARCHAR, value VARCHAR);',

            'INSERT INTO settings (key, value) '+
            'SELECT "client_version", 1 '+
            'WHERE (SELECT count(0) FROM settings WHERE key="client_version")=0;',

            'INSERT INTO settings (key, value) '+
            'SELECT "client_code", null '+
            'WHERE (SELECT count(0) FROM settings WHERE key="client_code")=0;',

            'INSERT INTO settings (key, value) '+
            'SELECT "server", "http://mollect-server.herokuapp.com" '+
            'WHERE (SELECT count(0) FROM settings WHERE key="server")=0;'
        ).fail(function (tx, err) {
                throw new Error(err.message);
            }).done(function () {
                async.series([
                    settingsManager.getClientSettings,
                    sync.run,
                    desk.clear
                ]);
            });
        return true;
        /*
         To clean DB:
         DROP TABLE IF EXISTS nodes;
         DROP TABLE IF EXISTS links;
         DROP TABLE IF EXISTS  client_version
         */
    });

function sync($http, NodesFactory, settingsManager, desk) {
    var self = this;
    var db = $.WebSQL('mollect');
    this.nodes = null;
    this.links = null;
    this.run = function(callback) {
        // this.retrievePrerequisites();
        async.series([
            self.pingServer,
            self.retrievePrerequisites,
            self.sendRequestToServer,
            self.rebuildLoops
        ], function(err) {
            callback(err);
        });

    };
    this.rebuildLoops = (cb) => {
        desk.info('3/3 optimize data...');
        newClass(Loops).rebuildLoops(cb);
    };
    this.retrievePrerequisites = function(callback) {
        async.series([
                async.apply(self.retrieveEntriesForUpdate, "nodes"),
                async.apply(self.retrieveEntriesForUpdate, "links")
            ],
            function(err, results) {
                callback(err);
            });
    };
    this.pingServer = function(callback) {
        desk.info('1/3 ping server...');
        var req = {
            method: 'OPTIONS',
            url: settings.server+'/sync'
        };
        $http(req).success(function(data, status, headers, config){
            callback(null, true);
        }).error(function(data, status, headers, config){
            throw new Error(status);
        });
    };
    this.retrieveEntriesForUpdate = function(table, callback) {
        var db = $.WebSQL('mollect');
        db.query(
            "UPDATE "+table+" SET sync='sent' WHERE sync='new';",
            "SELECT * FROM "+table+" WHERE NOT sync IN ('original', 'new', 'temp');"
        ).fail(function (tx, err) {
                callback(err.message);
            }).done(function (rows) {
                self[table] = rows;
                callback(null, true);
            });
    };
    this.sendRequestToServer = function(callback) {
        desk.info('2/3 sync data...');
        var req = {
            method: 'POST',
            url: settings.server+'/sync.json',
            data: self.buildDataForServer()
        };

        $http(req).success(function(data, status, headers, config){
            self.processServerAnswer(callback, data);
        }).error(function(data, status, headers, config){
            throw new Error(status);
        });
    };
    this.processServerAnswer = function(callback, data) {

        // Check for possible conflicts on local storage
        // ToDO:
        // Те записи, что успели стать new, убираем из очереди обновления и


        if (data.client_code)
            settingsManager.setClientSetting("client_code", data.client_code);

        // Transform to array which SQL will like
        var nodes = [];
        data.nodes.forEach(
            function(node) {
                nodes.push([node.id, node.name, node.description, node.category, to01(node.is_deleted)]);
            }
        );
        // Update nodes in local storage
        if (nodes.length > 0)
        db.query(
            "INSERT OR REPLACE INTO nodes (id, name, description, category, is_deleted, sync) " +
            "VALUES (?, ?, ?, ?, ?, 'original')",
            nodes
        ).fail(function (tx, err) {
                throw new Error(err.message);
            }).done(function (version) {
                return true;
            });


        // Transform to array which SQL will like
        var links = [];
        data.links.forEach(
            function(link) {
                links.push([link.id, link.parent_id, link.child_id, link.weight, to01(link.is_deleted)]);
            }
        );
        // Update nodes in local storage
        if (links.length > 0)
        db.query(
            "INSERT OR REPLACE INTO links (id, parent_id, child_id, weight, is_deleted, sync) " +
            "VALUES (?, ?, ?, ?, ?, 'original')",
            links
        ).fail(function (tx, err) {
                throw new Error(err.message);
            }).done(function (version) {
                NodesFactory.getIndexNodes();
                callback();
            });
    };
    this.buildDataForServer = function() {
        var data = {};
        data.client_version = settings.client_version;
        data.client_code = settings.client_code;
        data.nodes = this.nodes;
        data.links = this.links;
        return data;
    };

    this.cleanLocal = function(callback) {
        db.query(
            "drop table nodes;",
            "drop table links;"
        ).fail(function (tx, err) {
                callback(err.message);
            }).done(function () {
                callback();
            });
    }



}
