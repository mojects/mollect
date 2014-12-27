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

    this.addTag = function(tag) {
        self.relatedTags.push(tag);
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
        var r = {selected: [], unselected: []};

        self.currentStepNode.getName(function(){
            if (self.currentStepNode.category == "tag")
                r.selected.push(self.currentStepNode);
            else
                fillForThing();
        });


        function fillForThing() {
            r.unselected.push(self.currentStepNode);

            async.parallel({
                    stepParentTags: self.currentStepNode.fillParentTags
                    // caseChildTags: self.currentCaseNode.getChildTags
                },
                function (err, rows) {
                    self.currentStepNode.tags.forEach(function(row) {
                        r.selected.pushUnique(row);
                    });
                    /*rows.caseChildTags.forEach(function(row) {
                     r.selected.pushUnique(row);
                     });*/

                    $rootScope.$apply();
                });
        }


        return r;

    };

    this.getRelatedNodes = function() {
        var result = { an_obstacles: [], children: [], related: [] };
        async.parallel({
                directChildren: this.currentStepNode.getDirectChildren,
                parentTagReactions:        this.currentStepNode.getParentTagReactions
            },
            function (err, related) {
                // Вытащить obstalces в отдельную категорию
                self.distributeToSubcategories(result, related);
            });

        return result;
    }
    
    this.distributeToSubcategories = function(result, related) {

        // Вытащить многомерный массив в плоский:
        var all_nodes = [related.directChildren, related.parentTagReactions]
            .reduce(function(a, b) {
                return a.concat(b);
            });

        if (all_nodes.length < 1) return;

        var ids = [];

        all_nodes.forEach(function(node) {
             ids.push(node.id);
        });

        newClass(NodesWalker, ids).leaveOnlyObstacles()
        .then(function(only_obstacles_ids) {
                related.directChildren.forEach(distribute.bind(result.children, only_obstacles_ids));
                related.parentTagReactions.forEach(distribute.bind(result.related, only_obstacles_ids));
        });

        function distribute(only_obstacles_ids, node) {
            if (only_obstacles_ids.indexOf(node.id) !== -1)
                result.an_obstacles.push(node);
            else
                this.push(node);
        }
        
    }

}
    
    