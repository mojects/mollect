ang.service('nodes',
function ($q, $rootScope, Node) {

    var self = this;
    this.indexNodes = {};

    this.getNodeWithDetails = function(nodeId) {

      return $q((resolve, reject) => {
        var node = newClass(Node, nodeId);

        async.parallel([
          node.fillDetails,
          node.fillParentTags
        ], function (err) {
          if (err) reject(err)
          else resolve(node)
        })
      })

    }

    this.byIds = (ids) => {
      if (ids.constructor != Array) ids = [ids];
      var query =
        `SELECT id, name FROM nodes
          WHERE is_deleted=0 AND id IN (${$$db.placeholdersFor(ids)});`;
      return $$db.query(query, ids);
    };

    this.tags = function() {
      return $$db.query(
        "SELECT id, name FROM nodes WHERE is_deleted=0 AND category='tag';"
      );
    };

    this.insertNode = function(inputNode) {
        var node = newClass(Node, null);
        node.setFields(inputNode);
        return node.save();
    };

    this.recent = function () {
        var q = "SELECT id, category, name FROM nodes " +
            "WHERE is_deleted=0 AND category='thing' " +
            "ORDER BY id DESC " +
            "LIMIT 100;";
        return $q(function(resolve, reject) {
            $$db.query(q).then(resolve);
        });
    };

    this.getIndexNodes = function(type) {
        console.log("getIndexNodes");

        for (var key in self.indexNodes)
            delete self.indexNodes[key];

        var parent_where = "";
        if (type == 'obstacles')
            parent_where = "AND (p.id='obstacles' OR l.child_id='obstacles') ";
        else
            parent_where = "AND (h.child_id IS NOT NULL OR p.id='home') ";

        $$db.query(
            "SELECT n.*, parents.parent_id parent_id FROM nodes n " +
            "  JOIN (SELECT l.child_id, l.parent_id " +
            "    FROM links l JOIN nodes p ON (l.parent_id=p.id AND l.is_deleted=0 ) " +
            "    LEFT JOIN links h ON (p.id=h.child_id AND h.is_deleted=0 AND h.parent_id='home')" +
            "    WHERE p.is_deleted=0 AND p.category='tag' "+parent_where+" " +
            "  ) parents ON (n.id=child_id)" +
            "WHERE n.is_deleted=0 AND category='tag';"
        ).then(function (nodes) {
                nodes.forEach(function(node){
                    var parent = nodes.byID(node.parent_id);
                    if (parent == null) return;

                    if (typeof self.indexNodes[parent.id] == "undefined") {
                        self.indexNodes[parent.id] = parent;
                        parent.children = [];
                    }
                    parent.children.push(node);
                });
                $rootScope.$apply();
            });

        return self.indexNodes;
    }

});