NodesCollection.prototype = new ActiveRecord();
function NodesCollection(node_ids) {

    var self = this;
    this.node_ids = node_ids;
    this.resultNodes = [];

    this.getChildren = function(type, callback) {
        var where = "";
        if (typeof self.node_ids != "Array") self.node_ids = [self.node_ids];

        var placeholders = (new Array(self.node_ids.length)).join("?,") + "?";

        if (type)
            where += " AND children.category='"+type+"'";
        self.sql(
            "SELECT DISTINCT children.* "+
            "FROM links l "+
            "JOIN nodes children ON (l.child_id=children.id) "+
            "WHERE l.is_deleted=0 AND children.is_deleted=0 "+
            "AND l.parent_id IN ("+placeholders+") "+where+";", self.node_ids
        ).then(function (children) {
                callback(null, children);
            });
    }

    this.getChildrenRecursive = function(callback) {
        self.walkDeeper(self.node_ids, function(){
            callback(self.resultNodes);
        })
    }

    this.walkDeeper = function(parent_ids, callback) {
        newClass(NodesCollection, parent_ids)
            .getChildren(false, function(nodes) {
                var search_for_ids = [];
                // Remove children, which already in our array
                nodes.forEach(function(n, key) {
                    if (self.resultNodes.indexOf(n) != -1) {
                        nodes.splice(key, 1);
                    } else {
                        search_for_ids.push(n.id);
                    }
                });

                if (search_for_ids.length >0) {
                    self.resultNodes.merge(nodes);
                    self.walkDeeper(search_for_ids, callback);
                } else {
                    callback();
                }
            });

    }
}