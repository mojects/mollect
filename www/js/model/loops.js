var walkedNodes = [];

Loops.prototype = new ActiveRecord();
function Loops() {

    var self = this;

    this.rebuildLoops = function(callback) {
        return self.cleanLoops()
            .then(self.getTopNodeIds)
            .then(self.walkDeeper)
            .then(function(){
                // Clean RAM
                walkedNodes = [];
                callback();
            });
    };

    this.cleanLoops = function() {
        return self.sql("DELETE FROM loops");
    }

    this.getTopNodeIds = function() {
        return $$q(function(resolve){
            self.sql(
                "SELECT n.id "+
                "FROM nodes n LEFT JOIN links l (n.id=l.child_id AND l.is_deleted=0) "+
                "WHERE n.is_deleted=0 AND parent_id IS NULL AND n.category IN ('tag', 'thing') "
            ).then(function (rows) {
                    var ids = []
                    rows.forEach(function(row) {
                        ids.push(row.id);
                    });
                    resolve(ids);
                });
        });
    }

    this.walkDeeper = function(parent_ids) {
        return $$q(function(resolve) {
            self.getChildren(parent_ids)
                .then(processChildren);

            function processChildren(children) {
                var loops = [], children_ids = [];
                // Remove children, which already in our array
                children.forEach(function (n) {
                    if (walkedNodes.indexOf(n.child_id) == -1) {
                        // child_id, parent_id, weight, depth
                        loops.push([n.child_id, n.parent_id, 0, 1]);
                        walkedNodes.push(n.child_id);
                        children_ids.push(n.child_id);
                    }
                });
                if (loops.length > 0) {
                    self.addLoops(loops, children_ids)
                        .then(self.copyParents)
                        .then(self.walkDeeper);
                } else {
                    resolve();
                }
            }
        });

    }

    this.addLoops = function(loops, children_ids) {
        return $$q(function(resolve) {
            var sql = "INSERT INTO loops (child_id, parent_id, weight, depth) " +
                "VALUES (?, ?, ?, ?)";
            self.sql(sql, loops).then(function () {
                resolve(children_ids);
            });
        });
    }

    this.copyParents = function(children_ids) {
        return $$q(function(resolve) {
            var sql = "INSERT INTO loops (child_id, parent_id, weight, depth) " +
                "SELECT c.child_id, p.parent_id, p.weight, p.depth+1 " +
                "FROM loops c JOIN loops p ON (c.parent_id=p.child_id) " +
                "WHERE c.child_id IN ("+self.getPlaceholdersFor(children_ids)+")";
            self.sql(sql, children_ids).then(function () {
                resolve(children_ids);
            });
        });
    }

    this.getChildren = function(parent_ids) {
        var sql = "SELECT l.child_id, l.parent_id " +
            "FROM nodes children " +
            "  JOIN links l ON " +
            "   (l.child_id=children.id AND l.is_deleted=0 " +
            "    AND l.parent_id IN (" + self.getPlaceholdersFor(self.include_ids) + ")) " +
            "WHERE  children.is_deleted=0 AND children.category IN ('tag', 'thing') " +
            "GROUP BY children.id ";

         return self.sql(sql, parent_ids);
    }


}