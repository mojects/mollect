ang

    .service('Case', Case)

function Case($rootScope, Node) {

    this.currentCaseNode = null;
    this.currentStepNode = null;
    this.relatedTags = [];
    var self = this;

    this.createFreshCase = function() {
        var node = this.currentCaseNode = newClass(Node);
        node.name = "case";
        node.description = currentDateTime();
        node.category='case';
        node.isTemp = true;
        return node.save();
    }

    this.getRecentCase = function(callback) {
        var node = newClass(Node);
        node.isTemp = true;
        node.findLastCase(function(found) {
            if (found) self.currentCaseNode = node;
            callback(found);
        });
    }

    this.searchNodes = function() {
        return $$q(function(resolve) {
            var include_ids = [];
            var exclude_ids = [];
            self.relatedTags.forEach(function(item, key){
                if (item.weight >= 0)
                    include_ids.push(key);
                else
                    exclude_ids.push(key);
            });
            var c = newClass(NodesCollection, include_ids);
            c.exclude_ids = exclude_ids;
            c.getChildrenRecursive(resolve);
        });

    }

    this.addTag = function(tag) {
        self.relatedTags[tag.id] = tag;
        return self.attachNode(tag.id);
    }

    this.attachNode = function(nodeId) {
        var deferred = $$q.defer();

        async.series([
            function(callback) {
                if (self.currentCaseNode) {
                    callback();
                    return;
                }
                self.getRecentCase(function (found) {
                    if (found) {
                        callback();
                    } else {
                        self.createFreshCase().then(function(){ callback(); });
                    }
                });

            }, function(callback) {
                self.currentStepNode = newClass(Node, nodeId);
                self.currentCaseNode
                    .linkChild(self.currentStepNode)
                    .then(callback);
            }
        ], function(err, results) {
            deferred.resolve();
        });

        return deferred.promise;
    }

    this.getAttributesForNewReaction = function() {
        // 1. Текущая нода (то, что как бы из нее прямо вытекает)
        //    - не поставлено по умолчанию.
        // 3. Тэги текущего нода
        // 2. Тэги текущей ситуации (Пока что все)
        var r = {selected: null, unselected: null};
        r.selected = [];
        r.unselected = [];
        self.currentStepNode.getName(function(name){
            r.unselected.push(self.currentStepNode);
        });

        async.parallel({
                stepParentTags: self.currentStepNode.fillParentTags
                // caseChildTags: self.currentCaseNode.getChildTags
            },
            function (err, rows) {
                self.currentStepNode.tags.forEach(function(row) {
                    r.selected.pushUnique(row);
                });

                rows.caseChildTags.forEach(function(row) {
                    r.selected.pushUnique(row);
                });

                $rootScope.$apply();
            });

        return r;
    };

    this.getRelatedNodes = function() {
        var result = { obstacles: [], others: [] };
        async.parallel([
                this.currentStepNode.getDirectChildren,
                this.currentStepNode.getParentTagReactions
            ],
            function (err, r) {
                // Вытащить многомерный массив в плоский:
                var merged_array = r.reduce(function(a, b) {
                    return a.concat(b);
                });
                // Распределить по obstalces и другим:
                if (merged_array.length > 0)
                    self.distributeToSubcategories(result, merged_array);
                // $.extend(result, subcats);
                // $rootScope.$apply();
            });

        return result;
    }
    
    this.distributeToSubcategories = function(result, nodes) {
        var obstacles = [], others = [], ids = [];
        nodes.forEach(function(node) {
             ids.push(node.id);
        });
        newClass(NodesCollection, ids).removeNonObstacles()
        .then(function(only_obstacles_ids) {
            nodes.forEach(function(node) {
                 if (only_obstacles_ids.indexOf(node.id) !== -1)
                    obstacles.push(node);
                else
                    others.push(node);
            });
            result.others = others;
            result.obstacles = obstacles;
        });
        
    }

}
    
    