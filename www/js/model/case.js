ang

    .service('Case', Case)

function Case() {

    var current = null;
    var that = this;

    this.createFreshCase = function() {
        var node = this.current = new Node();
        node.category='case';
        return node.save();
    }

    this.getAttributesForNewReaction = function() {
        // 1. Текущая ситуация (то, что как бы из нее прямо вытекает) - не поставлено по умолчанию.
        // 2. Тэги текущей ситуации (Пока что все)

    };

    this.addTag = function() {

    }

}
    
    