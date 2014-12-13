ang
    .service('sync', sync)

    .factory('dbInitializer', function (sync, host) {
        log(host);
        var db = $.WebSQL('mollect');
        db.query(
            'CREATE TABLE IF NOT EXISTS ' +
            'nodes (id VARCHAR(15) PRIMARY KEY, name VARCHAR, description TEXT, category VARCHAR(10),'+
            'sync VARCHAR(10), is_deleted INT);',

            'CREATE TABLE IF NOT EXISTS ' +
            'links (id VARCHAR(15) PRIMARY KEY, parent_id VARCHAR(15), child_id VARCHAR(15), weight INT,'+
            'sync VARCHAR(10), is_deleted INT);',

            'CREATE TABLE IF NOT EXISTS settings (key VARCHAR, value VARCHAR);',

            'INSERT INTO settings (key, value) '+
            'SELECT "client_version", 1 '+
            'WHERE (SELECT count(0) FROM settings WHERE key="client_version")=0;',

            'INSERT INTO settings (key, value) '+
            'SELECT "client_code", null '+
            'WHERE (SELECT count(0) FROM settings WHERE key="client_code")=0;'
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

function sync($http, host, Nodes, settingsManager) {
    var self = this;
    var db = $.WebSQL('mollect');
    this.nodes = null;
    this.links = null;
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
                async.apply(self.retrieveEntriesForUpdate, "nodes"),
                async.apply(self.retrieveEntriesForUpdate, "links"),
                settingsManager.getClientSettings
            ],
            function(err, results) {
                callback(null, true);
            });
    }
    this.pingServer = function(callback) {
        var req = {
            method: 'OPTIONS',
            url: host+'/sync'
        }
        $http(req).success(function(data, status, headers, config){
            callback(null, true);
        }).error(function(data, status, headers, config){
            throw new Error(status);
        });
    }
    this.retrieveEntriesForUpdate = function(table, callback) {
        var db = $.WebSQL('mollect');
        db.query(
            "UPDATE "+table+" SET sync='sent' WHERE sync='new';",
            "SELECT * FROM "+table+" WHERE NOT sync IN ('original', 'new', 'temp');"
        ).fail(function (tx, err) {
                throw new Error(err.message);
            }).done(function (rows) {
                self[table] = rows;
                callback(null, true);
            });
    }
    this.sendRequestToServer = function(callback) {
        var req = {
            method: 'POST',
            url: host+'/sync.json',
            data: self.buildDataForServer()
        }

        $http(req).success(function(data, status, headers, config){
            self.processServerAnswer(callback, data);
        }).error(function(data, status, headers, config){
            throw new Error(status);
        });
    }
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
                nodes.push([node.id, node.name, node.description, node.category]);
            }
        );
        // Update nodes in local storage
        if (nodes.length > 0)
        db.query(
            "INSERT OR REPLACE INTO nodes (id, name, description, category, sync, is_deleted) " +
            "VALUES (?, ?, ?, ?, 'original', 0)",
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
                links.push([link.id, link.parent_id, link.child_id, link.child_id]);
            }
        );
        // Update nodes in local storage
        if (links.length > 0)
        db.query(
            "INSERT OR REPLACE INTO links (id, parent_id, child_id, weight, sync, is_deleted) " +
            "VALUES (?, ?, ?, ?, 'original', 0)",
            links
        ).fail(function (tx, err) {
                throw new Error(err.message);
            }).done(function (version) {
                Nodes.getIndexNodes();
                return true;
            });
    }
    this.buildDataForServer = function() {
        var data = {};
        data.client_version = settings.client_version;
        data.client_code = settings.client_code;
        data.nodes = this.nodes;
        data.links = this.links;
        return data;
    }

}