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
extend(Node, NodeRelations);

var n = newClass(Node);
console.log("BoooOOO:", n.linkTags);
console.log("Booo111:", n.sqlSafe);

function Node (nodeId) {
    this.table = "nodes";
    this.id = nodeId;
    this.tags = [];
    this.rating = null;

    var self = this;

    this.setFields = function(node) {
        self.id = node.id;
        self.name = node.name;
        self.category = node.category;
        self.description = node.description || "";
        self.tags = node.tags;
    };

    this.rate = function(rate) {

        newClass(Link).create({child_id: self.id,
                parent_id: self.Constants.scores,
                weigth: rate},
            getAvgRate);

        function getAvgRate() {
            self.sql(
                "SELECT avg(weight) avgRate FROM links " +
                "WHERE child_id=? AND parent_id=?;",
                [self.id, self.Constants.scores]
            ).then(function (rows) {
                    setAvgScore(rows[0].avgRate);
                });
        }

        function setAvgScore(value) {
            self.rating = value;
            var link = newClass(Link);
            link.find_or_create_by(
                {child_id: self.id, parent_id: self.Constants.avg_score},
                function() {
                    link.weight = value;
                }

            )
        }
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
            "SELECT n.*, l.weight rating " +
            "FROM nodes n LEFT JOIN links l ON (n.id=l.child_id)" +
            "WHERE n.id=? AND l.parent_id=?;", [self.id, Constants.avg_score]
        ).fail(dbErrorHandler)
            .done(function (nodes) {
                var node = nodes[0];
                self.name = node.name;
                self.category = node.category;
                self.description = node.description;
                self.rating = node.rating;
                callback();
            });
    }

};
