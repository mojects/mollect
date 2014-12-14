ang

    .service('Nodes', Nodes)
    .factory('Node', function($q, Link) {
        Node.prototype.$q = $q;
        Node.prototype.Link = Link;
        return Node;
    });

function Nodes($q, $rootScope, Node) {

    this.db = $.WebSQL('mollect');
    var indexNodes = [];

    this.getNodeWithDetails = function(nodeId) {
        var node = new Node(nodeId);
        node.name = "Loading...";

        async.parallel([
            node.fillDetails,
            node.fillParentTags
        ],function() {
            $rootScope.$apply();
        });

        return node;
    };

    this.tags = function() {
        var deferred = $q.defer();

        this.db.query(
            "SELECT name FROM nodes WHERE is_deleted=0 AND category='tag';"
        ).fail(dbErrorHandler)
            .done(function (tags) {
                /*var tags_array = [];
                 angular.forEach(tags, function(tag) {
                 this.push(String(tag.name));
                 }, tags_array);*/
                deferred.resolve(tags);
            });

        return deferred.promise;
    };

    this.insertNode = function(inputNode) {
        var node = new Node(null);
        node.setFields(inputNode);
        return node.save();
    };

    this.getIndexNodes = function() {
        console.log("getIndexNodes");
        indexNodes.length = 0;
        this.db.query(
            "SELECT * FROM nodes WHERE is_deleted=0 AND category='tag';"
        ).fail(dbErrorHandler)
            .done(function (nodes) {
                indexNodes.push.apply(indexNodes, nodes);
                $rootScope.$apply();
            });

        return indexNodes;
    };

};

/**
 * @class Node
 * @extends ActiveRecord
 **/
Node.prototype = new ActiveRecord();
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

    this.save = function() {
        var deferred = this.$q.defer();

        async.series([
            self.saveNode,
            self.linkTags
        ], function() {
            deferred.resolve(self.id);
        });

        return deferred.promise;
    };

    this.delete = function() {
        var deferred = this.$q.defer();

        self.sql(
            "UPDATE nodes SET is_deleted=1, sync='new' WHERE id=?;", self.id,
            "UPDATE links SET is_deleted=1, sync='new' WHERE parent_id=?;", self.id,
            "UPDATE links SET is_deleted=1, sync='new' WHERE child_id=?;", self.id
        ).done(function () {
                deferred.resolve();
            });

        return deferred.promise;
    }

    this.saveNode = function(callback) {
        self.update_or_create(
            { id: self.id, name: self.name, category: self.category, description: self.description },
            callback);
    }

    this.linkTags = function(callback) {
        async.map(self.tags, self.linkTag, function(err, results){
            self.unlinkAbsentTags(results)
                .then(function(){callback();});
        });
    }

    this.linkTag = function (tag, callback) {
        var tagRecord = newClass(Node);
        async.series([
            async.apply(tagRecord.find_or_create_by, {name: tag.name, category: "tag"}),
            function (callback2) {
                var l = newClass(Link);
                l.find_or_create_by(
                    {parent_id: tagRecord.id, child_id: self.id},
                    callback2);
            }
        ], function() {
            callback(null, tagRecord.id);
        });
    };

    this.unlinkAbsentTags = function(presentTags) {
        var deferred = this.$q.defer();
        var where = "";

        if (presentTags.length>0) {
            var placeholders = Array(presentTags.length).join("?,") + "?";
            where = "AND NOT parent_id IN ("+placeholders+")";
        }
        presentTags.unshift(self.id)
        self.sql(
            "UPDATE links SET is_deleted=1, sync='new' " +
            "WHERE (SELECT category FROM nodes WHERE nodes.id=links.parent_id)='tag'" +
            " AND child_id=? "+where+" ;",
            presentTags
        ).done(function () {
                deferred.resolve();
            });

        return deferred.promise;
    }

    this.linkChild = function(child) {
        var l = new Link();
        l.isTemp = this.isTemp;
        l.find_or_create_by({parent_id: this.id, child_id: child.id});
    }

    this.findLastCase = function(callback) {
        self.db.query(
            "SELECT max(id) id FROM nodes WHERE is_deleted=0 AND  category='case';"
        ).fail(dbErrorHandler)
            .done(function (nodes) {
                if (nodes[0].id != null) {
                    self.id = nodes[0].id;
                    callback(true);
                } else
                    callback(false);
            });

    };

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

    this.fillParentTags = function(callback) {
        self.db.query(
            "SELECT parents.* FROM links l "+
            "JOIN nodes parents ON (l.parent_id=parents.id) "+
            "WHERE l.is_deleted=0 AND parents.is_deleted=0 AND "+
                "parents.category='tag' AND l.child_id=?;", [self.id]
        ).fail(dbErrorHandler)
            .done(function (tags) {
                self.tags = tags;
                callback();
            });
    };

    this.getChildTags = function(callback) {
        self.getChildren("tag", callback);
    };

    this.getDirectChildren = function(callback) {
        self.getChildren(false, callback);
    };

    this.getChildren = function(type, callback) {
        var where = "";
        if (type)
            where += " AND children.category='"+type+"'";
        self.sql(
            "SELECT DISTINCT children.* "+
            "FROM links l "+
            "JOIN nodes children ON (l.child_id=children.id) "+
            "WHERE l.is_deleted=0 AND children.is_deleted=0 "+
                "AND l.parent_id=? "+where+";", self.id
        ).done(function (children) {
                callback(null, children);
            });
    }

    this.getParentTagReactions = function(callback) {
        self.sql(
            "SELECT DISTINCT reactions.* FROM links l "+
            "JOIN nodes parents ON (l.parent_id=parents.id) "+
            "JOIN links link_p ON (parents.id=link_p.parent_id) "+
            "JOIN nodes reactions ON (link_p.child_id=reactions.id) " +
            "WHERE l.is_deleted=0 AND parents.is_deleted=0 AND link_p.is_deleted=0 AND reactions.is_deleted=0 " +
                "AND parents.category='tag' AND l.child_id=? AND reactions.id!=?;",
            [self.id, self.id]
        ).done(function (reactions) {
                callback(null, reactions);
            });
    }
};
