NodesWalker.prototype = new ActiveRecord();
function NodesWalker(ids) {

    var self = this;
    this.include_ids = ids || [];
    this.exclude_ids = [];
    this.containsString = "";
    this.searchInDescription = false;
    this.category = "all";
    this.depth = 1;

    this.getChildren = function(callback) {

        var args = [];
        if (typeof self.include_ids != "object" && typeof self.include_ids != 'undefined')
            self.include_ids = [self.include_ids];

        var sql = "SELECT children.* " +
            "FROM nodes children ";

        if (self.include_ids && self.include_ids.length > 0) {
            sql += "JOIN loops l ON " +
            "   (l.child_id=children.id " +
            "    AND l.parent_id IN (" + $$db.placeholdersFor(self.include_ids) + ") AND l.depth<="+self.depth+" ) ";
            args.merge(self.include_ids);
        }

        if (self.exclude_ids.length > 0) {
            sql += "LEFT JOIN loops negative ON " +
            "   (negative.child_id=children.id " +
            "    AND negative.parent_id IN (" + $$db.placeholdersFor(self.exclude_ids) + ")  AND negative.depth<="+self.depth+" ) ";
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
            sql += "HAVING  MIN(negative.child_id IS NULL)=1 ";

        self.sql(sql, args).then(function (children) {
                callback(null, children);
            });
    };

    this.leaveOnlyObstacles = function() {
        return self.sql(
                "SELECT DISTINCT child_id "+
                "FROM loops "+
                "WHERE parent_id='obstacles' "+
                "AND child_id IN ("+$$db.placeholdersFor(self.include_ids)+");", self.include_ids
            ).then(function (rows) {
                self.include_ids = [];
                rows.forEach(function(row) {
                    self.include_ids.push(row.child_id);
                });
                return self.include_ids;
            });
    }




}