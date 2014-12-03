angular.module('mollect')

    .service('Nodes', Nodes)

function Nodes($q) {

    var db = $.WebSQL('mollect');

    this.insertNode = function(node, callback) {
        db.query(
            "INSERT INTO nodes (name, category, description ,sync) "+
            "VALUES (?,?,?,'new');",
            [node.name, node.category, node.description ]
        ).fail(function (tx, err) {
                callback(err.message);
            }).done(function (result) {
                alert('Returned ID: ' + result.insertId);
            });
    }

    this.getWithDetails = function(nodeId) {
        var deferred = $q.defer();

        db.query(
            "SELECT * FROM nodes;"
        ).fail(function (tx, err) {
                deferred.reject(err.message);
            }).done(function (nodes) {
                deferred.resolve(nodes);
            });

        return deferred.promise;
    }

    this.getIndexNodes = function() {
        var resultNodes = [];

        db.query(
            "SELECT * FROM nodes;"
        ).fail(function (tx, err) {
                throw new Error(err.message);
            }).done(function (nodes) {
                // resultNodes = nodes;
                resultNodes.push.apply(resultNodes, nodes)
            });

        return resultNodes;
    }
}