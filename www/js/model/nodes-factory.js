ang
    .service('NodesFactory', NodesFactory)

function NodesFactory($rootScope, Node) {

    var self = this;
    this.db = $.WebSQL('mollect');
    this.indexNodes = {};

    this.getNodeWithDetails = function(nodeId) {
        var node = newClass(Node, nodeId);
        node.name = "Loading...";


        async.parallel([
            node.fillDetails,
            node.fillParentTags
        ],function() {
            $rootScope.$apply();
        });

        return node;
    };

    this.tags = function() {
        var deferred = $$q.defer();

        this.db.query(
            "SELECT name FROM nodes WHERE is_deleted=0 AND category='tag';"
        ).fail(dbErrorHandler)
            .done(function (tags) {
                /*var tags_array = [];
                 angular.forEach(tags, function(tag) {
                 this.push(String(tag.name));
                 }, tags_array);*/
                deferred.resolve(tags);
            });

        return deferred.promise;
    };

    this.insertNode = function(inputNode) {
        var node = newClass(Node, null);
        node.setFields(inputNode);
        return node.save();
    };

    this.getIndexNodes = function(obstacles) {
        console.log("getIndexNodes");

        for (var key in self.indexNodes)
            delete self.indexNodes[key];

        var parent_where = "";
        var children_where = "";
        if (obstacles) {
            parent_where = "AND p.name='obstacles'"
            children_where = "AND parent_id IS NOT NULL";
        }
        this.db.query(
            "SELECT n.*, parents.parent_id FROM nodes n " +
            "LEFT JOIN (SELECT child_id, parent_id " +
            "FROM links l JOIN nodes p ON (parent_id=p.id)" +
            "WHERE l.is_deleted=0 and p.is_deleted=0 AND p.category='tag' "+parent_where+" " +
            ") parents ON (n.id=child_id)" +
            "WHERE n.is_deleted=0 AND category='tag' "+children_where+";"
        ).fail(dbErrorHandler)
            .done(function (nodes) {
                nodes.forEach(function(node){
                    var key = "Other", n;
                    if (node.parent_id && (n = nodes.byID(node.parent_id)))
                        key = n.name;

                    if (typeof self.indexNodes[key] == "undefined")  self.indexNodes[key] = [];
                    self.indexNodes[key].push(node);
                })
                $rootScope.$apply();
            });

        return self.indexNodes;
    };

};