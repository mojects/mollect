ang.factory('Node', function() { return Node })

/**
 * @class Node
 * @extends ActiveRecord
 * example:
 *  var n = newClass(Node);
 **/
Node.prototype = new ActiveRecord();
extend(Node, NodeRelations);

function Node (nodeId) {
  this.table = "nodes";
  this.fields = ["id", "name", "description", "avg_weight"]

  this.id = nodeId;
  this.tags = [];
  this.rating = null;

  var self = this;

  self.fillDetails = (callback) => {
    self.query(
      `SELECT n.* FROM nodes n WHERE n.id=? `, [self.id]
    ).then((nodes) => {
      self.setFields(nodes[0])
      callback()
    });
  };

  self.setFields = (node) => {
    self.id = node.id;
    self.name = node.name;
    self.category = node.category;
    self.description = node.description || "";
    self.descriptionHtml = self.renderDescription();
    self.rating = node.avg_weight
    self.tags = node.tags;
  };

  self.renderDescription = () => {
    var converter = new showdown.Converter({simpleLineBreaks: true});
    var html = converter.makeHtml(self.description);
    return $$sce.trustAsHtml(html);
  };

  this.rate = async (rate) =>
    newClass(Link)
      .findOrCreateBy({
        child_id: self.id,
        parent_id: 'scores'
      })
      .then((rating) => {
        if (!rating.weight) rating.weight = 0
        rating.weight += rate
        return rating.save()
      })
      .then((rating) => {
        self.avg_weight = rating.weight
        return self.save()
      })

    this.save = function() {
        var deferred = $$q.defer()

        async.series([
          self.saveNode,
          self.linkTags,
          (cb) => {
            newClass(Loops).rebuildLoops().then(cb)
          }
        ], function() {
            deferred.resolve(self.id);
        });

        return deferred.promise;
    };

    this.delete = function() {
        var deferred = $$q.defer();

        self.query(
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