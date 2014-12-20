ang

    .factory('Node', function(Link, Constants) {
        Node.prototype.Link = Link;
        Node.prototype.Constants = Constants;
        return Node;
    });


/**
 * @class Node
 * @extends ActiveRecord
 **/
Node.prototype = new ActiveRecord();
angular.extend(Node, NodeRelations);

function Node (nodeId) {
    this.table = "nodes";
    this.id = nodeId;
    this.tags = [];

    var self = this;

    this.setFields = function(node) {
        self.id = node.id;
        self.name = node.name;
        self.category = node.category;
        self.description = node.description || "";
        self.tags = node.tags;
    };

    this.rate = function(rate, callback) {
        self.create({child_id: self.id,
                parent_id: self.Constants.scores,
                weigth: rate},
            callback);
    }

    this.save = function() {
        var deferred = $$q.defer();

        async.series([
            self.saveNode,
            self.linkTags
        ], function() {
            deferred.resolve(self.id);
        });

        return deferred.promise;
    };

    this.delete = function() {
        var deferred = $$q.defer();

        self.sql(
            "UPDATE nodes SET is_deleted=1, sync='new' WHERE id=?;", self.id,
            "UPDATE links SET is_deleted=1, sync='new' WHERE parent_id=?;", self.id,
            "UPDATE links SET is_deleted=1, sync='new' WHERE child_id=?;", self.id
        ).then(function () {
                deferred.resolve();
            });

        return deferred.promise;
    }

    this.saveNode = function(callback) {
        self.update_or_create(
            { id: self.id, name: self.name, category: self.category, description: self.description },
            callback);
    }

    this.getName = function(callback) {
        if (self.name) {
            callback(self.name);
        } else {
            self.fillDetails(function() {
                callback(self.name);
            });
        }
    }

    this.fillDetails = function(callback) {
        self.db.query(
            "SELECT * FROM nodes WHERE id=?;", [self.id]
        ).fail(dbErrorHandler)
            .done(function (nodes) {
                var node = nodes[0];
                self.name = node.name;
                self.category = node.category;
                self.description = node.description;
                callback();
            });
    }

};
