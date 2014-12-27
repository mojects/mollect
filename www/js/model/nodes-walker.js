NodesWalker.prototype = new ActiveRecord();
function NodesWalker(ids) {

    var self = this;
    this.include_ids = ids || [];
    this.exclude_ids = [];
    this.containsString = "";
    this.searchInDescription = false;
    this.category = "all";
    this.resultNodes = [];

    this.getChildren = function(callback) {

        var args = [];
        if (typeof self.include_ids != "object") self.include_ids = [self.include_ids];

        var sql = "SELECT children.* " +
            "FROM nodes children ";

        if (self.include_ids.length > 0) {
            sql += "JOIN links l ON " +
            "   (l.child_id=children.id AND l.is_deleted=0 AND l.parent_id IN (" + self.getPlaceholdersFor(self.include_ids) + ")) ";
            args.merge(self.include_ids);
        }

        if (self.exclude_ids.length > 0) {
            sql += "LEFT JOIN links negative ON " +
            "   (negative.child_id=children.id AND negative.is_deleted=0 " +
            "    AND negative.parent_id IN (" + self.getPlaceholdersFor(self.exclude_ids) + ")) ";
            args.merge(self.exclude_ids);
        }

        sql += "WHERE  children.is_deleted=0 ";

        if (self.containsString) {
            var needle = "%"+self.containsString+"%";
            if (self.searchInDescription) {
                sql += "AND (children.name LIKE ? OR children.description LIKE ?) ";
                args.merge([needle, needle]);
            } else {
                sql += "AND (children.name LIKE ?) ";
                args.push(needle);
            }

        }

        if (self.category != "all") sql += " AND children.category='"+self.category+"' ";
        else  sql += " AND children.category IN ('tag', 'thing') ";

        sql += "GROUP BY children.id ";

        if (self.exclude_ids.length > 0)
            sql += "HAVING  MIN(negative.child_id IS NULL)=1 "

        self.sql(sql, args).then(function (children) {
                callback(null, children);
            });
    }

    this.getPlaceholdersFor = function(arr) {
        if (arr.length == 0) return "";
          return (new Array(arr.length)).join("?,") + "?";
    }

    this.getChildrenRecursive = function(callback) {
        self.walkDeeper(self.include_ids, function(){
            callback(self.resultNodes);
        })
    }

    this.walkDeeper = function(parent_ids, callback) {
        var c = newClass(NodesWalker, parent_ids);
        c.exclude_ids = self.exclude_ids;
        c.containsString = self.containsString;
        c.searchInDescription = self.searchInDescription;
        c.category = self.category;
        c.getChildren(function(err, nodes) {
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

    this.leaveOnlyObstacles = function() {
        return $$q(function(resolve){
            self.sql(
                "SELECT DISTINCT * "+
                "FROM links "+
                "WHERE is_deleted=0 AND parent_id='obstacles' "+
                "AND child_id IN ("+self.getPlaceholdersFor(self.include_ids)+");", self.include_ids
            ).then(function (rows) {
                    self.include_ids = []
                    rows.forEach(function(row) {
                        self.include_ids.push(row.child_id);
                    });
                    resolve(self.include_ids);
                });
        });
    }
}