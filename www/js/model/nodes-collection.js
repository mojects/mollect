NodesCollection.prototype = new ActiveRecord();
function NodesCollection(ids) {

    var self = this;
    this.include_ids = ids;
    this.exclude_ids = [];
    this.resultNodes = [];

    this.getChildren = function(type, callback) {
        
        var where = "";
        if (typeof self.include_ids != "Array") self.include_ids = [self.include_ids];

        if (type)
            where += " AND children.category='"+type+"'";
        if (self.exclude_ids.length > 0)
            where += " AND exclude_ids IN ("+self.getPlaceholdersFor(self.exclude_ids)+")";

        self.sql(
            "SELECT DISTINCT children.* "+
            "FROM links l "+
            "JOIN nodes children ON (l.child_id=children.id) "+
            "WHERE l.is_deleted=0 AND children.is_deleted=0 "+
            "AND l.parent_id IN ("+self.getPlaceholdersFor(self.include_ids)+") "+
                " "+where+";", self.include_ids.concat(self.exclude_ids)
        ).then(function (children) {
                callback(null, children);
            });
    }

    this.getPlaceholdersFor = function(arr) {
          return (new Array(arr.length)).join("?,") + "?";
    }

    this.getChildrenRecursive = function(callback) {
        self.walkDeeper(self.include_ids, function(){
            callback(self.resultNodes);
        })
    }

    this.walkDeeper = function(parent_ids, callback) {
        var c = newClass(NodesCollection, parent_ids);
        c.exclude_ids = self.exclude_ids;
        c.getChildren(false, function(nodes) {
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

    this.removeNonObstacles = function() {
        return $$q(function(resolve){
            self.sql(
                "SELECT DISTINCT * "+
                "FROM links "+
                "WHERE is_deleted=0 AND parent_id='obstacle' "+
                "AND child_id IN ("+self.getPlaceholdersFor(self.include_ids)+");", self.include_ids
            ).then(function (rows) {
                    rows.forEach(function(row) {
                        self.include_ids.remove(row.id);
                    });
                    resolve(self.include_ids);
                });
        });
    }
}