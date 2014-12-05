
angular.module('mollect')

    .service('Nodes', Nodes)

function Nodes($q) {

    var db = $.WebSQL('mollect');
    var self = this;

    this.insertNode = function(node, callback) {
        db.query(
            "INSERT INTO nodes (name, category, description ,sync) "+
            "VALUES (?,?,?,'new');",
            [node.name, node.category, node.description ]
        ).fail(function (tx, err) {
                callback(err.message);
            }).done(function (result) {
                seld.linkTags(result.insertId, node.tags);
            });
    }

    this.linkTags = function(nodeId, tags) {
        //
    }

    this.getNodeWithDetails = function(nodeId) {
        var resultNode = {};
        db.query(
            "SELECT * FROM nodes WHERE id=?;", nodeId
        ).fail(function (tx, err) {
                throw new Error(err.message);
            }).done(function (node) {
                resultNode.id = node.id;
                resultNode.name = node.name;
                resultNode.category = node.category;
                resultNode.description = node.description;
                resultNode.tags = self.getParentTags(nodeId);
            });

        return resultNode;
    }

    this.getParentTags = function(nodeId) {
        var resultTags = {};

        db.query(
            "SELECT parents.* FROM links l "+
            "JOIN nodes parents USING (l.parent_id=parents.id) "+
            "WHERE parents.category='tag' AND l.child_id=?;", nodeId
        ).fail(function (tx, err) {
                throw new Error(err.message);
            }).done(function (tags) {
                resultTags.push.apply(resultTags, tags);
            });

        return resultTags;
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

};

function Node(nodeId) {

    var id = nodeId;
    var db = $.WebSQL('mollect');
    var self = this;

    this.getRelatedNodes = function() {
        async.parallel([
                self.getDirectChildren,
                self.getParentTagReactions
            ],
            function () {

            });

    }

    this.getDirectChildren = function(callback) {
        db.query(
            "SELECT children.* "+
            "FROM links l "+
            "JOIN nodes children USING (l.children_id=children.id) "+
            "WHERE l.parent_id=?;", self.nodeId
        ).fail(function (tx, err) {
                throw new Error(err.message);
            }).done(function (children) {
                callback(null, children);
            });
    }

    this.getParentTagReactions = function(callback) {
        db.query(
            "SELECT ractions.* FROM links l "+
            "JOIN nodes parents USING (l.parent_id=parents.id) "+
            "JOIN links parent_clinks USING (parents.id=parent_clinks.parent_id) "+
              "WHERE parents.category='tag' AND l.child_id=?;", nodeId
        ).fail(function (tx, err) {
            throw new Error(err.message);
        }).done(function (reactions) {
            callback(null, reactions);
        });
    }


}
