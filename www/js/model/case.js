ang

    .service('Case', Case)

function Case($q, $rootScope, Node) {

    this.currentCaseNode = null;
    this.currentStepNode = null;
    var self = this;

    this.createFreshCase = function() {
        var node = this.currentCaseNode = new Node();
        node.name = "case";
        node.description = currentDateTime();
        node.category='case';
        node.isTemp = true;
        return node.save();
    }

    this.getRecentCase = function(callback) {
        var node = new Node();
        node.isTemp = true;
        node.findLastCase(function(found) {
            if (found) self.currentCaseNode = node;
            callback(found);
        });
    }

    this.attachNode = function(nodeId) {
        var deferred = $q.defer();

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
                self.currentStepNode = new Node(nodeId);
                self.currentCaseNode.linkChild(self.currentStepNode);
                callback();
            }
        ], function(err, results) {
            deferred.resolve();
        });

        return deferred.promise;
    }

    this.getAttributesForNewReaction = function() {
        // 1. Текущая ситуация (то, что как бы из нее прямо вытекает) - не поставлено по умолчанию.
        // 2. Тэги текущей ситуации (Пока что все)

    };

    this.addTag = function() {

    }

    this.getRelatedNodes = function() {
        var result = {};
        async.parallel([
                this.currentStepNode.getDirectChildren,
                this.currentStepNode.getParentTagReactions
            ],
        function (err, r) {
            var merged_array = r.reduce(function(a, b) {
                return a.concat(b);
            });
            $.extend(result, merged_array);
            $rootScope.$apply();
        });

        return result;
    }

}
    
    