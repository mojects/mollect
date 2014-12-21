function NodeRelations () {

    this.linkTags = function(callback) {
        var self = this;
        async.map(self.tags, self.linkTag, function(err, results){
            self.unlinkAbsentTags(results)
                .then(function(){callback();});
        });
    }

    this.linkTag = function (tag, callback) {
        var self = this;
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
        var deferred = $$q.defer();
        var where = "";

        if (presentTags.length>0) {
            var placeholders = Array(presentTags.length).join("?,") + "?";
            where = "AND NOT parent_id IN ("+placeholders+")";
        }
        presentTags.unshift(this.id)
        this.sql(
            "UPDATE links SET is_deleted=1, sync='new' " +
            "WHERE (SELECT category FROM nodes WHERE nodes.id=links.parent_id)='tag'" +
            " AND child_id=? "+where+" ;",
            presentTags
        ).then(function () {
                deferred.resolve();
            });

        return deferred.promise;
    }

    this.linkChild = function(child) {
        return $$q(function(resolve){
            var l = new Link();
            l.isTemp = this.isTemp;
            l.find_or_create_by({parent_id: this.id, child_id: child.id}, resolve);
        });
    }

    this.findLastCase = function(callback) {
        var self = this;
        this.db.query(
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


    this.fillParentTags = function(callback) {
        var self = this;
        this.db.query(
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
        newClass(NodesCollection, this.id)
            .getChildren("tag", callback);
    };

    this.getDirectChildren = function(callback) {
        newClass(NodesCollection, this.id)
            .getChildren(false, callback);
    };

    this.getParentTagReactions = function(callback) {
        this.sql(
            "SELECT DISTINCT reactions.* FROM links l "+
            "JOIN nodes parents ON (l.parent_id=parents.id) "+
            "JOIN links link_p ON (parents.id=link_p.parent_id) "+
            "JOIN nodes reactions ON (link_p.child_id=reactions.id) " +
            "WHERE l.is_deleted=0 AND parents.is_deleted=0 AND link_p.is_deleted=0 AND reactions.is_deleted=0 " +
            "AND parents.category='tag' AND l.child_id=? AND reactions.id!=?;",
            [this.id, this.id]
        ).then(function (reactions) {
                callback(null, reactions);
            });
    }

}