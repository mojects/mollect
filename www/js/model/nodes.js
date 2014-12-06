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

    this.insertNode = function(inputNode) {
        var node = new Node(null);
        node.setFields(inputNode);
        return node.save();
    };

    this.getIndexNodes = function() {
        console.log("getIndexNodes");
        indexNodes.length = 0;
        this.db.query(
            "SELECT * FROM nodes;"
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
        self.name = node.name;
        self.category = node.category;
        self.description = node.description;
        self.tags = node.tags;
    };

    this.save = function() {
        var deferred = this.$q.defer();

        async.series([
            self.saveNode,
            self.linkTags
        ], function() {
            deferred.resolve();
        });

        return deferred.promise;
    };

    this.saveNode = function(callback) {
        self.db.query(
            "INSERT INTO nodes (name, category, description ,sync) "+
            "VALUES (?,?,?,'new');",
            [self.name, self.category, self.description ]
        ).fail(dbErrorHandler)
            .done(function (result) {
                self.id = result.insertId;
                callback();
            });

    }

    this.linkTags = function(callback) {
        self.tags.forEach(function (tag) {
            var tagRecord = newClass(Node);
            async.series([
                async.apply(tagRecord.find_or_create_by, {name: tag, category: "tag"}),
                function (callback2) {
                    var l = new Link();
                    l.find_or_create_by.call( l,
                        {parent_id: tagRecord.id, child_id: self.id},
                        callback2);
                }
            ], function() {
                console.log("id:"+self.id);
                callback();
            });
        });
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
            "WHERE parents.category='tag' AND l.child_id=?;", [self.id]
        ).fail(dbErrorHandler)
            .done(function (tags) {
                self.tags = tags;
                callback();
            });
    }

    this.getRelatedNodes = function() {
        async.parallel([
                self.getDirectChildren,
                self.getParentTagReactions
            ],
            function () {

            });

    }

    this.getDirectChildren = function(callback) {
        self.db.query(
            "SELECT children.* "+
            "FROM links l "+
            "JOIN nodes children ON (l.children_id=children.id) "+
            "WHERE l.parent_id=?;", self.nodeId
        ).fail(dbErrorHandler)
            .done(function (children) {
                callback(null, children);
            });
    }

    this.getParentTagReactions = function(callback) {
        self.db.query(
            "SELECT ractions.* FROM links l "+
            "JOIN nodes parents ON (l.parent_id=parents.id) "+
            "JOIN links parent_clinks ON (parents.id=parent_clinks.parent_id) "+
            "WHERE parents.category='tag' AND l.child_id=?;", nodeId
        ).fail(dbErrorHandler)
            .done(function (reactions) {
                callback(null, reactions);
            });
    }
};

