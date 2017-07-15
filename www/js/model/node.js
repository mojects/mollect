ang

    .factory('Node', function(Link) {
        Node.prototype.Link = Link;
        return Node;
    });


/**
 * @class Node
 * @extends ActiveRecord
 **/
Node.prototype = new ActiveRecord();
extend(Node, NodeRelations);

var n = newClass(Node);

function Node (nodeId) {
  this.table = "nodes";
  this.id = nodeId;
  this.tags = [];
  this.rating = null;

  var self = this;

  self.fillDetails = (callback) => {
    self.db.query(
      "SELECT n.*, l.weight rating " +
      "FROM nodes n LEFT JOIN links l ON (n.id=l.child_id AND l.parent_id='avg_score')" +
      "WHERE n.id=?;", [self.id]
    ).fail(dbErrorHandler)
      .done(function (nodes) {
        self.setFields(nodes[0]);
        callback();
      });
  };

  self.setFields = (node) => {
    self.id = node.id;
    self.name = node.name;
    self.category = node.category;
    self.description = node.description || "";
    self.descriptionHtml = self.renderDescription();
    self.rating = node.rating;
    self.tags = node.tags;
  };

  self.renderDescription = () => {
    var converter = new showdown.Converter({simpleLineBreaks: true});
    var html = converter.makeHtml(self.description);
    return $$sce.trustAsHtml(html);
  };

    this.rate = function(rate) {

        newClass(Link).create({child_id: self.id,
                parent_id: 'scores',
                weight: rate},
            getAvgRate);

        function getAvgRate() {
            self.sql(
                "SELECT avg(weight) avgRate FROM links " +
                "WHERE child_id=? AND parent_id=?;",
                [self.id, 'scores']
            ).then(function (rows) {
                    setAvgScore(rows[0].avgRate);
                });
        }

        function setAvgScore(value) {
            self.rating = Math.round(value);
            var link = newClass(Link);
            link.update_or_create(
                {child_id: self.id, parent_id: 'avg_score', weight: self.rating},
                function() {}
            )
        }
    };

    this.save = function() {
        var deferred = $$q.defer();

        async.series([
            self.saveNode,
            self.linkTags,
            newClass(Loops).rebuildLoops
        ], function() {
            deferred.resolve(self.id);
        });

        return deferred.promise;
    };

    this.delete = function() {
        var deferred = $$q.defer();

        self.sql(
            "UPDATE nodes SET is_deleted=1, sync='new' WHERE id=?;", self.id,
            "UPDATE links SET is_deleted=1, sync='new' WHERE parent_id=?;", self.id,
            "UPDATE links SET is_deleted=1, sync='new' WHERE child_id=?;", self.id
        ).then(function () {
                deferred.resolve();
            });

        return deferred.promise;
    };

    this.saveNode = function(callback) {
        self.update_or_create(
            { id: self.id, name: self.name, category: self.category, description: self.description },
            callback);
    };

    this.getName = function(callback) {
        if (self.name) {
            callback(self.name);
        } else {
            self.fillDetails(function() {
                callback(self.name);
            });
        }
    };

}
