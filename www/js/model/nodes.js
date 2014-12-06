ang

   .service('Nodes', Nodes)
   .factory('Node', function($q) { Node.prototype.$q = $q; return Node; });

function Nodes($q, $rootScope, Node) {

    var db = $.WebSQL('mollect');
    var self = this;
    var test = "popa"+Math.ceil(Math.random()*100);

    this.test = function() {
        return test;
    }

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
        var deferred = $q.defer();

        db.query(
            "SELECT * FROM nodes;"
        ).fail(dbErrorHandler)
            .done(function (nodes) {
                deferred.resolve(nodes);
            });

        return deferred.promise;
    };

};

/**
 * @class Node
 * @extends ActiveRecord
 **/
var Node = speculoos.Class({
    extends : ActiveRecord,
    constructor: function Node (nodeId) {
        this.table = "nodes";
        this.id = nodeId;
        this.tags = [];
        this.db = $.WebSQL('mollect');
    },

    setFields: function (node) {
        this.name = node.name;
        this.category = node.category;
        this.description = node.description;
        this.tags = node.tags;
    },

    save: function () {
        var deferred = this.$q.defer();

        async.series([
            this.saveNode.bind(this),
            this.linkTags.bind(this)
        ], function () {
            deferred.resolve();
        });

        return deferred.promise;
    },

    saveNode: function (callback) {
        this.db.query(
            "INSERT INTO nodes (name, category, description ,sync) " +
            "VALUES (?,?,?,'new');",
            [this.name, this.category, this.description]
        ).fail(dbErrorHandler)
            .done(function (result) {
                this.id = result.insertId;
                callback();
            });

    },

    linkTags: function (callback) {
        this.tags.forEach(function (tag) {
            async.waterfall([
                async.apply(Node.super.find_or_create_by.bind(this), {name: tag, category: "tag"}),
                function (node, callback) {
                    Link.find_or_create_by(
                        {parent_id: node.id, child_id: self.id},
                        callback);
                }
            ]);
        });
    }
});

function Node2 (nodeId) {
    this.fillDetails = function(callback) {
        self.db.query(
            "SELECT * FROM nodes WHERE id=?;", [self.id]
        ).fail(dbErrorHandler)
            .done(function (nodes) {
                var node = nodes[0];
                self.name = node.name;
                slef.category = node.category;
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

var n = new Node();
n.test();
