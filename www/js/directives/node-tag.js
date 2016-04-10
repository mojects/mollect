ang
.directive("nodeTag", function() {
    return {
        templateUrl : "js/directives/node-tag.html",
        scope : {
            node : "="
        },
        link : function(scope, elem, attrs) {

            scope.$watch("node", function(newVal, oldVal) {
                if (newVal) { updateClass(); }
            });

            function updateClass() {

                var c = scope.node.category;
                if (c == "thing")
                    scope.labelClass = "";
                else if (c == "tag")
                    scope.labelClass = "success";
                else
                    scope.labelClass = "alert";

            }


        }
    };
});