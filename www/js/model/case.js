ang

    .service('Case', Case)

function Case($q, $rootScope, Node) {

    this.currentCaseNode = null;
    this.currentStepNode = null;
    var that = this;

    this.createFreshCase = function() {
        var node = this.currentCaseNode = new Node();
        node.category='case';
        return node.save();
    }

    this.attachNode = function(nodeId) {
        this.currentStepNode = new Node(nodeId);
        this.currentCaseNode.linkChild(this.currentStepNode);
        return $q(function(resolve, reject) {
                    resolve('Hello, ' + name + '!');
        });
    }

    this.getAttributesForNewReaction = function() {
        // 1. Текущая ситуация (то, что как бы из нее прямо вытекает) - не поставлено по умолчанию.
        // 2. Тэги текущей ситуации (Пока что все)

    };

    this.addTag = function() {

    }

    this.getRelatedNodes = function() {
        var result = {};
        async.parallel({
                directChildren: this.currentStepNode.getDirectChildren,
                parentTagReactions: this.currentStepNode.getParentTagReactions
            },
        function (err, r) {
            $.extend(result, r);
            $rootScope.$apply();
        });

        return result;
    }

}
    
    